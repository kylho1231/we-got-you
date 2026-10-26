import { z } from "zod";

export const ProviderQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  category: z.string().optional(),
  barangay: z.string().optional(),
  serviceMode: z.enum(["SHOP_VISIT", "HOME_SERVICE", "ROADSIDE_ASSISTANCE"]).optional(),
  verifiedOnly: z
    .string()
    .optional()
    .transform((val) => val === "true" || val === "1"),
  q: z.string().optional(),
});

export const CreateServiceRequestSchema = z.object({
  providerId: z.string().optional(),
  category: z.string().min(2, "Category is required"),
  serviceId: z.string().optional(),
  problemDescription: z
    .string()
    .min(5, "Please describe the problem with at least 5 characters"),
  customerName: z.string().min(2, "Your full name is required"),
  customerPhone: z
    .string()
    .regex(/^(\+?63|0)9\d{9}$/, "Please enter a valid Philippine mobile number (e.g. 09171234567)"),
  barangay: z.string().min(2, "Barangay is required"),
  municipality: z.string().default("San Jose de Buenavista"),
  landmark: z.string().optional(),
  preferredServiceMode: z.enum(["SHOP_VISIT", "HOME_SERVICE", "ROADSIDE_ASSISTANCE"]).default("SHOP_VISIT"),
  preferredDate: z.string().optional(),
  photoUrls: z.array(z.string().url()).optional(),
});

export const CreateRoadsideRequestSchema = z.object({
  issueCategory: z
    .enum([
      "Flat Tire / Vulcanizing",
      "Dead Battery / Jump-start",
      "Mechanical Breakdown",
      "Towing / Recovery",
      "Fuel Delivery",
      "Locked Out",
    ])
    .default("Flat Tire / Vulcanizing"),
  vehicleType: z
    .enum([
      "Motorcycle",
      "Car",
      "Tricycle",
      "Van / Pickup",
      "Truck",
      "Bicycle",
    ])
    .default("Motorcycle"),
  vehicleModel: z.string().optional(),
  description: z.string().min(3, "Description or landmark is required"),
  pickupAddress: z.string().default("San Jose de Buenavista"),
  barangay: z.string().min(2, "Barangay is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  customerName: z.string().min(2, "Customer name is required"),
  customerPhone: z
    .string()
    .regex(/^(\+?63|0)9\d{9}$/, "Valid Philippine mobile number required (09xxxxxxxxx)"),
  notes: z.string().optional(),
});

export const TriageQuerySchema = z.object({
  query: z.string().min(2, "Query is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  barangay: z.string().optional(),
});
