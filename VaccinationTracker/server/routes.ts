import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertChildSchema, insertVaccinationSchema } from "@shared/schema";
import { z } from "zod";

function ensureAuthenticated(req: Request, res: Response, next: Function) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Child routes
  app.get("/api/children", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const children = await storage.getChildren(userId);
      res.json(children);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve children" });
    }
  });

  app.post("/api/children", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      
      // Validate request body with extended schema
      const childData = insertChildSchema.extend({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        birthDate: z.string().refine(date => !isNaN(Date.parse(date)), { 
          message: "Invalid birth date" 
        }),
        gender: z.string().optional(),
      }).parse({
        ...req.body,
        userId
      });
      
      const child = await storage.createChild(childData);
      res.status(201).json(child);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create child" });
    }
  });

  app.get("/api/children/:id", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const childId = parseInt(req.params.id);
      
      if (isNaN(childId)) {
        return res.status(400).json({ message: "Invalid child ID" });
      }
      
      const child = await storage.getChild(childId);
      
      if (!child) {
        return res.status(404).json({ message: "Child not found" });
      }
      
      // Ensure the child belongs to the authenticated user
      if (child.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized access to this child" });
      }
      
      res.json(child);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve child" });
    }
  });

  app.put("/api/children/:id", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const childId = parseInt(req.params.id);
      
      if (isNaN(childId)) {
        return res.status(400).json({ message: "Invalid child ID" });
      }
      
      const child = await storage.getChild(childId);
      
      if (!child) {
        return res.status(404).json({ message: "Child not found" });
      }
      
      // Ensure the child belongs to the authenticated user
      if (child.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized access to this child" });
      }
      
      // Validate the update data
      const updateSchema = z.object({
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        birthDate: z.string().refine(date => !isNaN(Date.parse(date)), { 
          message: "Invalid birth date" 
        }).optional(),
        gender: z.string().optional(),
      });
      
      const updateData = updateSchema.parse(req.body);
      const updatedChild = await storage.updateChild(childId, updateData);
      
      res.json(updatedChild);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update child" });
    }
  });

  app.delete("/api/children/:id", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const childId = parseInt(req.params.id);
      
      if (isNaN(childId)) {
        return res.status(400).json({ message: "Invalid child ID" });
      }
      
      const child = await storage.getChild(childId);
      
      if (!child) {
        return res.status(404).json({ message: "Child not found" });
      }
      
      // Ensure the child belongs to the authenticated user
      if (child.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized access to this child" });
      }
      
      await storage.deleteChild(childId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete child" });
    }
  });

  // Vaccination routes
  app.get("/api/children/:childId/vaccinations", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const childId = parseInt(req.params.childId);
      
      if (isNaN(childId)) {
        return res.status(400).json({ message: "Invalid child ID" });
      }
      
      const child = await storage.getChild(childId);
      
      if (!child) {
        return res.status(404).json({ message: "Child not found" });
      }
      
      // Ensure the child belongs to the authenticated user
      if (child.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized access to this child's vaccinations" });
      }
      
      const vaccinations = await storage.getVaccinations(childId);
      res.json(vaccinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve vaccinations" });
    }
  });

  app.post("/api/children/:childId/vaccinations", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const childId = parseInt(req.params.childId);
      
      if (isNaN(childId)) {
        return res.status(400).json({ message: "Invalid child ID" });
      }
      
      const child = await storage.getChild(childId);
      
      if (!child) {
        return res.status(404).json({ message: "Child not found" });
      }
      
      // Ensure the child belongs to the authenticated user
      if (child.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized access to this child's vaccinations" });
      }
      
      // Validate request body
      const vaccinationData = insertVaccinationSchema.extend({
        vaccineName: z.string().min(1, "Vaccine name is required"),
        scheduledDate: z.string().refine(date => !isNaN(Date.parse(date)), { 
          message: "Invalid scheduled date" 
        }),
        administered: z.boolean().optional(),
        administeredDate: z.string().refine(date => !date || !isNaN(Date.parse(date)), { 
          message: "Invalid administered date" 
        }).optional(),
        notes: z.string().optional()
      }).parse({
        ...req.body,
        childId
      });
      
      const vaccination = await storage.createVaccination(vaccinationData);
      res.status(201).json(vaccination);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create vaccination" });
    }
  });

  app.get("/api/vaccinations/:id", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const vaccinationId = parseInt(req.params.id);
      
      if (isNaN(vaccinationId)) {
        return res.status(400).json({ message: "Invalid vaccination ID" });
      }
      
      const vaccination = await storage.getVaccination(vaccinationId);
      
      if (!vaccination) {
        return res.status(404).json({ message: "Vaccination not found" });
      }
      
      // Get the child to check ownership
      const child = await storage.getChild(vaccination.childId);
      
      if (!child || child.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized access to this vaccination" });
      }
      
      res.json(vaccination);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve vaccination" });
    }
  });

  app.put("/api/vaccinations/:id", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const vaccinationId = parseInt(req.params.id);
      
      if (isNaN(vaccinationId)) {
        return res.status(400).json({ message: "Invalid vaccination ID" });
      }
      
      const vaccination = await storage.getVaccination(vaccinationId);
      
      if (!vaccination) {
        return res.status(404).json({ message: "Vaccination not found" });
      }
      
      // Get the child to check ownership
      const child = await storage.getChild(vaccination.childId);
      
      if (!child || child.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized access to this vaccination" });
      }
      
      // Validate the update data
      const updateSchema = z.object({
        vaccineName: z.string().min(1).optional(),
        scheduledDate: z.string().refine(date => !isNaN(Date.parse(date)), { 
          message: "Invalid scheduled date" 
        }).optional(),
        administered: z.boolean().optional(),
        administeredDate: z.string().refine(date => !date || !isNaN(Date.parse(date)), { 
          message: "Invalid administered date" 
        }).optional(),
        notes: z.string().optional()
      });
      
      const updateData = updateSchema.parse(req.body);
      const updatedVaccination = await storage.updateVaccination(vaccinationId, updateData);
      
      res.json(updatedVaccination);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update vaccination" });
    }
  });

  app.delete("/api/vaccinations/:id", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const vaccinationId = parseInt(req.params.id);
      
      if (isNaN(vaccinationId)) {
        return res.status(400).json({ message: "Invalid vaccination ID" });
      }
      
      const vaccination = await storage.getVaccination(vaccinationId);
      
      if (!vaccination) {
        return res.status(404).json({ message: "Vaccination not found" });
      }
      
      // Get the child to check ownership
      const child = await storage.getChild(vaccination.childId);
      
      if (!child || child.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized access to this vaccination" });
      }
      
      await storage.deleteVaccination(vaccinationId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete vaccination" });
    }
  });

  // Dashboard data
  app.get("/api/dashboard", ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      
      // Get the user's children
      const children = await storage.getChildren(userId);
      
      // Get upcoming vaccinations for the next 30 days
      const upcomingVaccinations = await storage.getUserUpcomingVaccinations(userId, 30);
      
      res.json({
        user: {
          firstName: req.user!.firstName,
          lastName: req.user!.lastName
        },
        childCount: children.length,
        upcomingVaccinations: upcomingVaccinations,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
