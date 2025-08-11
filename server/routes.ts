import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertContactMessageSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || ""
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all menu items
  app.get("/api/menu", async (req, res) => {
    try {
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  // Get menu items by category
  app.get("/api/menu/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const items = await storage.getMenuItemsByCategory(category);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items by category" });
    }
  });

  // Get single menu item
  app.get("/api/menu/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getMenuItem(id);
      if (!item) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu item" });
    }
  });

  // Get AI recommendations
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { preferences, previousOrders } = req.body;
      const menuItems = await storage.getMenuItems();
      
      if (!openai.apiKey) {
        // Fallback recommendations if no API key
        const fallbackRecommendations = menuItems.slice(0, 2).map(item => ({
          ...item,
          reason: "Popular choice among our customers"
        }));
        return res.json(fallbackRecommendations);
      }

      const prompt = `Based on the following menu items and user preferences, recommend 2-3 dishes that would be perfect for this customer. 

Menu items: ${JSON.stringify(menuItems.map(item => ({
  id: item.id,
  name: item.name,
  description: item.description,
  category: item.category,
  tags: item.tags,
  price: item.price
})))}

User preferences: ${preferences || "No specific preferences provided"}
Previous orders: ${previousOrders || "No previous order history"}

Please respond with a JSON object containing an array called "recommendations". Each recommendation should include:
- id: the menu item id
- name: dish name
- description: dish description  
- price: dish price
- image: use the original image URL from the menu
- reason: a personalized 1-2 sentence explanation of why this dish is recommended for this user
- category: dish category

Limit to 2-3 recommendations that best match the user's preferences.`;

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 1000,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      // Add image URLs from original menu items
      const recommendations = result.recommendations?.map((rec: any) => {
        const originalItem = menuItems.find(item => item.id === rec.id);
        return {
          ...rec,
          image: originalItem?.image || rec.image
        };
      }) || [];

      res.json(recommendations);
    } catch (error) {
      console.error("AI recommendation error:", error);
      // Fallback to simple recommendations
      const menuItems = await storage.getMenuItems();
      const fallbackRecommendations = menuItems.slice(0, 2).map(item => ({
        ...item,
        reason: "Recommended based on popularity"
      }));
      res.json(fallbackRecommendations);
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const validatedOrder = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedOrder);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  // Get order by ID
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Submit contact message
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedMessage = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedMessage);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid contact message data" });
    }
  });

  // Twilio token endpoint (proxy to your external API)
  app.post("/api/twilio/token", async (req, res) => {
    try {
      const response = await fetch('https://orderlybite.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error getting Twilio token:", error);
      res.status(500).json({ error: "Failed to get Twilio token" });
    }
  });

  // Twilio SMS endpoint (proxy to your external API)
  app.post("/api/twilio/sms", async (req, res) => {
    try {
      const { to, message } = req.body;
      
      // Create form data as expected by your API
      const formData = new URLSearchParams();
      formData.append('From', to); // Use the customer's phone number as caller ID
      formData.append('To', '+18044092778'); // Your Twilio number
      formData.append('Body', message);
      formData.append('MessageSid', `SM${Date.now()}${Math.random().toString(36).substr(2, 9)}`);
      
      const response = await fetch('https://orderlybite.com/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      // Handle both XML and JSON responses
      const responseText = await response.text();
      let data;
      
      try {
        // Try to parse as JSON first
        data = JSON.parse(responseText);
      } catch (e) {
        // If it's XML or plain text, return it as is
        data = { 
          success: true, 
          response: responseText,
          contentType: response.headers.get('content-type') || 'unknown'
        };
      }
      
      res.json({ success: true, ...data });
    } catch (error) {
      console.error("Error sending SMS:", error);
      res.status(500).json({ error: "Failed to send SMS" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
