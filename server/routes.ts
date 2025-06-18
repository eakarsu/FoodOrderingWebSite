import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import { storage } from "./storage";
import { insertOrderSchema, insertContactMessageSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || ""
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve sectors directory as static files
  app.use('/sectors', express.static(path.resolve(process.cwd(), 'sectors')));

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

  // AI Services Endpoints

  // Predictive Scheduling
  app.post("/api/ai/scheduling/predict", async (req, res) => {
    try {
      const { userId, serviceType, availableSlots, sectorId } = req.body;
      
      // Import AI services dynamically to avoid circular dependencies
      const { predictiveSchedulingAI } = await import("../src/lib/ai-services");
      
      const result = await predictiveSchedulingAI.predictOptimalSlots(
        userId,
        serviceType,
        availableSlots
      );
      
      res.json(result);
    } catch (error) {
      console.error("Predictive scheduling error:", error);
      res.status(500).json({ message: "Failed to generate scheduling predictions" });
    }
  });

  app.post("/api/ai/scheduling/analyze-preferences", async (req, res) => {
    try {
      const { userId, pastAppointments } = req.body;
      
      const { predictiveSchedulingAI } = await import("../src/lib/ai-services");
      const preferences = await predictiveSchedulingAI.analyzeSchedulingPreferences(userId, pastAppointments);
      
      res.json(preferences);
    } catch (error) {
      console.error("Preference analysis error:", error);
      res.status(500).json({ message: "Failed to analyze scheduling preferences" });
    }
  });

  // Email Management
  app.post("/api/ai/email/analyze", async (req, res) => {
    try {
      const { emailContent, sender, subject } = req.body;
      
      const { emailManagementAI } = await import("../src/lib/ai-services");
      const analysis = await emailManagementAI.analyzeEmail(emailContent, sender, subject);
      
      res.json(analysis);
    } catch (error) {
      console.error("Email analysis error:", error);
      res.status(500).json({ message: "Failed to analyze email" });
    }
  });

  app.post("/api/ai/email/categorize", async (req, res) => {
    try {
      const { emails } = req.body;
      
      const { emailManagementAI } = await import("../src/lib/ai-services");
      const categorized = await emailManagementAI.categorizeEmails(emails);
      
      res.json(categorized);
    } catch (error) {
      console.error("Email categorization error:", error);
      res.status(500).json({ message: "Failed to categorize emails" });
    }
  });

  // Document Management
  app.post("/api/ai/document/analyze", async (req, res) => {
    try {
      const { content, documentType, sectorId } = req.body;
      
      const { documentManagementAI } = await import("../src/lib/ai-services");
      const analysis = await documentManagementAI.analyzeDocument(content, documentType, sectorId);
      
      res.json(analysis);
    } catch (error) {
      console.error("Document analysis error:", error);
      res.status(500).json({ message: "Failed to analyze document" });
    }
  });

  // Call Handling
  app.post("/api/ai/call/analyze", async (req, res) => {
    try {
      const { transcript, callerInfo } = req.body;
      
      const { callHandlingAI } = await import("../src/lib/ai-services");
      const analysis = await callHandlingAI.analyzeCall(transcript, callerInfo);
      
      res.json(analysis);
    } catch (error) {
      console.error("Call analysis error:", error);
      res.status(500).json({ message: "Failed to analyze call" });
    }
  });

  // Sector-Specific AI
  app.post("/api/ai/sector/analyze", async (req, res) => {
    try {
      const { sectorId, data } = req.body;
      
      const { sectorSpecificAI } = await import("../src/lib/ai-services");
      const analysis = await sectorSpecificAI.analyzeForSector(sectorId, data);
      
      res.json(analysis);
    } catch (error) {
      console.error("Sector analysis error:", error);
      res.status(500).json({ message: "Failed to perform sector-specific analysis" });
    }
  });

  // Workflow Automation
  app.post("/api/workflow/execute", async (req, res) => {
    try {
      const { templateId, initialData } = req.body;
      
      const { workflowEngine } = await import("../src/lib/workflow-automation");
      const execution = await workflowEngine.executeWorkflow(templateId, initialData);
      
      res.json(execution);
    } catch (error) {
      console.error("Workflow execution error:", error);
      res.status(500).json({ message: "Failed to execute workflow" });
    }
  });

  app.get("/api/workflow/templates/:sectorId", async (req, res) => {
    try {
      const { sectorId } = req.params;
      
      const { workflowEngine } = await import("../src/lib/workflow-automation");
      const templates = await workflowEngine.getTemplatesBySector(sectorId);
      
      res.json(templates);
    } catch (error) {
      console.error("Workflow templates error:", error);
      res.status(500).json({ message: "Failed to fetch workflow templates" });
    }
  });

  app.post("/api/workflow/templates", async (req, res) => {
    try {
      const templateData = req.body;
      
      const { workflowEngine } = await import("../src/lib/workflow-automation");
      const template = await workflowEngine.createTemplate(templateData);
      
      res.status(201).json(template);
    } catch (error) {
      console.error("Workflow template creation error:", error);
      res.status(500).json({ message: "Failed to create workflow template" });
    }
  });

  // Analytics and Business Intelligence
  app.post("/api/analytics/report", async (req, res) => {
    try {
      const { sectorId, period } = req.body;
      
      const { analyticsEngine } = await import("../src/lib/analytics-service");
      const report = await analyticsEngine.generatePerformanceReport(sectorId, period);
      
      res.json(report);
    } catch (error) {
      console.error("Analytics report error:", error);
      res.status(500).json({ message: "Failed to generate analytics report" });
    }
  });

  app.post("/api/analytics/predict", async (req, res) => {
    try {
      const { sectorId, analysisType, historicalData } = req.body;
      
      const { analyticsEngine } = await import("../src/lib/analytics-service");
      const prediction = await analyticsEngine.generatePredictiveAnalysis(sectorId, analysisType, historicalData);
      
      res.json(prediction);
    } catch (error) {
      console.error("Predictive analysis error:", error);
      res.status(500).json({ message: "Failed to generate predictive analysis" });
    }
  });

  app.post("/api/analytics/customer-behavior", async (req, res) => {
    try {
      const { sectorId, customerData } = req.body;
      
      const { analyticsEngine } = await import("../src/lib/analytics-service");
      const analysis = await analyticsEngine.analyzeCustomerBehavior(sectorId, customerData);
      
      res.json(analysis);
    } catch (error) {
      console.error("Customer behavior analysis error:", error);
      res.status(500).json({ message: "Failed to analyze customer behavior" });
    }
  });

  app.get("/api/analytics/metrics/:sectorId", async (req, res) => {
    try {
      const { sectorId } = req.params;
      
      const { analyticsEngine } = await import("../src/lib/analytics-service");
      const metrics = await analyticsEngine.getMetrics(sectorId);
      
      res.json(metrics);
    } catch (error) {
      console.error("Metrics retrieval error:", error);
      res.status(500).json({ message: "Failed to retrieve metrics" });
    }
  });

  // Communication Services
  app.post("/api/communication/send", async (req, res) => {
    try {
      const messageData = req.body;
      
      const { communicationService } = await import("../src/lib/communication-service");
      const message = await communicationService.sendMultiModalMessage(messageData);
      
      res.json(message);
    } catch (error) {
      console.error("Communication send error:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.post("/api/communication/translate", async (req, res) => {
    try {
      const translationRequest = req.body;
      
      const { communicationService } = await import("../src/lib/communication-service");
      const result = await communicationService.translateMessage(translationRequest);
      
      res.json(result);
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ message: "Failed to translate message" });
    }
  });

  app.post("/api/communication/call/handle", async (req, res) => {
    try {
      const callData = req.body;
      
      const { communicationService } = await import("../src/lib/communication-service");
      const analysis = await communicationService.handleIncomingCall(callData);
      
      res.json(analysis);
    } catch (error) {
      console.error("Call handling error:", error);
      res.status(500).json({ message: "Failed to handle call" });
    }
  });

  app.get("/api/communication/channels", async (req, res) => {
    try {
      const { communicationService } = await import("../src/lib/communication-service");
      const channels = await communicationService.getActiveChannels();
      
      res.json(channels);
    } catch (error) {
      console.error("Channels retrieval error:", error);
      res.status(500).json({ message: "Failed to retrieve communication channels" });
    }
  });

  // Security and Compliance
  app.post("/api/security/evaluate", async (req, res) => {
    try {
      const { action, resource, context } = req.body;
      
      const { securityComplianceEngine } = await import("../src/lib/security-compliance");
      const evaluation = await securityComplianceEngine.evaluateSecurityRules(action, resource, context);
      
      res.json(evaluation);
    } catch (error) {
      console.error("Security evaluation error:", error);
      res.status(500).json({ message: "Failed to evaluate security rules" });
    }
  });

  app.post("/api/security/incident", async (req, res) => {
    try {
      const incidentData = req.body;
      
      const { securityComplianceEngine } = await import("../src/lib/security-compliance");
      const incident = await securityComplianceEngine.createSecurityIncident(incidentData);
      
      res.status(201).json(incident);
    } catch (error) {
      console.error("Security incident creation error:", error);
      res.status(500).json({ message: "Failed to create security incident" });
    }
  });

  app.get("/api/security/incidents", async (req, res) => {
    try {
      const { status } = req.query;
      
      const { securityComplianceEngine } = await import("../src/lib/security-compliance");
      const incidents = await securityComplianceEngine.getSecurityIncidents(status as any);
      
      res.json(incidents);
    } catch (error) {
      console.error("Security incidents retrieval error:", error);
      res.status(500).json({ message: "Failed to retrieve security incidents" });
    }
  });

  app.post("/api/compliance/check", async (req, res) => {
    try {
      const { sectorId, framework } = req.body;
      
      const { securityComplianceEngine } = await import("../src/lib/security-compliance");
      const checks = await securityComplianceEngine.performComplianceCheck(sectorId, framework);
      
      res.json(checks);
    } catch (error) {
      console.error("Compliance check error:", error);
      res.status(500).json({ message: "Failed to perform compliance check" });
    }
  });

  app.get("/api/compliance/status/:sectorId", async (req, res) => {
    try {
      const { sectorId } = req.params;
      
      const { securityComplianceEngine } = await import("../src/lib/security-compliance");
      const status = await securityComplianceEngine.getComplianceStatus(sectorId);
      
      res.json(status);
    } catch (error) {
      console.error("Compliance status error:", error);
      res.status(500).json({ message: "Failed to retrieve compliance status" });
    }
  });

  app.post("/api/security/classify-data", async (req, res) => {
    try {
      const { dataId, content, context } = req.body;
      
      const { securityComplianceEngine } = await import("../src/lib/security-compliance");
      const classification = await securityComplianceEngine.classifyData(dataId, content, context);
      
      res.json(classification);
    } catch (error) {
      console.error("Data classification error:", error);
      res.status(500).json({ message: "Failed to classify data" });
    }
  });

  // Knowledge Base and RAG
  app.post("/api/knowledge/query", async (req, res) => {
    try {
      const { query, sectorId } = req.body;
      
      const { knowledgeBaseRAG } = await import("../src/lib/ai-services");
      const results = await knowledgeBaseRAG.queryKnowledgeBase(query, sectorId);
      
      res.json(results);
    } catch (error) {
      console.error("Knowledge base query error:", error);
      res.status(500).json({ message: "Failed to query knowledge base" });
    }
  });

  app.post("/api/knowledge/add", async (req, res) => {
    try {
      const documentData = req.body;
      
      const { knowledgeBaseRAG } = await import("../src/lib/ai-services");
      await knowledgeBaseRAG.addToKnowledgeBase(documentData);
      
      res.status(201).json({ message: "Document added to knowledge base" });
    } catch (error) {
      console.error("Knowledge base add error:", error);
      res.status(500).json({ message: "Failed to add document to knowledge base" });
    }
  });

  // Autonomous Task Execution
  app.post("/api/autonomous/execute", async (req, res) => {
    try {
      const taskData = req.body;
      
      const { autonomousTaskExecutor } = await import("../src/lib/ai-services");
      const result = await autonomousTaskExecutor.executeTask(taskData);
      
      res.json(result);
    } catch (error) {
      console.error("Autonomous task execution error:", error);
      res.status(500).json({ message: "Failed to execute autonomous task" });
    }
  });

  // Integration Management
  app.get("/api/integration/status", async (req, res) => {
    try {
      const { integrationManager } = await import("../src/lib/workflow-automation");
      const status = integrationManager.getIntegrationStatus();
      
      res.json(status);
    } catch (error) {
      console.error("Integration status error:", error);
      res.status(500).json({ message: "Failed to retrieve integration status" });
    }
  });

  app.post("/api/integration/calendar/sync", async (req, res) => {
    try {
      const { platform } = req.body;
      
      const { integrationManager } = await import("../src/lib/workflow-automation");
      const events = await integrationManager.syncCalendarEvents(platform);
      
      res.json(events);
    } catch (error) {
      console.error("Calendar sync error:", error);
      res.status(500).json({ message: "Failed to sync calendar events" });
    }
  });

  app.post("/api/integration/crm/sync", async (req, res) => {
    try {
      const { platform } = req.body;
      
      const { integrationManager } = await import("../src/lib/workflow-automation");
      const contacts = await integrationManager.syncCRMContacts(platform);
      
      res.json(contacts);
    } catch (error) {
      console.error("CRM sync error:", error);
      res.status(500).json({ message: "Failed to sync CRM contacts" });
    }
  });

  // Cultural Adaptation
  app.post("/api/communication/adapt", async (req, res) => {
    try {
      const { message, targetCulture, context } = req.body;
      
      const { culturalAdaptationService } = await import("../src/lib/communication-service");
      const adaptation = await culturalAdaptationService.adaptCommunication(message, targetCulture, context);
      
      res.json(adaptation);
    } catch (error) {
      console.error("Cultural adaptation error:", error);
      res.status(500).json({ message: "Failed to adapt communication" });
    }
  });

  // Collaborative AI Agents
  app.get("/api/agents", async (req, res) => {
    try {
      const { collaborativeAISystem } = await import("../src/lib/autonomous-agents");
      const agents = await collaborativeAISystem.getAgents();
      
      res.json(agents);
    } catch (error) {
      console.error("Agents retrieval error:", error);
      res.status(500).json({ message: "Failed to retrieve agents" });
    }
  });

  app.get("/api/agents/:agentId", async (req, res) => {
    try {
      const { agentId } = req.params;
      
      const { collaborativeAISystem } = await import("../src/lib/autonomous-agents");
      const agent = await collaborativeAISystem.getAgent(agentId);
      
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      
      res.json(agent);
    } catch (error) {
      console.error("Agent retrieval error:", error);
      res.status(500).json({ message: "Failed to retrieve agent" });
    }
  });

  app.post("/api/agents/tasks", async (req, res) => {
    try {
      const taskData = req.body;
      
      const { collaborativeAISystem } = await import("../src/lib/autonomous-agents");
      const task = await collaborativeAISystem.assignTask(taskData);
      
      res.status(201).json(task);
    } catch (error) {
      console.error("Task assignment error:", error);
      res.status(500).json({ message: "Failed to assign task to agents" });
    }
  });

  app.get("/api/agents/tasks/active", async (req, res) => {
    try {
      const { collaborativeAISystem } = await import("../src/lib/autonomous-agents");
      const tasks = await collaborativeAISystem.getActiveTasks();
      
      res.json(tasks);
    } catch (error) {
      console.error("Active tasks retrieval error:", error);
      res.status(500).json({ message: "Failed to retrieve active tasks" });
    }
  });

  app.get("/api/agents/tasks/:taskId", async (req, res) => {
    try {
      const { taskId } = req.params;
      
      const { collaborativeAISystem } = await import("../src/lib/autonomous-agents");
      const task = await collaborativeAISystem.getTask(taskId);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      console.error("Task retrieval error:", error);
      res.status(500).json({ message: "Failed to retrieve task" });
    }
  });

  app.post("/api/agents/handoff", async (req, res) => {
    try {
      const { fromAgentId, toAgentId, task, reason } = req.body;
      
      const { collaborativeAISystem } = await import("../src/lib/autonomous-agents");
      const handoff = await collaborativeAISystem.requestHandoff(fromAgentId, toAgentId, task, reason);
      
      res.status(201).json(handoff);
    } catch (error) {
      console.error("Handoff request error:", error);
      res.status(500).json({ message: "Failed to request handoff" });
    }
  });

  app.post("/api/agents/handoff/:handoffId/accept", async (req, res) => {
    try {
      const { handoffId } = req.params;
      const { agentId } = req.body;
      
      const { collaborativeAISystem } = await import("../src/lib/autonomous-agents");
      await collaborativeAISystem.acceptHandoff(handoffId, agentId);
      
      res.json({ message: "Handoff accepted successfully" });
    } catch (error) {
      console.error("Handoff acceptance error:", error);
      res.status(500).json({ message: "Failed to accept handoff" });
    }
  });

  app.get("/api/agents/handoffs/pending", async (req, res) => {
    try {
      const { collaborativeAISystem } = await import("../src/lib/autonomous-agents");
      const handoffs = await collaborativeAISystem.getPendingHandoffs();
      
      res.json(handoffs);
    } catch (error) {
      console.error("Pending handoffs retrieval error:", error);
      res.status(500).json({ message: "Failed to retrieve pending handoffs" });
    }
  });

  app.get("/api/agents/performance", async (req, res) => {
    try {
      const { collaborativeAISystem } = await import("../src/lib/autonomous-agents");
      const report = await collaborativeAISystem.getAgentPerformanceReport();
      
      res.json(report);
    } catch (error) {
      console.error("Performance report error:", error);
      res.status(500).json({ message: "Failed to generate performance report" });
    }
  });

  app.get("/api/agents/:agentId/communications", async (req, res) => {
    try {
      const { agentId } = req.params;
      
      const { collaborativeAISystem } = await import("../src/lib/autonomous-agents");
      const communications = await collaborativeAISystem.getAgentCommunications(agentId);
      
      res.json(communications);
    } catch (error) {
      console.error("Agent communications error:", error);
      res.status(500).json({ message: "Failed to retrieve agent communications" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
