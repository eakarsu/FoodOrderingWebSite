import { 
  menuItems, 
  orders, 
  contactMessages,
  type MenuItem, 
  type InsertMenuItem,
  type Order,
  type InsertOrder,
  type ContactMessage,
  type InsertContactMessage 
} from "@shared/schema";

export interface IStorage {
  // Menu items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  
  // Contact messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private menuItems: Map<number, MenuItem>;
  private orders: Map<number, Order>;
  private contactMessages: Map<number, ContactMessage>;
  private currentMenuId: number;
  private currentOrderId: number;
  private currentMessageId: number;

  constructor() {
    this.menuItems = new Map();
    this.orders = new Map();
    this.contactMessages = new Map();
    this.currentMenuId = 1;
    this.currentOrderId = 1;
    this.currentMessageId = 1;
    
    // Initialize with sample menu items
    this.initializeMenuItems();
  }

  private initializeMenuItems() {
    const sampleItems: Omit<MenuItem, 'id'>[] = [
      // Acai Bowls
      {
        name: "Acai Bowl",
        description: "Acai, Banana, Blueberry, Strawberry, Granola, Coconut, Honey",
        price: "12.97",
        image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "acai-bowls",
        tags: ["healthy", "vegan"],
        available: true
      },
      
      // Breakfast Combos
      {
        name: "French Toast",
        description: "Texas style french toast served with butter and syrup",
        price: "9.95",
        image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "breakfast-combos",
        tags: [],
        available: true
      },
      {
        name: "Healthy One",
        description: "Three egg whites, turkey, spinach, Alpine Lace Swiss, in a whole wheat wrap",
        price: "11.64",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "breakfast-combos",
        tags: ["healthy"],
        available: true
      },
      {
        name: "Hungry Man",
        description: "Three eggs, ham, bacon, sausage, and cheese on a hero",
        price: "12.95",
        image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "breakfast-combos",
        tags: [],
        available: true
      },
      {
        name: "Melville Platter",
        description: "Two eggs, ham, bacon, sausage, home-fries, and toast",
        price: "12.95",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "breakfast-combos",
        tags: [],
        available: true
      },
      {
        name: "Protein Slammer",
        description: "Five egg whites, extra turkey, Alpine Lace Swiss cheese, on a whole wheat wrap",
        price: "12.94",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "breakfast-combos",
        tags: ["healthy"],
        available: true
      },
      {
        name: "Super Thing",
        description: "Two eggs, extra bacon, extra sausage, onions, and American cheese",
        price: "12.94",
        image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "breakfast-combos",
        tags: [],
        available: true
      },

      // Cold Sandwiches
      {
        name: "Balsamic Avocado Hero",
        description: "Turkey breast, avocado, tomato, romaine lettuce and balsamic vinaigrette",
        price: "17.95",
        image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "cold-sandwiches",
        tags: ["healthy"],
        available: true
      },
      {
        name: "Italian Hero",
        description: "Capicola ham, salami, pepperoni, lettuce, tomato, Provolone cheese and Italian dressing on a hero",
        price: "17.95",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "cold-sandwiches",
        tags: [],
        available: true
      },
      {
        name: "Turkey Club Hero",
        description: "Roast turkey breast, bacon, lettuce, tomato and mayo on a hero",
        price: "17.95",
        image: "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "cold-sandwiches",
        tags: [],
        available: true
      },
      {
        name: "Cajun Roast Beef Hero",
        description: "Cajun roast beef, Cheddar cheese, lettuce, roasted red peppers and creole mayo",
        price: "17.95",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "cold-sandwiches",
        tags: ["spicy"],
        available: true
      },
      {
        name: "California Hero",
        description: "Turkey breast, avocado, lettuce, tomatoes and Russian dressing",
        price: "17.95",
        image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "cold-sandwiches",
        tags: ["healthy"],
        available: true
      },
      {
        name: "Chicken Knock Out Hero",
        description: "Fried chicken cutlet, hot cherry peppers, jalapeño Jack cheese, lettuce, tomato, and horseradish dressing",
        price: "17.95",
        image: "https://images.unsplash.com/photo-1606755456206-1f6d5ba933df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "cold-sandwiches",
        tags: ["spicy"],
        available: true
      },
      {
        name: "Dagwood Hero",
        description: "Roast beef, turkey, ham, American, Swiss, lettuce, tomato, and mayo",
        price: "17.95",
        image: "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "cold-sandwiches",
        tags: [],
        available: true
      },
      {
        name: "Grandpa Ted Hero",
        description: "Turkey breast, Genoa salami, cole-slaw and mustard",
        price: "17.95",
        image: "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "cold-sandwiches",
        tags: [],
        available: true
      },
      {
        name: "Honey Dipped Chicken Hero",
        description: "Chicken cutlet, Cheddar cheese, romaine lettuce, tomato, and honey dip sauce",
        price: "17.95",
        image: "https://images.unsplash.com/photo-1606755456206-1f6d5ba933df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "cold-sandwiches",
        tags: [],
        available: true
      },
      {
        name: "Italian Grilled Chicken Hero",
        description: "Grilled chicken, lettuce, roasted red peppers, fresh Mozzarella and pesto sauce",
        price: "17.95",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "cold-sandwiches",
        tags: [],
        available: true
      },
      {
        name: "Monte Christo Hero",
        description: "Turkey breast, ham, Swiss cheese, lettuce, tomato and Russian dressing",
        price: "17.95",
        image: "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "cold-sandwiches",
        tags: [],
        available: true
      },
      {
        name: "Nazareth Hero",
        description: "Fried chicken cutlet, bacon, Swiss cheese, cole-slaw and Russian dressing",
        price: "17.95",
        image: "https://images.unsplash.com/photo-1606755456206-1f6d5ba933df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "cold-sandwiches",
        tags: [],
        available: true
      },
      {
        name: "Roast Beef Deluxe Hero",
        description: "Roast beef, bacon, Cheddar, lettuce, tomato and mayo",
        price: "17.95",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "cold-sandwiches",
        tags: [],
        available: true
      },

      // Hot Sandwiches
      {
        name: "Chicken Fiesta Hero",
        description: "Fried chicken cutlet, fresh mozzarella, roasted red peppers and spicy mayo on a toasted hero",
        price: "17.95",
        image: "https://images.unsplash.com/photo-1606755456206-1f6d5ba933df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "hot-sandwiches",
        tags: ["spicy"],
        available: true
      },
      {
        name: "Texas Hero",
        description: "Fried chicken cutlet, bacon, fried onions, Mozzarella, Cheddar and barbeque sauce on a toasted garlic hero",
        price: "17.95",
        image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "hot-sandwiches",
        tags: [],
        available: true
      },

      // Paninis
      {
        name: "California Panini",
        description: "Turkey breast, tomato, avocado, Mozzarella cheese and Russian dressing",
        price: "15.95",
        image: "https://images.unsplash.com/photo-1528736235302-52922df5c122?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "paninis",
        tags: ["healthy"],
        available: true
      },
      {
        name: "Chicken Margherita Panini",
        description: "Grilled chicken, tomatoes, fresh mozzarella, fresh basil and red onions",
        price: "15.95",
        image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "paninis",
        tags: [],
        available: true
      },

      // Salads
      {
        name: "Chef Salad",
        description: "Mixed lettuce, ham, eggs, turkey, carrots, Cheddar cheese, cucumber, tomatoes and green peppers",
        price: "15.95",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "salads",
        tags: ["healthy"],
        available: true
      },
      {
        name: "Greek Salad",
        description: "Romaine lettuce, tomatoes, stuffed grape leaves, green peppers, Feta cheese and black olives",
        price: "15.95",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "salads",
        tags: ["healthy", "vegetarian"],
        available: true
      },
      {
        name: "Grilled Chicken Caesar Salad",
        description: "Romaine lettuce, tomatoes, grilled chicken, Parmigiano cheese, croutons, and caesar dressing",
        price: "15.95",
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "salads",
        tags: ["healthy"],
        available: true
      },

      // Omelets
      {
        name: "American Omelet",
        description: "ham, American cheese, and tomato",
        price: "10.32",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "omelets",
        tags: [],
        available: true
      },
      {
        name: "Mexican Omelet",
        description: "mushrooms, tomato, onions, jalapeño, and cheese",
        price: "10.32",
        image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "omelets",
        tags: ["spicy"],
        available: true
      },
      {
        name: "Sausage & Potato Omelet",
        description: "sausage, home-fries, and cheddar cheese",
        price: "10.32",
        image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "omelets",
        tags: [],
        available: true
      },
      {
        name: "Simon's Omelet",
        description: "avocado, spinach, Feta cheese and salsa",
        price: "11.64",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "omelets",
        tags: ["healthy"],
        available: true
      },
      {
        name: "Western Omelet",
        description: "peppers, onions, and ham",
        price: "10.32",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "omelets",
        tags: [],
        available: true
      },

      // Grill Menu
      {
        name: "Beef Gyro",
        description: "Lettuce, tomato, cucumbers, onions, gyro sauce",
        price: "12.94",
        image: "https://images.unsplash.com/photo-1563379091639-cdcb3c995001?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "grill-menu",
        tags: [],
        available: true
      },
      {
        name: "Philly Cheese Steak",
        description: "Tender rib-eye steak, sautéed peppers, onions, and mixed Cheese",
        price: "14.24",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "grill-menu",
        tags: [],
        available: true
      },

      // Desserts
      {
        name: "Chocolate Chip Cookies",
        description: "Fresh baked chocolate chip cookies",
        price: "2.29",
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "desserts",
        tags: [],
        available: true
      },
      {
        name: "Rice Pudding",
        description: "Creamy homemade rice pudding",
        price: "4.54",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "desserts",
        tags: [],
        available: true
      },

      // Bottled Drinks
      {
        name: "Orange Juice",
        description: "Fresh OJ",
        price: "3.59",
        image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "bottled-drinks",
        tags: ["healthy"],
        available: true
      },
      {
        name: "Coke 20oz soda",
        description: "Classic Coca-Cola",
        price: "3.59",
        image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "bottled-drinks",
        tags: [],
        available: true
      }
    ];

    sampleItems.forEach(item => {
      const id = this.currentMenuId++;
      this.menuItems.set(id, { ...item, id });
    });
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => item.available);
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(
      item => item.available && item.category === category
    );
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentMenuId++;
    const item: MenuItem = { ...insertItem, tags: insertItem.tags ?? [], available: insertItem.available ?? true, id };
    this.menuItems.set(id, item);
    return item;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { ...insertOrder, status: insertOrder.status ?? 'pending', instructions: insertOrder.instructions ?? null, id };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentMessageId++;
    const message: ContactMessage = { ...insertMessage, phone: insertMessage.phone ?? null, id };
    this.contactMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
