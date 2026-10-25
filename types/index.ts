// ============================================================
// WE GOT YOU: Core TypeScript Definitions
// Target: San Jose de Buenavista, Antique, Philippines
// ============================================================

export type UserRole = "customer" | "provider" | "admin";

export type ServiceMode = "SHOP_VISIT" | "HOME_SERVICE" | "ROADSIDE_ASSISTANCE";

export type VerificationStatus =
  | "UNCLAIMED_LISTING"
  | "REGISTRATION_STARTED"
  | "PENDING_VERIFICATION"
  | "APPROVED"
  | "NEEDS_ADDITIONAL_INFO"
  | "REJECTED"
  | "SUSPENDED";

export type BookingStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "AWAITING_PROVIDER"
  | "PROVIDER_ACCEPTED"
  | "AWAITING_QUOTE"
  | "QUOTE_SENT"
  | "QUOTE_ACCEPTED"
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "PROVIDER_MARKED_COMPLETE"
  | "COMPLETED"
  | "CANCELLED"
  | "DECLINED"
  | "EXPIRED"
  | "DISPUTED";

export type DispatchStatus =
  | "LOOKING_FOR_PROVIDER"
  | "OFFER_SENT"
  | "PROVIDER_ACCEPTED"
  | "ETA_PROVIDED"
  | "PROVIDER_EN_ROUTE"
  | "ARRIVED"
  | "ASSISTANCE_IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "UNFULFILLED";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Municipality {
  id: string;
  name: string;
  province: string;
  postalCode: string;
  coordinates: Coordinates;
  isActive: boolean;
}

export interface Barangay {
  id: string;
  municipalityId: string;
  name: string;
  coordinates?: Coordinates;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName: string;
  colorHex: string;
  displayOrder: number;
  subcategories: string[];
}

export interface ProviderVerification {
  hasVerifiedIdentity: boolean;
  hasVerifiedContact: boolean;
  hasVerifiedBusinessPermit: boolean;
  hasVerifiedCredentials: boolean;
  verifiedAt?: string;
  reviewerNotes?: string;
}

export interface ProviderOpeningHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface ProviderServiceItem {
  id: string;
  title: string;
  description?: string;
  priceMinPhp: number;
  priceMaxPhp?: number;
  requiresDiagnostic: boolean;
}

export interface Provider {
  id: string;
  slug: string;
  businessName: string;
  businessType: "INDEPENDENT_TECHNICIAN" | "REGISTERED_SHOP" | "SERVICE_CENTER" | "ROADSIDE_OPERATOR";
  category: string;
  subcategories: string[];
  description: string;
  contactPhone: string;
  contactEmail?: string;
  streetAddress: string;
  barangay: string;
  municipality: string;
  coordinates: Coordinates;
  plusCode?: string;
  mapPrecision?: string;
  googleMapsPinUrl?: string;
  verificationStatus: VerificationStatus;
  verificationDetails: ProviderVerification;
  serviceModes: ServiceMode[];
  specialties: string[];
  services: ProviderServiceItem[];
  calloutFeePhp: number;
  minServicePricePhp: number;
  openingHours: ProviderOpeningHours;
  isPublished: boolean;
  isAcceptingBookings: boolean;
  isRoadsideActive: boolean;
  averageRating: number;
  reviewCount: number;
  logoUrl?: string;
  galleryImages: string[];
  sourceLeadId?: string;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  providerId?: string;
  providerName?: string;
  category: string;
  serviceMode: ServiceMode;
  problemTitle: string;
  problemDescription: string;
  streetAddress: string;
  barangay: string;
  municipality: string;
  coordinates?: Coordinates;
  images: string[];
  preferredSchedule?: string;
  status: BookingStatus;
  quote?: Quote;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPricePhp: number;
  totalPricePhp: number;
}

export interface Quote {
  id: string;
  requestId: string;
  providerId: string;
  providerName: string;
  laborFeePhp: number;
  partsFeePhp: number;
  calloutFeePhp: number;
  totalAmountPhp: number;
  validUntil: string;
  notes?: string;
  lineItems: QuoteLineItem[];
  isAccepted: boolean;
  acceptedAt?: string;
  createdAt: string;
}

export interface RoadsideRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  vehicleType: "Motorcycle" | "Car" | "Tricycle" | "Van / Pickup" | "Truck" | "Bicycle";
  vehicleModel?: string;
  issueCategory: "Flat Tire / Vulcanizing" | "Dead Battery / Jump-start" | "Mechanical Breakdown" | "Towing / Recovery" | "Fuel Delivery" | "Locked Out";
  description: string;
  pickupAddress: string;
  barangay: string;
  municipality: string;
  coordinates: Coordinates;
  assignedProviderId?: string;
  assignedProviderName?: string;
  assignedProviderPhone?: string;
  dispatchStatus: DispatchStatus;
  etaMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewCriteria {
  quality: number;
  professionalism: number;
  communication: number;
  value: number;
  timeliness: number;
}

export interface Review {
  id: string;
  bookingId: string;
  providerId: string;
  customerId: string;
  customerName: string;
  overallRating: number;
  criteria: ReviewCriteria;
  reviewText: string;
  imageUrl?: string;
  providerResponse?: {
    responseText: string;
    respondedAt: string;
  };
  isModerated: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  content: string;
  attachmentUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  requestId?: string;
  roadsideRequestId?: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  lastMessageSnippet: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ProviderLead {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  services: string;
  location: string;
  barangay: string;
  municipality: string;
  phone: string;
  sourceType: string;
  evidenceStrength: string;
  plusCode?: string;
  gpsDerivation?: string;
  mapPrecision?: string;
  providerVerification?: string;
  coordinateSourceUrl?: string;
  listingUrl?: string;
  googleMapsPinUrl?: string;
  locationCaveats?: string;
  googleMapsSearchUrl?: string;
  coordinates: Coordinates | null;
  hasResolvedCoordinates?: boolean;
  mobileRoadsideDispatch: string;
  outreachStatus: "Not contacted" | "Contacted" | "In discussion" | "Verified partner" | "Declined";
  referenceUrl?: string;
  verificationNotes?: string;
  isPromotedToProvider: boolean;
}

export interface AdminMetrics {
  totalApprovedProviders: number;
  pendingVerifications: number;
  activeServiceRequests: number;
  completedServices: number;
  activeRoadsideDispatches: number;
  unfulfilledRoadsideRequests: number;
  totalReviews: number;
  openDisputes: number;
  totalLeads: number;
  contactedLeads: number;
}
