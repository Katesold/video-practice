/**
 * Mock Video Events Data
 * 
 * This simulates event data from a video commerce platform.
 * In a real system, this would come from:
 * - Event streaming (Kafka, Kinesis)
 * - Data warehouse (BigQuery, Snowflake)
 * - API endpoints
 * 
 * SCALE CONSIDERATIONS:
 * - Real systems process millions of events per day
 * - Events need to be partitioned (by date, user, video)
 * - Consider event retention policies
 */

import type { VideoEvent } from '../types/events';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// Sample data
const users = ['user_001', 'user_002', 'user_003', 'user_004', 'user_005'];
const videos = ['vid_fashion_summer', 'vid_tech_review', 'vid_home_decor', 'vid_fitness_gear'];
const products = [
  { id: 'prod_001', name: 'Summer Dress', category: 'Fashion', price: 79.99 },
  { id: 'prod_002', name: 'Wireless Earbuds', category: 'Tech', price: 149.99 },
  { id: 'prod_003', name: 'Modern Lamp', category: 'Home', price: 89.99 },
  { id: 'prod_004', name: 'Yoga Mat', category: 'Fitness', price: 39.99 },
  { id: 'prod_005', name: 'Running Shoes', category: 'Fitness', price: 129.99 },
  { id: 'prod_006', name: 'Smart Watch', category: 'Tech', price: 299.99 },
  { id: 'prod_007', name: 'Denim Jacket', category: 'Fashion', price: 119.99 },
  { id: 'prod_008', name: 'Plant Pot Set', category: 'Home', price: 45.99 },
];

// Generate realistic event sequences
export const videoEvents: VideoEvent[] = [
  // User 001 - Full conversion journey (fashion video)
  {
    id: generateId(),
    type: 'video_play',
    timestamp: '2026-01-15T09:00:00.000Z',
    userId: 'user_001',
    sessionId: 'session_001',
    videoId: 'vid_fashion_summer',
    metadata: { videoTimestamp: 0, videoDuration: 180, deviceType: 'mobile' }
  },
  {
    id: generateId(),
    type: 'product_hover',
    timestamp: '2026-01-15T09:00:45.000Z',
    userId: 'user_001',
    sessionId: 'session_001',
    videoId: 'vid_fashion_summer',
    productId: 'prod_001',
    metadata: { videoTimestamp: 45, videoDuration: 180, deviceType: 'mobile', productPrice: 79.99, productName: 'Summer Dress', productCategory: 'Fashion' }
  },
  {
    id: generateId(),
    type: 'product_click',
    timestamp: '2026-01-15T09:00:50.000Z',
    userId: 'user_001',
    sessionId: 'session_001',
    videoId: 'vid_fashion_summer',
    productId: 'prod_001',
    metadata: { videoTimestamp: 50, videoDuration: 180, deviceType: 'mobile', productPrice: 79.99, productName: 'Summer Dress', productCategory: 'Fashion' }
  },
  {
    id: generateId(),
    type: 'add_to_cart',
    timestamp: '2026-01-15T09:01:30.000Z',
    userId: 'user_001',
    sessionId: 'session_001',
    videoId: 'vid_fashion_summer',
    productId: 'prod_001',
    metadata: { deviceType: 'mobile', productPrice: 79.99, productName: 'Summer Dress', productCategory: 'Fashion', quantity: 1 }
  },
  {
    id: generateId(),
    type: 'video_complete',
    timestamp: '2026-01-15T09:03:00.000Z',
    userId: 'user_001',
    sessionId: 'session_001',
    videoId: 'vid_fashion_summer',
    metadata: { videoTimestamp: 180, videoDuration: 180, deviceType: 'mobile' }
  },
  {
    id: generateId(),
    type: 'purchase',
    timestamp: '2026-01-15T09:05:00.000Z',
    userId: 'user_001',
    sessionId: 'session_001',
    videoId: 'vid_fashion_summer',
    productId: 'prod_001',
    metadata: { deviceType: 'mobile', productPrice: 79.99, productName: 'Summer Dress', productCategory: 'Fashion', quantity: 1, totalAmount: 79.99 }
  },

  // User 001 - Second session (tech video, no purchase)
  {
    id: generateId(),
    type: 'video_play',
    timestamp: '2026-01-15T14:00:00.000Z',
    userId: 'user_001',
    sessionId: 'session_002',
    videoId: 'vid_tech_review',
    metadata: { videoTimestamp: 0, videoDuration: 300, deviceType: 'desktop' }
  },
  {
    id: generateId(),
    type: 'product_click',
    timestamp: '2026-01-15T14:02:00.000Z',
    userId: 'user_001',
    sessionId: 'session_002',
    videoId: 'vid_tech_review',
    productId: 'prod_002',
    metadata: { videoTimestamp: 120, videoDuration: 300, deviceType: 'desktop', productPrice: 149.99, productName: 'Wireless Earbuds', productCategory: 'Tech' }
  },
  {
    id: generateId(),
    type: 'video_pause',
    timestamp: '2026-01-15T14:03:30.000Z',
    userId: 'user_001',
    sessionId: 'session_002',
    videoId: 'vid_tech_review',
    metadata: { videoTimestamp: 210, videoDuration: 300, deviceType: 'desktop' }
  },

  // User 002 - Browse and purchase multiple items
  {
    id: generateId(),
    type: 'video_play',
    timestamp: '2026-01-15T10:00:00.000Z',
    userId: 'user_002',
    sessionId: 'session_003',
    videoId: 'vid_fitness_gear',
    metadata: { videoTimestamp: 0, videoDuration: 240, deviceType: 'tablet' }
  },
  {
    id: generateId(),
    type: 'product_click',
    timestamp: '2026-01-15T10:01:00.000Z',
    userId: 'user_002',
    sessionId: 'session_003',
    videoId: 'vid_fitness_gear',
    productId: 'prod_004',
    metadata: { videoTimestamp: 60, videoDuration: 240, deviceType: 'tablet', productPrice: 39.99, productName: 'Yoga Mat', productCategory: 'Fitness' }
  },
  {
    id: generateId(),
    type: 'product_click',
    timestamp: '2026-01-15T10:02:30.000Z',
    userId: 'user_002',
    sessionId: 'session_003',
    videoId: 'vid_fitness_gear',
    productId: 'prod_005',
    metadata: { videoTimestamp: 150, videoDuration: 240, deviceType: 'tablet', productPrice: 129.99, productName: 'Running Shoes', productCategory: 'Fitness' }
  },
  {
    id: generateId(),
    type: 'add_to_cart',
    timestamp: '2026-01-15T10:03:00.000Z',
    userId: 'user_002',
    sessionId: 'session_003',
    videoId: 'vid_fitness_gear',
    productId: 'prod_004',
    metadata: { deviceType: 'tablet', productPrice: 39.99, productName: 'Yoga Mat', productCategory: 'Fitness', quantity: 2 }
  },
  {
    id: generateId(),
    type: 'add_to_cart',
    timestamp: '2026-01-15T10:03:30.000Z',
    userId: 'user_002',
    sessionId: 'session_003',
    videoId: 'vid_fitness_gear',
    productId: 'prod_005',
    metadata: { deviceType: 'tablet', productPrice: 129.99, productName: 'Running Shoes', productCategory: 'Fitness', quantity: 1 }
  },
  {
    id: generateId(),
    type: 'video_complete',
    timestamp: '2026-01-15T10:04:00.000Z',
    userId: 'user_002',
    sessionId: 'session_003',
    videoId: 'vid_fitness_gear',
    metadata: { videoTimestamp: 240, videoDuration: 240, deviceType: 'tablet' }
  },
  {
    id: generateId(),
    type: 'purchase',
    timestamp: '2026-01-15T10:06:00.000Z',
    userId: 'user_002',
    sessionId: 'session_003',
    videoId: 'vid_fitness_gear',
    productId: 'prod_004',
    metadata: { deviceType: 'tablet', productPrice: 39.99, productName: 'Yoga Mat', productCategory: 'Fitness', quantity: 2, totalAmount: 79.98 }
  },
  {
    id: generateId(),
    type: 'purchase',
    timestamp: '2026-01-15T10:06:00.000Z',
    userId: 'user_002',
    sessionId: 'session_003',
    videoId: 'vid_fitness_gear',
    productId: 'prod_005',
    metadata: { deviceType: 'tablet', productPrice: 129.99, productName: 'Running Shoes', productCategory: 'Fitness', quantity: 1, totalAmount: 129.99 }
  },

  // User 003 - Window shopper (lots of clicks, no purchase)
  {
    id: generateId(),
    type: 'video_play',
    timestamp: '2026-01-15T11:00:00.000Z',
    userId: 'user_003',
    sessionId: 'session_004',
    videoId: 'vid_home_decor',
    metadata: { videoTimestamp: 0, videoDuration: 200, deviceType: 'mobile' }
  },
  {
    id: generateId(),
    type: 'product_hover',
    timestamp: '2026-01-15T11:00:30.000Z',
    userId: 'user_003',
    sessionId: 'session_004',
    videoId: 'vid_home_decor',
    productId: 'prod_003',
    metadata: { videoTimestamp: 30, videoDuration: 200, deviceType: 'mobile', productPrice: 89.99, productName: 'Modern Lamp', productCategory: 'Home' }
  },
  {
    id: generateId(),
    type: 'product_click',
    timestamp: '2026-01-15T11:00:35.000Z',
    userId: 'user_003',
    sessionId: 'session_004',
    videoId: 'vid_home_decor',
    productId: 'prod_003',
    metadata: { videoTimestamp: 35, videoDuration: 200, deviceType: 'mobile', productPrice: 89.99, productName: 'Modern Lamp', productCategory: 'Home' }
  },
  {
    id: generateId(),
    type: 'product_hover',
    timestamp: '2026-01-15T11:01:00.000Z',
    userId: 'user_003',
    sessionId: 'session_004',
    videoId: 'vid_home_decor',
    productId: 'prod_008',
    metadata: { videoTimestamp: 60, videoDuration: 200, deviceType: 'mobile', productPrice: 45.99, productName: 'Plant Pot Set', productCategory: 'Home' }
  },
  {
    id: generateId(),
    type: 'product_click',
    timestamp: '2026-01-15T11:01:05.000Z',
    userId: 'user_003',
    sessionId: 'session_004',
    videoId: 'vid_home_decor',
    productId: 'prod_008',
    metadata: { videoTimestamp: 65, videoDuration: 200, deviceType: 'mobile', productPrice: 45.99, productName: 'Plant Pot Set', productCategory: 'Home' }
  },
  {
    id: generateId(),
    type: 'video_seek',
    timestamp: '2026-01-15T11:01:30.000Z',
    userId: 'user_003',
    sessionId: 'session_004',
    videoId: 'vid_home_decor',
    metadata: { videoTimestamp: 150, videoDuration: 200, deviceType: 'mobile' }
  },
  {
    id: generateId(),
    type: 'video_pause',
    timestamp: '2026-01-15T11:02:00.000Z',
    userId: 'user_003',
    sessionId: 'session_004',
    videoId: 'vid_home_decor',
    metadata: { videoTimestamp: 180, videoDuration: 200, deviceType: 'mobile' }
  },

  // User 003 - Returns later and watches fashion video
  {
    id: generateId(),
    type: 'video_play',
    timestamp: '2026-01-15T16:00:00.000Z',
    userId: 'user_003',
    sessionId: 'session_005',
    videoId: 'vid_fashion_summer',
    metadata: { videoTimestamp: 0, videoDuration: 180, deviceType: 'desktop' }
  },
  {
    id: generateId(),
    type: 'product_click',
    timestamp: '2026-01-15T16:01:00.000Z',
    userId: 'user_003',
    sessionId: 'session_005',
    videoId: 'vid_fashion_summer',
    productId: 'prod_007',
    metadata: { videoTimestamp: 60, videoDuration: 180, deviceType: 'desktop', productPrice: 119.99, productName: 'Denim Jacket', productCategory: 'Fashion' }
  },
  {
    id: generateId(),
    type: 'video_complete',
    timestamp: '2026-01-15T16:03:00.000Z',
    userId: 'user_003',
    sessionId: 'session_005',
    videoId: 'vid_fashion_summer',
    metadata: { videoTimestamp: 180, videoDuration: 180, deviceType: 'desktop' }
  },

  // User 004 - Quick converter (tech video)
  {
    id: generateId(),
    type: 'video_play',
    timestamp: '2026-01-15T12:00:00.000Z',
    userId: 'user_004',
    sessionId: 'session_006',
    videoId: 'vid_tech_review',
    metadata: { videoTimestamp: 0, videoDuration: 300, deviceType: 'mobile' }
  },
  {
    id: generateId(),
    type: 'product_click',
    timestamp: '2026-01-15T12:00:30.000Z',
    userId: 'user_004',
    sessionId: 'session_006',
    videoId: 'vid_tech_review',
    productId: 'prod_006',
    metadata: { videoTimestamp: 30, videoDuration: 300, deviceType: 'mobile', productPrice: 299.99, productName: 'Smart Watch', productCategory: 'Tech' }
  },
  {
    id: generateId(),
    type: 'add_to_cart',
    timestamp: '2026-01-15T12:00:45.000Z',
    userId: 'user_004',
    sessionId: 'session_006',
    videoId: 'vid_tech_review',
    productId: 'prod_006',
    metadata: { deviceType: 'mobile', productPrice: 299.99, productName: 'Smart Watch', productCategory: 'Tech', quantity: 1 }
  },
  {
    id: generateId(),
    type: 'purchase',
    timestamp: '2026-01-15T12:02:00.000Z',
    userId: 'user_004',
    sessionId: 'session_006',
    videoId: 'vid_tech_review',
    productId: 'prod_006',
    metadata: { deviceType: 'mobile', productPrice: 299.99, productName: 'Smart Watch', productCategory: 'Tech', quantity: 1, totalAmount: 299.99 }
  },

  // User 005 - Just browsing (video only, no product interaction)
  {
    id: generateId(),
    type: 'video_play',
    timestamp: '2026-01-15T13:00:00.000Z',
    userId: 'user_005',
    sessionId: 'session_007',
    videoId: 'vid_home_decor',
    metadata: { videoTimestamp: 0, videoDuration: 200, deviceType: 'desktop' }
  },
  {
    id: generateId(),
    type: 'video_seek',
    timestamp: '2026-01-15T13:01:00.000Z',
    userId: 'user_005',
    sessionId: 'session_007',
    videoId: 'vid_home_decor',
    metadata: { videoTimestamp: 100, videoDuration: 200, deviceType: 'desktop' }
  },
  {
    id: generateId(),
    type: 'video_complete',
    timestamp: '2026-01-15T13:02:40.000Z',
    userId: 'user_005',
    sessionId: 'session_007',
    videoId: 'vid_home_decor',
    metadata: { videoTimestamp: 200, videoDuration: 200, deviceType: 'desktop' }
  },

  // User 005 - Watches tech video too
  {
    id: generateId(),
    type: 'video_play',
    timestamp: '2026-01-15T15:00:00.000Z',
    userId: 'user_005',
    sessionId: 'session_008',
    videoId: 'vid_tech_review',
    metadata: { videoTimestamp: 0, videoDuration: 300, deviceType: 'desktop' }
  },
  {
    id: generateId(),
    type: 'product_hover',
    timestamp: '2026-01-15T15:01:30.000Z',
    userId: 'user_005',
    sessionId: 'session_008',
    videoId: 'vid_tech_review',
    productId: 'prod_002',
    metadata: { videoTimestamp: 90, videoDuration: 300, deviceType: 'desktop', productPrice: 149.99, productName: 'Wireless Earbuds', productCategory: 'Tech' }
  },
  {
    id: generateId(),
    type: 'video_pause',
    timestamp: '2026-01-15T15:03:00.000Z',
    userId: 'user_005',
    sessionId: 'session_008',
    videoId: 'vid_tech_review',
    metadata: { videoTimestamp: 180, videoDuration: 300, deviceType: 'desktop' }
  },
];

// Export for easy access in exercises
export const getEventsByUser = (userId: string): VideoEvent[] => 
  videoEvents.filter(e => e.userId === userId);

export const getEventsByVideo = (videoId: string): VideoEvent[] =>
  videoEvents.filter(e => e.videoId === videoId);

export const getEventsByProduct = (productId: string): VideoEvent[] =>
  videoEvents.filter(e => e.productId === productId);

export const getEventsBySession = (sessionId: string): VideoEvent[] =>
  videoEvents.filter(e => e.sessionId === sessionId);

export const getEventsByType = (type: VideoEvent['type']): VideoEvent[] =>
  videoEvents.filter(e => e.type === type);
