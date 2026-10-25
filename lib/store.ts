import {
  Provider,
  ServiceRequest,
  RoadsideRequest,
  Quote,
  Review,
  Conversation,
  Message,
  ProviderLead,
  BookingStatus,
  DispatchStatus,
  VerificationStatus,
  ServiceMode,
} from "@/types";
import { INITIAL_PROVIDERS, INITIAL_REVIEWS } from "@/data/seed_data";
import RAW_LEADS from "@/data/antique_provider_leads.json";
import { calculateDistanceKm, slugify } from "@/lib/utils";

const STORAGE_KEY_PROVIDERS = "we_got_you_providers_v1";
const STORAGE_KEY_REQUESTS = "we_got_you_requests_v1";
const STORAGE_KEY_ROADSIDE = "we_got_you_roadside_v1";
const STORAGE_KEY_REVIEWS = "we_got_you_reviews_v1";
const STORAGE_KEY_CONVERSATIONS = "we_got_you_conversations_v1";
const STORAGE_KEY_MESSAGES = "we_got_you_messages_v1";
const STORAGE_KEY_LEADS = "we_got_you_leads_v1";
const STORAGE_KEY_FAVORITES = "we_got_you_favorites_v1";

export class DataStore {
  private static instance: DataStore;
  private isBrowser: boolean;

  private constructor() {
    this.isBrowser = typeof window !== "undefined";
    this.initializeDefaults();
  }

  public static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  private initializeDefaults() {
    if (!this.isBrowser) return;

    if (!localStorage.getItem(STORAGE_KEY_PROVIDERS)) {
      localStorage.setItem(STORAGE_KEY_PROVIDERS, JSON.stringify(INITIAL_PROVIDERS));
    }

    if (!localStorage.getItem(STORAGE_KEY_REVIEWS)) {
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(INITIAL_REVIEWS));
    }

    if (!localStorage.getItem(STORAGE_KEY_LEADS)) {
      const formattedLeads: ProviderLead[] = (RAW_LEADS as any[]).map((lead) => ({
        ...lead,
        outreachStatus: lead.outreachStatus || "Not contacted",
        isPromotedToProvider: INITIAL_PROVIDERS.some((p) => p.sourceLeadId === lead.id),
      }));
      localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(formattedLeads));
    }

    if (!localStorage.getItem(STORAGE_KEY_REQUESTS)) {
      localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEY_ROADSIDE)) {
      localStorage.setItem(STORAGE_KEY_ROADSIDE, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEY_CONVERSATIONS)) {
      localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEY_MESSAGES)) {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEY_FAVORITES)) {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify([]));
    }
  }

  // --- PROVIDERS ---
  public getProviders(): Provider[] {
    if (!this.isBrowser) return INITIAL_PROVIDERS;
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROVIDERS);
      return data ? JSON.parse(data) : INITIAL_PROVIDERS;
    } catch {
      return INITIAL_PROVIDERS;
    }
  }

  public getProviderBySlug(slug: string): Provider | undefined {
    return this.getProviders().find((p) => p.slug === slug);
  }

  public getProviderById(id: string): Provider | undefined {
    return this.getProviders().find((p) => p.id === id);
  }

  public saveProviders(providers: Provider[]): void {
    if (!this.isBrowser) return;
    localStorage.setItem(STORAGE_KEY_PROVIDERS, JSON.stringify(providers));
  }

  public updateProvider(id: string, updates: Partial<Provider>): Provider | null {
    const providers = this.getProviders();
    const index = providers.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updated = { ...providers[index], ...updates };
    providers[index] = updated;
    this.saveProviders(providers);
    return updated;
  }

  public createProvider(providerData: Omit<Provider, "id" | "createdAt" | "averageRating" | "reviewCount">): Provider {
    const providers = this.getProviders();
    const newProvider: Provider = {
      ...providerData,
      id: `prov-${Date.now()}`,
      createdAt: new Date().toISOString(),
      averageRating: 0,
      reviewCount: 0,
    };
    this.saveProviders([newProvider, ...providers]);
    return newProvider;
  }

  // --- SERVICE REQUESTS & BOOKINGS ---
  public getServiceRequests(): ServiceRequest[] {
    if (!this.isBrowser) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY_REQUESTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveServiceRequests(requests: ServiceRequest[]): void {
    if (!this.isBrowser) return;
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));
  }

  public getServiceRequestById(id: string): ServiceRequest | undefined {
    return this.getServiceRequests().find((r) => r.id === id);
  }

  public createServiceRequest(
    data: Omit<ServiceRequest, "id" | "status" | "createdAt" | "updatedAt">
  ): ServiceRequest {
    const requests = this.getServiceRequests();
    const newRequest: ServiceRequest = {
      ...data,
      id: `req-${Date.now()}`,
      status: "SUBMITTED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.saveServiceRequests([newRequest, ...requests]);

    // Create a message conversation thread if a provider was targeted
    if (data.providerId) {
      this.getOrCreateConversation({
        requestId: newRequest.id,
        customerId: data.customerId,
        customerName: data.customerName,
        providerId: data.providerId,
        providerName: data.providerName || "Service Provider",
        initialMessage: `New service request submitted: "${data.problemTitle}"`,
      });
    }

    return newRequest;
  }

  public updateBookingStatus(
    requestId: string,
    newStatus: BookingStatus,
    note?: string
  ): ServiceRequest | null {
    const requests = this.getServiceRequests();
    const index = requests.findIndex((r) => r.id === requestId);
    if (index === -1) return null;

    const current = requests[index];
    const updated: ServiceRequest = {
      ...current,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    requests[index] = updated;
    this.saveServiceRequests(requests);
    return updated;
  }

  public submitQuote(requestId: string, quoteData: Omit<Quote, "id" | "requestId" | "createdAt" | "isAccepted">): Quote | null {
    const requests = this.getServiceRequests();
    const index = requests.findIndex((r) => r.id === requestId);
    if (index === -1) return null;

    const newQuote: Quote = {
      ...quoteData,
      id: `quote-${Date.now()}`,
      requestId,
      isAccepted: false,
      createdAt: new Date().toISOString(),
    };

    requests[index] = {
      ...requests[index],
      quote: newQuote,
      status: "QUOTE_SENT",
      updatedAt: new Date().toISOString(),
    };

    this.saveServiceRequests(requests);
    return newQuote;
  }

  public acceptQuote(requestId: string): boolean {
    const requests = this.getServiceRequests();
    const index = requests.findIndex((r) => r.id === requestId);
    if (index === -1 || !requests[index].quote) return false;

    const currentQuote = requests[index].quote!;
    const updatedQuote: Quote = {
      ...currentQuote,
      isAccepted: true,
      acceptedAt: new Date().toISOString(),
    };

    requests[index] = {
      ...requests[index],
      quote: updatedQuote,
      status: "QUOTE_ACCEPTED",
      updatedAt: new Date().toISOString(),
    };

    this.saveServiceRequests(requests);
    return true;
  }

  // --- ROADSIDE ASSISTANCE & DISPATCH ---
  public getRoadsideRequests(): RoadsideRequest[] {
    if (!this.isBrowser) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY_ROADSIDE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveRoadsideRequests(requests: RoadsideRequest[]): void {
    if (!this.isBrowser) return;
    localStorage.setItem(STORAGE_KEY_ROADSIDE, JSON.stringify(requests));
  }

  public getRoadsideRequestById(id: string): RoadsideRequest | undefined {
    return this.getRoadsideRequests().find((r) => r.id === id);
  }

  public createRoadsideRequest(
    data: Omit<RoadsideRequest, "id" | "dispatchStatus" | "createdAt" | "updatedAt">
  ): RoadsideRequest {
    const requests = this.getRoadsideRequests();
    const newRequest: RoadsideRequest = {
      ...data,
      id: `roadside-${Date.now()}`,
      dispatchStatus: "LOOKING_FOR_PROVIDER",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.saveRoadsideRequests([newRequest, ...requests]);
    return newRequest;
  }

  public updateRoadsideStatus(
    id: string,
    dispatchStatus: DispatchStatus,
    extraUpdates?: Partial<RoadsideRequest>
  ): RoadsideRequest | null {
    const requests = this.getRoadsideRequests();
    const index = requests.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const updated: RoadsideRequest = {
      ...requests[index],
      dispatchStatus,
      ...extraUpdates,
      updatedAt: new Date().toISOString(),
    };

    requests[index] = updated;
    this.saveRoadsideRequests(requests);
    return updated;
  }

  /**
   * Matches verified providers who have active roadside dispatch enabled
   * and sort by proximity to the customer
   */
  public matchRoadsideProviders(
    customerLat: number,
    customerLng: number,
    maxDistanceKm = 30
  ): { provider: Provider; distanceKm: number }[] {
    const providers = this.getProviders();
    return providers
      .filter((p) => p.isRoadsideActive && p.serviceModes.includes("ROADSIDE_ASSISTANCE"))
      .map((p) => {
        const distance = calculateDistanceKm(
          customerLat,
          customerLng,
          p.coordinates.lat,
          p.coordinates.lng
        );
        return { provider: p, distanceKm: distance };
      })
      .filter((item) => item.distanceKm <= maxDistanceKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  // --- REVIEWS ---
  public getReviews(): Review[] {
    if (!this.isBrowser) return INITIAL_REVIEWS;
    try {
      const data = localStorage.getItem(STORAGE_KEY_REVIEWS);
      return data ? JSON.parse(data) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  }

  public getReviewsByProviderId(providerId: string): Review[] {
    return this.getReviews().filter((r) => r.providerId === providerId && !r.isModerated);
  }

  public submitReview(reviewData: Omit<Review, "id" | "createdAt" | "isModerated">): Review {
    const reviews = this.getReviews();
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      isModerated: false,
      createdAt: new Date().toISOString(),
    };

    const updatedReviews = [newReview, ...reviews];
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(updatedReviews));
    }

    // Mathematically re-calculate provider average rating from genuine eligible reviews
    const providerReviews = updatedReviews.filter(
      (r) => r.providerId === reviewData.providerId && !r.isModerated
    );
    const totalScore = providerReviews.reduce((sum, r) => sum + r.overallRating, 0);
    const newAvg = Math.round((totalScore / providerReviews.length) * 10) / 10;

    this.updateProvider(reviewData.providerId, {
      averageRating: newAvg,
      reviewCount: providerReviews.length,
    });

    return newReview;
  }

  public respondToReview(reviewId: string, responseText: string): boolean {
    const reviews = this.getReviews();
    const index = reviews.findIndex((r) => r.id === reviewId);
    if (index === -1) return false;

    reviews[index] = {
      ...reviews[index],
      providerResponse: {
        responseText,
        respondedAt: new Date().toISOString(),
      },
    };

    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
    }
    return true;
  }

  // --- MESSAGING ---
  public getConversations(): Conversation[] {
    if (!this.isBrowser) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY_CONVERSATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public getMessages(conversationId: string): Message[] {
    if (!this.isBrowser) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY_MESSAGES);
      const all: Message[] = data ? JSON.parse(data) : [];
      return all.filter((m) => m.conversationId === conversationId);
    } catch {
      return [];
    }
  }

  public sendMessage(
    conversationId: string,
    senderId: string,
    senderRole: "customer" | "provider" | "admin",
    senderName: string,
    content: string,
    attachmentUrl?: string
  ): Message {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      senderRole,
      senderName,
      content,
      attachmentUrl,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    if (this.isBrowser) {
      const currentMessages: Message[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY_MESSAGES) || "[]"
      );
      localStorage.setItem(
        STORAGE_KEY_MESSAGES,
        JSON.stringify([...currentMessages, newMessage])
      );

      // Update conversation snippet
      const conversations = this.getConversations();
      const index = conversations.findIndex((c) => c.id === conversationId);
      if (index !== -1) {
        conversations[index] = {
          ...conversations[index],
          lastMessageSnippet: content,
          lastMessageAt: newMessage.createdAt,
          unreadCount: conversations[index].unreadCount + 1,
        };
        localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(conversations));
      }
    }

    return newMessage;
  }

  public getOrCreateConversation(params: {
    requestId?: string;
    roadsideRequestId?: string;
    customerId: string;
    customerName: string;
    providerId: string;
    providerName: string;
    initialMessage?: string;
  }): Conversation {
    const conversations = this.getConversations();
    let existing = conversations.find(
      (c) =>
        (params.requestId && c.requestId === params.requestId) ||
        (c.customerId === params.customerId && c.providerId === params.providerId)
    );

    if (existing) return existing;

    const newConvo: Conversation = {
      id: `conv-${Date.now()}`,
      requestId: params.requestId,
      roadsideRequestId: params.roadsideRequestId,
      customerId: params.customerId,
      customerName: params.customerName,
      providerId: params.providerId,
      providerName: params.providerName,
      lastMessageSnippet: params.initialMessage || "Conversation started",
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
    };

    if (this.isBrowser) {
      localStorage.setItem(
        STORAGE_KEY_CONVERSATIONS,
        JSON.stringify([newConvo, ...conversations])
      );
      if (params.initialMessage) {
        this.sendMessage(
          newConvo.id,
          params.customerId,
          "customer",
          params.customerName,
          params.initialMessage
        );
      }
    }

    return newConvo;
  }

  // --- LEADS & ADMIN IMPORT ---
  public getLeads(): ProviderLead[] {
    if (!this.isBrowser) return (RAW_LEADS as any[]).map(l => ({ ...l, isPromotedToProvider: false }));
    try {
      const data = localStorage.getItem(STORAGE_KEY_LEADS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveLeads(leads: ProviderLead[]): void {
    if (!this.isBrowser) return;
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads));
  }

  public updateLeadOutreachStatus(
    leadId: string,
    status: ProviderLead["outreachStatus"]
  ): boolean {
    const leads = this.getLeads();
    const index = leads.findIndex((l) => l.id === leadId);
    if (index === -1) return false;

    leads[index].outreachStatus = status;
    this.saveLeads(leads);
    return true;
  }

  public promoteLeadToProvider(leadId: string): Provider | null {
    const leads = this.getLeads();
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.isPromotedToProvider) return null;

    const newProvider: Provider = {
      id: `prov-lead-${lead.id}`,
      slug: slugify(lead.name),
      businessName: lead.name,
      businessType: "REGISTERED_SHOP",
      category: lead.category,
      subcategories: [lead.subcategory || "General Servicing"],
      description: `Discovered local provider in ${lead.location}, San Jose de Buenavista. Services: ${lead.services}. Source: ${lead.sourceType}.`,
      contactPhone: lead.phone || "0917 000 0000",
      streetAddress: lead.location,
      barangay: lead.barangay || "San Jose de Buenavista",
      municipality: lead.municipality || "San Jose de Buenavista",
      coordinates: lead.coordinates || { lat: 10.7441, lng: 121.9402 },
      verificationStatus: "APPROVED",
      verificationDetails: {
        hasVerifiedIdentity: true,
        hasVerifiedContact: Boolean(lead.phone),
        hasVerifiedBusinessPermit: lead.evidenceStrength.includes("Manufacturer-listed"),
        hasVerifiedCredentials: true,
        verifiedAt: new Date().toISOString(),
        reviewerNotes: `Promoted from research lead (${lead.sourceType}). Notes: ${lead.verificationNotes}`,
      },
      serviceModes: ["SHOP_VISIT"],
      specialties: [lead.subcategory || "Repair"],
      services: [
        {
          id: `s-${lead.id}-1`,
          title: "Initial Diagnostic Check",
          description: "Bench diagnosis and repair estimation",
          priceMinPhp: 250,
          requiresDiagnostic: false,
        },
      ],
      calloutFeePhp: 0,
      minServicePricePhp: 250,
      openingHours: {
        monday: "8:00 AM - 5:00 PM",
        tuesday: "8:00 AM - 5:00 PM",
        wednesday: "8:00 AM - 5:00 PM",
        thursday: "8:00 AM - 5:00 PM",
        friday: "8:00 AM - 5:00 PM",
        saturday: "8:00 AM - 3:00 PM",
        sunday: "Closed",
      },
      isPublished: true,
      isAcceptingBookings: true,
      isRoadsideActive: false,
      averageRating: 0,
      reviewCount: 0,
      galleryImages: [],
      sourceLeadId: lead.id,
      createdAt: new Date().toISOString(),
    };

    // Mark lead as promoted
    lead.isPromotedToProvider = true;
    lead.outreachStatus = "Verified partner";
    this.saveLeads(leads);

    // Save newly created provider
    const providers = this.getProviders();
    this.saveProviders([newProvider, ...providers]);

    return newProvider;
  }

  // --- FAVORITES ---
  public getFavorites(): string[] {
    if (!this.isBrowser) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY_FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public toggleFavorite(providerId: string): boolean {
    if (!this.isBrowser) return false;
    const favs = this.getFavorites();
    const exists = favs.includes(providerId);
    const updated = exists ? favs.filter((id) => id !== providerId) : [...favs, providerId];
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(updated));
    return !exists;
  }
}

export const store = DataStore.getInstance();
