import {
  type MenuItem,
  type InsertMenuItem,
  type Order,
  type InsertOrder,
  type ContactMessage,
  type InsertContactMessage,
  type User,
  type InsertUser,
} from "@shared/schema";

export interface PaginationOptions {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  category?: string;
  status?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IStorage {
  // Menu items
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
  bulkDeleteMenuItems(ids: number[]): Promise<number>;
  bulkUpdateMenuItems(ids: number[], updates: Partial<InsertMenuItem>): Promise<number>;
  getMenuItemsPaginated(options: PaginationOptions): Promise<PaginatedResult<MenuItem>>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrders(): Promise<Order[]>;
  updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;
  getOrdersPaginated(options: PaginationOptions): Promise<PaginatedResult<Order>>;

  // Contact messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  deleteContactMessage(id: number): Promise<boolean>;
  getContactMessagesPaginated(options: PaginationOptions): Promise<PaginatedResult<ContactMessage>>;

  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  getUsersPaginated(options: PaginationOptions): Promise<PaginatedResult<User>>;
}

function paginateAndSort<T extends Record<string, any>>(
  items: T[],
  options: PaginationOptions,
  searchFields: string[]
): PaginatedResult<T> {
  let filtered = [...items];

  // Search
  if (options.search) {
    const search = options.search.toLowerCase();
    filtered = filtered.filter(item =>
      searchFields.some(field => {
        const val = item[field];
        if (val == null) return false;
        if (Array.isArray(val)) return val.some(v => String(v).toLowerCase().includes(search));
        return String(val).toLowerCase().includes(search);
      })
    );
  }

  // Category/status filter
  if (options.category) {
    filtered = filtered.filter(item => item.category === options.category);
  }
  if (options.status) {
    filtered = filtered.filter(item => item.status === options.status);
  }

  // Sort
  if (options.sortBy) {
    const dir = options.sortDir === "desc" ? -1 : 1;
    filtered.sort((a, b) => {
      const aVal = a[options.sortBy!];
      const bVal = b[options.sortBy!];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return dir;
      if (bVal == null) return -dir;
      if (typeof aVal === "number" && typeof bVal === "number") return (aVal - bVal) * dir;
      return String(aVal).localeCompare(String(bVal)) * dir;
    });
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / options.limit) || 1;
  const page = Math.min(options.page, totalPages);
  const start = (page - 1) * options.limit;
  const data = filtered.slice(start, start + options.limit);

  return { data, total, page, limit: options.limit, totalPages };
}

export class MemStorage implements IStorage {
  private menuItems: Map<number, MenuItem>;
  private orders: Map<number, Order>;
  private contactMessages: Map<number, ContactMessage>;
  private usersMap: Map<number, User>;
  private currentMenuId: number;
  private currentOrderId: number;
  private currentMessageId: number;
  private currentUserId: number;

  constructor() {
    this.menuItems = new Map();
    this.orders = new Map();
    this.contactMessages = new Map();
    this.usersMap = new Map();
    this.currentMenuId = 1;
    this.currentOrderId = 1;
    this.currentMessageId = 1;
    this.currentUserId = 1;

    this.initializeMenuItems();
    this.initializeSeedUsers();
    this.initializeSeedOrders();
    this.initializeSeedContacts();
  }

  // ==================== SEED DATA ====================

  private initializeSeedUsers() {
    // Password hash for "Password1" - generated with scrypt
    // In real app these would be properly hashed; here we store a placeholder that setupAuth will handle
    const hashedPassword = "seeded_hash_placeholder";

    const seedUsers: Omit<User, "id">[] = [
      // Admins
      { username: "admin", email: "admin@orderlybite.com", password: hashedPassword, firstName: "System", lastName: "Admin", phone: "804-360-1129", role: "admin", emailVerified: true, verificationToken: null, resetToken: null, resetTokenExpiry: null, createdAt: new Date("2025-01-15"), updatedAt: new Date("2025-01-15") },
      { username: "sarah_admin", email: "sarah@orderlybite.com", password: hashedPassword, firstName: "Sarah", lastName: "Johnson", phone: "804-555-0101", role: "admin", emailVerified: true, verificationToken: null, resetToken: null, resetTokenExpiry: null, createdAt: new Date("2025-02-01"), updatedAt: new Date("2025-02-01") },
      { username: "mike_admin", email: "mike@orderlybite.com", password: hashedPassword, firstName: "Mike", lastName: "Chen", phone: "804-555-0102", role: "admin", emailVerified: true, verificationToken: null, resetToken: null, resetTokenExpiry: null, createdAt: new Date("2025-02-10"), updatedAt: new Date("2025-02-10") },
      // Managers
      { username: "mgr_lisa", email: "lisa@orderlybite.com", password: hashedPassword, firstName: "Lisa", lastName: "Martinez", phone: "804-555-0201", role: "manager", emailVerified: true, verificationToken: null, resetToken: null, resetTokenExpiry: null, createdAt: new Date("2025-03-01"), updatedAt: new Date("2025-03-01") },
      { username: "mgr_james", email: "james@orderlybite.com", password: hashedPassword, firstName: "James", lastName: "Wilson", phone: "804-555-0202", role: "manager", emailVerified: true, verificationToken: null, resetToken: null, resetTokenExpiry: null, createdAt: new Date("2025-03-15"), updatedAt: new Date("2025-03-15") },
      { username: "mgr_priya", email: "priya@orderlybite.com", password: hashedPassword, firstName: "Priya", lastName: "Patel", phone: "804-555-0203", role: "manager", emailVerified: false, verificationToken: "verify_priya_123", resetToken: null, resetTokenExpiry: null, createdAt: new Date("2025-04-01"), updatedAt: new Date("2025-04-01") },
      // Regular users
      { username: "john_doe", email: "john@example.com", password: hashedPassword, firstName: "John", lastName: "Doe", phone: "804-555-0301", role: "user", emailVerified: true, verificationToken: null, resetToken: null, resetTokenExpiry: null, createdAt: new Date("2025-04-10"), updatedAt: new Date("2025-04-10") },
      { username: "jane_smith", email: "jane@example.com", password: hashedPassword, firstName: "Jane", lastName: "Smith", phone: "804-555-0302", role: "user", emailVerified: true, verificationToken: null, resetToken: null, resetTokenExpiry: null, createdAt: new Date("2025-04-15"), updatedAt: new Date("2025-04-15") },
      { username: "bob_jones", email: "bob@example.com", password: hashedPassword, firstName: "Bob", lastName: "Jones", phone: null, role: "user", emailVerified: true, verificationToken: null, resetToken: null, resetTokenExpiry: null, createdAt: new Date("2025-05-01"), updatedAt: new Date("2025-05-01") },
      { username: "alice_w", email: "alice@example.com", password: hashedPassword, firstName: "Alice", lastName: "Williams", phone: "804-555-0304", role: "user", emailVerified: false, verificationToken: "verify_alice_456", resetToken: null, resetTokenExpiry: null, createdAt: new Date("2025-05-10"), updatedAt: new Date("2025-05-10") },
      { username: "carlos_r", email: "carlos@example.com", password: hashedPassword, firstName: "Carlos", lastName: "Rodriguez", phone: "804-555-0305", role: "user", emailVerified: true, verificationToken: null, resetToken: null, resetTokenExpiry: null, createdAt: new Date("2025-05-20"), updatedAt: new Date("2025-05-20") },
      { username: "emily_t", email: "emily@example.com", password: hashedPassword, firstName: "Emily", lastName: "Taylor", phone: null, role: "user", emailVerified: true, verificationToken: null, resetToken: null, resetTokenExpiry: null, createdAt: new Date("2025-06-01"), updatedAt: new Date("2025-06-01") },
      { username: "david_k", email: "david@example.com", password: hashedPassword, firstName: "David", lastName: "Kim", phone: "804-555-0307", role: "user", emailVerified: false, verificationToken: "verify_david_789", resetToken: null, resetTokenExpiry: null, createdAt: new Date("2025-06-15"), updatedAt: new Date("2025-06-15") },
      { username: "maria_g", email: "maria@example.com", password: hashedPassword, firstName: "Maria", lastName: "Garcia", phone: "804-555-0308", role: "user", emailVerified: true, verificationToken: null, resetToken: null, resetTokenExpiry: null, createdAt: new Date("2025-07-01"), updatedAt: new Date("2025-07-01") },
      { username: "tom_b", email: "tom@example.com", password: hashedPassword, firstName: "Tom", lastName: "Brown", phone: null, role: "user", emailVerified: true, verificationToken: null, resetToken: null, resetTokenExpiry: null, createdAt: new Date("2025-07-10"), updatedAt: new Date("2025-07-10") },
    ];

    seedUsers.forEach(user => {
      const id = this.currentUserId++;
      this.usersMap.set(id, { ...user, id });
    });
  }

  private initializeSeedOrders() {
    const seedOrders: Omit<Order, "id">[] = [
      // Pending orders
      { customerName: "John Doe", email: "john@example.com", phone: "804-555-0301", address: "123 Main St", city: "Richmond", state: "VA", zip: "23220", items: [{ id: 1, name: "Acai Bowl", price: 12.97, image: "", quantity: 2 }], subtotal: "25.94", tax: "2.07", deliveryFee: "3.99", total: "32.00", paymentMethod: "credit_card", status: "pending", instructions: "Ring doorbell" },
      { customerName: "Jane Smith", email: "jane@example.com", phone: "804-555-0302", address: "456 Oak Ave", city: "Richmond", state: "VA", zip: "23221", items: [{ id: 3, name: "Hungry Man", price: 12.95, image: "", quantity: 1 }, { id: 7, name: "Balsamic Avocado Hero", price: 17.95, image: "", quantity: 1 }], subtotal: "30.90", tax: "2.47", deliveryFee: "3.99", total: "37.36", paymentMethod: "credit_card", status: "pending", instructions: null },
      { customerName: "Bob Jones", email: "bob@example.com", phone: "804-555-0303", address: "789 Pine Rd", city: "Henrico", state: "VA", zip: "23233", items: [{ id: 25, name: "Chef Salad", price: 15.95, image: "", quantity: 1 }], subtotal: "15.95", tax: "1.28", deliveryFee: "3.99", total: "21.22", paymentMethod: "cash", status: "pending", instructions: "Leave at door" },
      { customerName: "Alice Williams", email: "alice@example.com", phone: "804-555-0304", address: "321 Elm St", city: "Richmond", state: "VA", zip: "23222", items: [{ id: 2, name: "French Toast", price: 9.95, image: "", quantity: 3 }], subtotal: "29.85", tax: "2.39", deliveryFee: "3.99", total: "36.23", paymentMethod: "credit_card", status: "pending", instructions: null },
      // Confirmed orders
      { customerName: "Carlos Rodriguez", email: "carlos@example.com", phone: "804-555-0305", address: "654 Maple Dr", city: "Richmond", state: "VA", zip: "23223", items: [{ id: 8, name: "Italian Hero", price: 17.95, image: "", quantity: 2 }], subtotal: "35.90", tax: "2.87", deliveryFee: "3.99", total: "42.76", paymentMethod: "credit_card", status: "confirmed", instructions: "Extra napkins please" },
      { customerName: "Emily Taylor", email: "emily@example.com", phone: "804-555-0306", address: "987 Cedar Ln", city: "Henrico", state: "VA", zip: "23234", items: [{ id: 30, name: "Beef Gyro", price: 12.94, image: "", quantity: 1 }, { id: 35, name: "Orange Juice", price: 3.59, image: "", quantity: 2 }], subtotal: "20.12", tax: "1.61", deliveryFee: "3.99", total: "25.72", paymentMethod: "cash", status: "confirmed", instructions: null },
      { customerName: "David Kim", email: "david@example.com", phone: "804-555-0307", address: "147 Birch St", city: "Richmond", state: "VA", zip: "23224", items: [{ id: 22, name: "California Panini", price: 15.95, image: "", quantity: 1 }], subtotal: "15.95", tax: "1.28", deliveryFee: "3.99", total: "21.22", paymentMethod: "credit_card", status: "confirmed", instructions: "Call when arriving" },
      { customerName: "Maria Garcia", email: "maria@example.com", phone: "804-555-0308", address: "258 Walnut Ave", city: "Richmond", state: "VA", zip: "23225", items: [{ id: 4, name: "Melville Platter", price: 12.95, image: "", quantity: 2 }, { id: 36, name: "Coke 20oz soda", price: 3.59, image: "", quantity: 2 }], subtotal: "33.08", tax: "2.65", deliveryFee: "3.99", total: "39.72", paymentMethod: "credit_card", status: "confirmed", instructions: null },
      // Preparing orders
      { customerName: "Tom Brown", email: "tom@example.com", phone: "804-555-0309", address: "369 Spruce Ct", city: "Henrico", state: "VA", zip: "23235", items: [{ id: 27, name: "American Omelet", price: 10.32, image: "", quantity: 2 }], subtotal: "20.64", tax: "1.65", deliveryFee: "3.99", total: "26.28", paymentMethod: "cash", status: "preparing", instructions: null },
      { customerName: "John Doe", email: "john@example.com", phone: "804-555-0301", address: "123 Main St", city: "Richmond", state: "VA", zip: "23220", items: [{ id: 31, name: "Philly Cheese Steak", price: 14.24, image: "", quantity: 1 }, { id: 35, name: "Orange Juice", price: 3.59, image: "", quantity: 1 }], subtotal: "17.83", tax: "1.43", deliveryFee: "3.99", total: "23.25", paymentMethod: "credit_card", status: "preparing", instructions: "Use side entrance" },
      { customerName: "Jane Smith", email: "jane@example.com", phone: "804-555-0302", address: "456 Oak Ave", city: "Richmond", state: "VA", zip: "23221", items: [{ id: 26, name: "Greek Salad", price: 15.95, image: "", quantity: 1 }, { id: 23, name: "Chicken Margherita Panini", price: 15.95, image: "", quantity: 1 }], subtotal: "31.90", tax: "2.55", deliveryFee: "3.99", total: "38.44", paymentMethod: "credit_card", status: "preparing", instructions: null },
      { customerName: "Carlos Rodriguez", email: "carlos@example.com", phone: "804-555-0305", address: "654 Maple Dr", city: "Richmond", state: "VA", zip: "23223", items: [{ id: 6, name: "Super Thing", price: 12.94, image: "", quantity: 1 }], subtotal: "12.94", tax: "1.04", deliveryFee: "3.99", total: "17.97", paymentMethod: "cash", status: "preparing", instructions: null },
      // Delivered orders
      { customerName: "Emily Taylor", email: "emily@example.com", phone: "804-555-0306", address: "987 Cedar Ln", city: "Henrico", state: "VA", zip: "23234", items: [{ id: 9, name: "Turkey Club Hero", price: 17.95, image: "", quantity: 1 }, { id: 32, name: "Chocolate Chip Cookies", price: 2.29, image: "", quantity: 2 }], subtotal: "22.53", tax: "1.80", deliveryFee: "3.99", total: "28.32", paymentMethod: "credit_card", status: "delivered", instructions: null },
      { customerName: "Bob Jones", email: "bob@example.com", phone: "804-555-0303", address: "789 Pine Rd", city: "Henrico", state: "VA", zip: "23233", items: [{ id: 5, name: "Protein Slammer", price: 12.94, image: "", quantity: 2 }], subtotal: "25.88", tax: "2.07", deliveryFee: "3.99", total: "31.94", paymentMethod: "cash", status: "delivered", instructions: "Thanks!" },
      { customerName: "Alice Williams", email: "alice@example.com", phone: "804-555-0304", address: "321 Elm St", city: "Richmond", state: "VA", zip: "23222", items: [{ id: 33, name: "Rice Pudding", price: 4.54, image: "", quantity: 3 }, { id: 36, name: "Coke 20oz soda", price: 3.59, image: "", quantity: 1 }], subtotal: "17.21", tax: "1.38", deliveryFee: "3.99", total: "22.58", paymentMethod: "credit_card", status: "delivered", instructions: null },
    ];

    seedOrders.forEach(order => {
      const id = this.currentOrderId++;
      this.orders.set(id, { ...order, id });
    });
  }

  private initializeSeedContacts() {
    const seedContacts: Omit<ContactMessage, "id">[] = [
      { firstName: "John", lastName: "Doe", email: "john@example.com", phone: "804-555-0301", subject: "General Inquiry", message: "I'd like to know more about your catering services for events." },
      { firstName: "Jane", lastName: "Smith", email: "jane@example.com", phone: "804-555-0302", subject: "Order Issue", message: "My order #3 was missing the extra napkins I requested. Can you help?" },
      { firstName: "Bob", lastName: "Jones", email: "bob@example.com", phone: null, subject: "Feedback", message: "Great food! The Philly Cheese Steak was amazing. Will definitely order again." },
      { firstName: "Alice", lastName: "Williams", email: "alice@example.com", phone: "804-555-0304", subject: "Menu Question", message: "Do you offer gluten-free options? I have celiac disease." },
      { firstName: "Carlos", lastName: "Rodriguez", email: "carlos@example.com", phone: "804-555-0305", subject: "Delivery Issue", message: "My delivery was 45 minutes late yesterday. The food was cold when it arrived." },
      { firstName: "Emily", lastName: "Taylor", email: "emily@example.com", phone: null, subject: "General Inquiry", message: "What are your holiday hours for Thanksgiving and Christmas?" },
      { firstName: "David", lastName: "Kim", email: "david@example.com", phone: "804-555-0307", subject: "Partnership", message: "I run a local food blog and would love to review your restaurant." },
      { firstName: "Maria", lastName: "Garcia", email: "maria@example.com", phone: "804-555-0308", subject: "Feedback", message: "The new acai bowl is incredible! Please never take it off the menu." },
      { firstName: "Tom", lastName: "Brown", email: "tom@example.com", phone: null, subject: "Order Issue", message: "I was charged twice for my last order. Can I get a refund?" },
      { firstName: "Sarah", lastName: "Johnson", email: "sarah.j@example.com", phone: "804-555-0310", subject: "Catering", message: "We're planning an office lunch for 50 people. Do you offer catering?" },
      { firstName: "Michael", lastName: "Lee", email: "michael.lee@example.com", phone: "804-555-0311", subject: "General Inquiry", message: "Is there a minimum order for delivery in the Henrico area?" },
      { firstName: "Lisa", lastName: "Wang", email: "lisa.wang@example.com", phone: null, subject: "Feedback", message: "Your website is very easy to use. The ordering process was smooth." },
      { firstName: "Kevin", lastName: "O'Brien", email: "kevin.ob@example.com", phone: "804-555-0313", subject: "Complaint", message: "The portion sizes have gotten smaller but prices went up. Not happy." },
      { firstName: "Rachel", lastName: "Green", email: "rachel.g@example.com", phone: "804-555-0314", subject: "Menu Question", message: "Are the omelets available for lunch or only breakfast?" },
      { firstName: "Steve", lastName: "Harris", email: "steve.h@example.com", phone: null, subject: "Suggestion", message: "You should add a loyalty program. I order from here at least 3 times a week!" },
    ];

    seedContacts.forEach(contact => {
      const id = this.currentMessageId++;
      this.contactMessages.set(id, { ...contact, id });
    });
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

  // ==================== MENU ITEMS ====================

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
    const item: MenuItem = {
      ...insertItem,
      id,
      tags: insertItem.tags ?? null,
      available: insertItem.available ?? null,
    };
    this.menuItems.set(id, item);
    return item;
  }

  async updateMenuItem(id: number, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const item = this.menuItems.get(id);
    if (!item) return undefined;
    const updated = { ...item, ...updates };
    this.menuItems.set(id, updated);
    return updated;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  async bulkDeleteMenuItems(ids: number[]): Promise<number> {
    let count = 0;
    for (const id of ids) {
      if (this.menuItems.delete(id)) count++;
    }
    return count;
  }

  async bulkUpdateMenuItems(ids: number[], updates: Partial<InsertMenuItem>): Promise<number> {
    let count = 0;
    for (const id of ids) {
      const item = this.menuItems.get(id);
      if (item) {
        this.menuItems.set(id, { ...item, ...updates });
        count++;
      }
    }
    return count;
  }

  async getMenuItemsPaginated(options: PaginationOptions): Promise<PaginatedResult<MenuItem>> {
    const items = Array.from(this.menuItems.values());
    return paginateAndSort(items, options, ["name", "description", "category", "tags"]);
  }

  // ==================== ORDERS ====================

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      ...insertOrder,
      id,
      status: insertOrder.status ?? null,
      instructions: insertOrder.instructions ?? null,
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async updateOrder(id: number, updates: Partial<InsertOrder>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    const updated = { ...order, ...updates };
    this.orders.set(id, updated);
    return updated;
  }

  async deleteOrder(id: number): Promise<boolean> {
    return this.orders.delete(id);
  }

  async getOrdersPaginated(options: PaginationOptions): Promise<PaginatedResult<Order>> {
    const items = Array.from(this.orders.values());
    return paginateAndSort(items, options, ["customerName", "email", "phone", "status"]);
  }

  // ==================== CONTACT MESSAGES ====================

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentMessageId++;
    const message: ContactMessage = {
      ...insertMessage,
      id,
      phone: insertMessage.phone ?? null,
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessages.get(id);
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    return this.contactMessages.delete(id);
  }

  async getContactMessagesPaginated(options: PaginationOptions): Promise<PaginatedResult<ContactMessage>> {
    const items = Array.from(this.contactMessages.values());
    return paginateAndSort(items, options, ["firstName", "lastName", "email", "subject", "message"]);
  }

  // ==================== USERS ====================

  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(u => u.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(u => u.email === email);
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(u => u.resetToken === token);
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(u => u.verificationToken === token);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || "user",
      emailVerified: insertUser.emailVerified || false,
      verificationToken: insertUser.verificationToken || null,
      resetToken: insertUser.resetToken || null,
      resetTokenExpiry: insertUser.resetTokenExpiry || null,
      phone: insertUser.phone || null,
      createdAt: now,
      updatedAt: now,
    };
    this.usersMap.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.usersMap.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates, updatedAt: new Date() };
    this.usersMap.set(id, updated);
    return updated;
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.usersMap.values());
  }

  async getUsersPaginated(options: PaginationOptions): Promise<PaginatedResult<User>> {
    const items = Array.from(this.usersMap.values());
    return paginateAndSort(items, options, ["username", "email", "firstName", "lastName", "role"]);
  }
}

export const storage = new MemStorage();
