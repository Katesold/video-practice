/**
 * Video Events Type Definitions
 *
 * These types represent the kind of event-based data you might encounter
 * in a video commerce platform. Events are generated when users interact
 * with products in videos.
 *
 * SYSTEM DESIGN CONSIDERATIONS:
 * - Events are immutable and append-only (great for event sourcing)
 * - Each event has a timestamp for time-based aggregations
 * - User and session IDs enable user journey analysis
 * - Product IDs enable product performance analysis
 */

export type EventType =
  | "video_play"
  | "video_pause"
  | "video_complete"
  | "product_click"
  | "product_hover"
  | "add_to_cart"
  | "purchase"
  | "video_seek";

export interface EventMetadata {
  videoTimestamp?: number;
  videoDuration?: number;
  productPrice?: number;
  productName?: string;
  productCategory?: string;
  quantity?: number;
  totalAmount?: number;
  deviceType: "mobile" | "desktop" | "tablet";
  referrer?: string;
}

export interface VideoEvent {
  id: string;
  type: EventType;
  timestamp: string;
  userId: string;
  sessionId: string;
  videoId: string;
  productId?: string;
  metadata: EventMetadata;
}

export interface UserEngagement {
  userId: string;
  totalWatchTime: number;
  videosWatched: number;
  productsClicked: number;
  purchaseCount: number;
  totalSpent: number;
  conversionRate: number;
  sessions: string[];
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  productCategory: string;
  impressions: number;
  clicks: number;
  hovers: number;
  addToCartCount: number;
  purchases: number;
  revenue: number;
  clickThroughRate: number;
  conversionRate: number;
}

export interface VideoAnalytics {
  videoId: string;
  totalViews: number;
  completionRate: number;
  avgWatchTime: number;
  totalProductClicks: number;
  topProducts: Array<{
    productId: string;
    clicks: number;
  }>;
  dropOffPoints: number[];
}

export interface SessionSummary {
  sessionId: string;
  userId: string;
  startTime: string;
  endTime: string;
  duration: number;
  videosWatched: string[];
  productsInteracted: string[];
  purchased: boolean;
  totalSpent: number;
}
