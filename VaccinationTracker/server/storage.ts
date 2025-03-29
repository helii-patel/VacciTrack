import { users, type User, type InsertUser, children, type Child, type InsertChild, vaccinations, type Vaccination, type InsertVaccination } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Child operations
  getChildren(userId: number): Promise<Child[]>;
  getChild(id: number): Promise<Child | undefined>;
  createChild(child: InsertChild): Promise<Child>;
  updateChild(id: number, child: Partial<InsertChild>): Promise<Child | undefined>;
  deleteChild(id: number): Promise<boolean>;
  
  // Vaccination operations
  getVaccinations(childId: number): Promise<Vaccination[]>;
  getVaccination(id: number): Promise<Vaccination | undefined>;
  createVaccination(vaccination: InsertVaccination): Promise<Vaccination>;
  updateVaccination(id: number, vaccination: Partial<InsertVaccination>): Promise<Vaccination | undefined>;
  deleteVaccination(id: number): Promise<boolean>;
  
  // User's upcoming vaccinations
  getUserUpcomingVaccinations(userId: number, days: number): Promise<(Vaccination & { childName: string })[]>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userIdCounter: number;
  
  private children: Map<number, Child>;
  private childIdCounter: number;
  
  private vaccinations: Map<number, Vaccination>;
  private vaccinationIdCounter: number;
  
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.userIdCounter = 1;
    
    this.children = new Map();
    this.childIdCounter = 1;
    
    this.vaccinations = new Map();
    this.vaccinationIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Child methods
  async getChildren(userId: number): Promise<Child[]> {
    return Array.from(this.children.values()).filter(
      (child) => child.userId === userId
    );
  }

  async getChild(id: number): Promise<Child | undefined> {
    return this.children.get(id);
  }

  async createChild(insertChild: InsertChild): Promise<Child> {
    const id = this.childIdCounter++;
    const child: Child = { ...insertChild, id };
    this.children.set(id, child);
    return child;
  }

  async updateChild(id: number, childUpdate: Partial<InsertChild>): Promise<Child | undefined> {
    const child = this.children.get(id);
    if (!child) return undefined;
    
    const updatedChild = { ...child, ...childUpdate };
    this.children.set(id, updatedChild);
    return updatedChild;
  }

  async deleteChild(id: number): Promise<boolean> {
    return this.children.delete(id);
  }

  // Vaccination methods
  async getVaccinations(childId: number): Promise<Vaccination[]> {
    return Array.from(this.vaccinations.values()).filter(
      (vaccination) => vaccination.childId === childId
    );
  }

  async getVaccination(id: number): Promise<Vaccination | undefined> {
    return this.vaccinations.get(id);
  }

  async createVaccination(insertVaccination: InsertVaccination): Promise<Vaccination> {
    const id = this.vaccinationIdCounter++;
    const vaccination: Vaccination = { ...insertVaccination, id };
    this.vaccinations.set(id, vaccination);
    return vaccination;
  }

  async updateVaccination(id: number, vaccinationUpdate: Partial<InsertVaccination>): Promise<Vaccination | undefined> {
    const vaccination = this.vaccinations.get(id);
    if (!vaccination) return undefined;
    
    const updatedVaccination = { ...vaccination, ...vaccinationUpdate };
    this.vaccinations.set(id, updatedVaccination);
    return updatedVaccination;
  }

  async deleteVaccination(id: number): Promise<boolean> {
    return this.vaccinations.delete(id);
  }

  // User's upcoming vaccinations with child's name
  async getUserUpcomingVaccinations(userId: number, days: number): Promise<(Vaccination & { childName: string })[]> {
    const userChildren = await this.getChildren(userId);
    const childIds = userChildren.map(child => child.id);
    
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    const allVaccinations = Array.from(this.vaccinations.values());
    
    const upcomingVaccinations = allVaccinations.filter(vaccination => {
      // Match child to user
      if (!childIds.includes(vaccination.childId)) return false;
      
      // Only include non-administered vaccinations
      if (vaccination.administered) return false;
      
      // Check if scheduled date is within range
      const scheduledDate = new Date(vaccination.scheduledDate);
      return scheduledDate >= today && scheduledDate <= futureDate;
    });
    
    // Add child name to each vaccination
    return upcomingVaccinations.map(vaccination => {
      const child = userChildren.find(c => c.id === vaccination.childId);
      const childName = child ? `${child.firstName} ${child.lastName}` : 'Unknown Child';
      return { ...vaccination, childName };
    });
  }
}

export const storage = new MemStorage();
