/**
 * ============================================================================
 * VIDEO EVENTS AGGREGATION EXERCISE
 * ============================================================================
 * 
 * This is a paired programming exercise simulating a real interview task.
 * You'll work through aggregating video event data to produce meaningful outputs.
 * 
 * INSTRUCTIONS:
 * 1. Read each function's requirements carefully
 * 2. Implement the logic step by step
 * 3. Think about edge cases and trade-offs
 * 4. Consider how this would scale with millions of events
 * 
 * TIPS FOR THE INTERVIEW:
 * - Talk through your thinking out loud
 * - Ask clarifying questions
 * - Consider edge cases (empty arrays, missing data)
 * - Think about performance implications
 * - Don't rush - understanding the problem is key
 * 
 * ============================================================================
 */

import type { 
  VideoEvent, 
  UserEngagement, 
  ProductPerformance, 
  VideoAnalytics,
  SessionSummary 
} from '../types/events';

/**
 * EXERCISE 1: Aggregate User Engagement
 * 
 * Given an array of events, calculate engagement metrics for a specific user.
 * 
 * Requirements:
 * - totalWatchTime: Sum of time spent watching videos (use video_play to video_complete/pause)
 * - videosWatched: Count of unique videos started
 * - productsClicked: Count of product_click events
 * - purchaseCount: Count of purchase events
 * - totalSpent: Sum of totalAmount from purchase events
 * - conversionRate: purchases / clicks (0 if no clicks)
 * - sessions: Array of unique session IDs
 * 
 * @param events - All video events
 * @param userId - The user to aggregate for
 * @returns UserEngagement object
 * 
 * THINK ABOUT:
 * - How would you calculate watch time from play/pause/complete events?
 * - What if a user watches the same video multiple times?
 * - How do you handle division by zero for conversion rate?
 */
export function aggregateUserEngagement(events: VideoEvent[], userId: string): UserEngagement {
  // TODO: Filter events for this user
  const userEvents = events.filter(e => e.userId === userId);

  // TODO: Calculate unique videos watched
  const videosWatched = new Set(userEvents.filter(e => e.type === 'video_play').map(e => e.videoId)).size;

  // TODO: Count product clicks
  const productsClicked = userEvents.filter(e => e.type === 'product_click').length;

  // TODO: Count purchases and calculate total spent
  const purchases = userEvents.filter(e => e.type === 'purchase');
  const purchaseCount = purchases.length;
  const totalSpent = purchases.reduce((sum, e) => sum + (e.metadata.totalAmount || 0), 0);

  // TODO: Calculate conversion rate (handle division by zero)
  const conversionRate = productsClicked > 0 ? purchaseCount / productsClicked : 0;

  // TODO: Get unique sessions
  const sessions = [...new Set(userEvents.map(e => e.sessionId))];

  // TODO: Calculate total watch time
  // Hint: You need to pair video_play with video_complete or video_pause events
  let totalWatchTime = 0;
  const playEvents = userEvents.filter(e => e.type === 'video_play');
  const endEvents = userEvents.filter(e => e.type === 'video_complete' || e.type === 'video_pause');
  
  for (const play of playEvents) {
    const correspondingEnd = endEvents.find(
      e => e.sessionId === play.sessionId && 
           e.videoId === play.videoId && 
           new Date(e.timestamp) > new Date(play.timestamp)
    );
    if (correspondingEnd && correspondingEnd.metadata.videoTimestamp) {
      totalWatchTime += correspondingEnd.metadata.videoTimestamp - (play.metadata.videoTimestamp || 0);
    }
  }

  return {
    userId,
    totalWatchTime,
    videosWatched,
    productsClicked,
    purchaseCount,
    totalSpent,
    conversionRate,
    sessions
  };
}


/**
 * EXERCISE 2: Aggregate Product Performance
 * 
 * Calculate performance metrics for a specific product across all events.
 * 
 * Requirements:
 * - Count impressions (product_hover + product_click events)
 * - Count clicks, hovers, add-to-cart, purchases
 * - Calculate total revenue from purchases
 * - Calculate CTR and conversion rate
 * 
 * THINK ABOUT:
 * - What defines an "impression" in a video context?
 * - Should hover count as engagement or just interest?
 * - How would you track impressions in a real system?
 */
export function aggregateProductPerformance(events: VideoEvent[], productId: string): ProductPerformance {
  // TODO: Filter events for this product
  const productEvents = events.filter(e => e.productId === productId);

  // TODO: Get product details from any event with this product
  const sampleEvent = productEvents.find(e => e.metadata.productName);
  const productName = sampleEvent?.metadata.productName || 'Unknown';
  const productCategory = sampleEvent?.metadata.productCategory || 'Unknown';

  // TODO: Count different interaction types
  const hovers = productEvents.filter(e => e.type === 'product_hover').length;
  const clicks = productEvents.filter(e => e.type === 'product_click').length;
  const addToCartCount = productEvents.filter(e => e.type === 'add_to_cart').length;
  const purchaseEvents = productEvents.filter(e => e.type === 'purchase');
  const purchases = purchaseEvents.length;

  // TODO: Calculate revenue
  const revenue = purchaseEvents.reduce((sum, e) => sum + (e.metadata.totalAmount || 0), 0);

  // TODO: Calculate rates (impressions = hovers + clicks for this exercise)
  const impressions = hovers + clicks;
  const clickThroughRate = impressions > 0 ? clicks / impressions : 0;
  const conversionRate = clicks > 0 ? purchases / clicks : 0;

  return {
    productId,
    productName,
    productCategory,
    impressions,
    clicks,
    hovers,
    addToCartCount,
    purchases,
    revenue,
    clickThroughRate,
    conversionRate
  };
}


/**
 * EXERCISE 3: Aggregate Video Analytics
 * 
 * Calculate analytics for a specific video.
 * 
 * Requirements:
 * - Total views (video_play events)
 * - Completion rate (video_complete / video_play)
 * - Average watch time
 * - Product engagement from this video
 * - Top products clicked
 * 
 * THINK ABOUT:
 * - What's the difference between a "view" and a "complete watch"?
 * - How would you define "drop-off points"?
 * - How might this data inform video content strategy?
 */
export function aggregateVideoAnalytics(events: VideoEvent[], videoId: string): VideoAnalytics {
  // TODO: Filter events for this video
  const videoEvents = events.filter(e => e.videoId === videoId);

  // TODO: Count views and completions
  const totalViews = videoEvents.filter(e => e.type === 'video_play').length;
  const completions = videoEvents.filter(e => e.type === 'video_complete').length;
  const completionRate = totalViews > 0 ? completions / totalViews : 0;

  // TODO: Calculate average watch time
  const pauseAndCompleteEvents = videoEvents.filter(
    e => e.type === 'video_complete' || e.type === 'video_pause'
  );
  const totalWatchTime = pauseAndCompleteEvents.reduce(
    (sum, e) => sum + (e.metadata.videoTimestamp || 0), 
    0
  );
  const avgWatchTime = pauseAndCompleteEvents.length > 0 
    ? totalWatchTime / pauseAndCompleteEvents.length 
    : 0;

  // TODO: Count product clicks from this video
  const productClickEvents = videoEvents.filter(e => e.type === 'product_click');
  const totalProductClicks = productClickEvents.length;

  // TODO: Get top products (aggregate clicks by product)
  const productClickCounts: Record<string, number> = {};
  for (const event of productClickEvents) {
    if (event.productId) {
      productClickCounts[event.productId] = (productClickCounts[event.productId] || 0) + 1;
    }
  }
  const topProducts = Object.entries(productClickCounts)
    .map(([productId, clicks]) => ({ productId, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  // TODO: Find drop-off points (timestamps where video_pause or video_seek happened)
  const dropOffPoints = videoEvents
    .filter(e => e.type === 'video_pause' || e.type === 'video_seek')
    .map(e => e.metadata.videoTimestamp || 0)
    .filter(t => t > 0);

  return {
    videoId,
    totalViews,
    completionRate,
    avgWatchTime,
    totalProductClicks,
    topProducts,
    dropOffPoints
  };
}


/**
 * EXERCISE 4: Build Session Summary
 * 
 * Create a summary of a user session - their complete journey in one visit.
 * 
 * Requirements:
 * - Session timing (start, end, duration)
 * - Videos watched in this session
 * - Products interacted with
 * - Whether they made a purchase
 * - Total spent in session
 * 
 * THINK ABOUT:
 * - How do you determine session boundaries?
 * - What insights could this provide to product teams?
 * - How would you detect "abandoned carts"?
 */
export function buildSessionSummary(events: VideoEvent[], sessionId: string): SessionSummary {
  // TODO: Filter events for this session
  const sessionEvents = events
    .filter(e => e.sessionId === sessionId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  if (sessionEvents.length === 0) {
    return {
      sessionId,
      userId: '',
      startTime: '',
      endTime: '',
      duration: 0,
      videosWatched: [],
      productsInteracted: [],
      purchased: false,
      totalSpent: 0
    };
  }

  // TODO: Get basic session info
  const userId = sessionEvents[0].userId;
  const startTime = sessionEvents[0].timestamp;
  const endTime = sessionEvents[sessionEvents.length - 1].timestamp;
  const duration = (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000;

  // TODO: Get unique videos and products
  const videosWatched = [...new Set(sessionEvents.map(e => e.videoId))];
  const productsInteracted = [...new Set(
    sessionEvents
      .filter(e => e.productId)
      .map(e => e.productId!)
  )];

  // TODO: Check purchases
  const purchaseEvents = sessionEvents.filter(e => e.type === 'purchase');
  const purchased = purchaseEvents.length > 0;
  const totalSpent = purchaseEvents.reduce((sum, e) => sum + (e.metadata.totalAmount || 0), 0);

  return {
    sessionId,
    userId,
    startTime,
    endTime,
    duration,
    videosWatched,
    productsInteracted,
    purchased,
    totalSpent
  };
}


/**
 * BONUS EXERCISE: Find High-Value Users
 * 
 * Identify users who have made purchases and rank them by value.
 * 
 * SYSTEM DESIGN DISCUSSION POINTS:
 * - How would you cache this computation?
 * - How often should this be recalculated?
 * - What indexes would help query this efficiently?
 */
export function findHighValueUsers(events: VideoEvent[], limit: number = 10): UserEngagement[] {
  // Get unique users
  const userIds = [...new Set(events.map(e => e.userId))];
  
  // Aggregate each user
  const userEngagements = userIds.map(userId => aggregateUserEngagement(events, userId));
  
  // Sort by total spent and return top N
  return userEngagements
    .filter(u => u.totalSpent > 0)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit);
}


/**
 * BONUS EXERCISE: Funnel Analysis
 * 
 * Track the conversion funnel: View → Click → Add to Cart → Purchase
 * 
 * SYSTEM DESIGN DISCUSSION POINTS:
 * - How would you visualize this data?
 * - What drop-off rates are acceptable?
 * - How would you A/B test to improve the funnel?
 */
export interface FunnelMetrics {
  videoViews: number;
  productClicks: number;
  addToCarts: number;
  purchases: number;
  viewToClickRate: number;
  clickToCartRate: number;
  cartToPurchaseRate: number;
  overallConversionRate: number;
}

export function analyzeFunnel(events: VideoEvent[]): FunnelMetrics {
  const videoViews = events.filter(e => e.type === 'video_play').length;
  const productClicks = events.filter(e => e.type === 'product_click').length;
  const addToCarts = events.filter(e => e.type === 'add_to_cart').length;
  const purchases = events.filter(e => e.type === 'purchase').length;

  return {
    videoViews,
    productClicks,
    addToCarts,
    purchases,
    viewToClickRate: videoViews > 0 ? productClicks / videoViews : 0,
    clickToCartRate: productClicks > 0 ? addToCarts / productClicks : 0,
    cartToPurchaseRate: addToCarts > 0 ? purchases / addToCarts : 0,
    overallConversionRate: videoViews > 0 ? purchases / videoViews : 0
  };
}


// ============================================================================
// ADDITIONAL PRACTICE EXERCISES
// These are common interview patterns you should be comfortable with
// ============================================================================

/**
 * EXERCISE 5: Time-Based Aggregation (GROUP BY time window)
 * 
 * Group events by hour and return counts per hour.
 * This is a VERY common interview question pattern.
 * 
 * Example output:
 * [
 *   { hour: '2026-01-15T09:00:00', eventCount: 12, purchases: 2 },
 *   { hour: '2026-01-15T10:00:00', eventCount: 8, purchases: 1 },
 * ]
 * 
 * THINK ABOUT:
 * - How would you group by day? By week?
 * - How would this scale with millions of events?
 * - What database indexes would help?
 */
export interface HourlyMetrics {
  hour: string;
  eventCount: number;
  purchases: number;
  revenue: number;
}

export function aggregateByHour(events: VideoEvent[]): HourlyMetrics[] {
  // Step 1: Create a map to group events by hour
  const hourlyMap: Record<string, { events: VideoEvent[]; purchases: number; revenue: number }> = {};

  for (const event of events) {
    // Truncate timestamp to the hour (e.g., "2026-01-15T09:00:00")
    const date = new Date(event.timestamp);
    date.setMinutes(0, 0, 0); // Zero out minutes, seconds, ms
    const hourKey = date.toISOString();

    // Initialize bucket if it doesn't exist
    if (!hourlyMap[hourKey]) {
      hourlyMap[hourKey] = { events: [], purchases: 0, revenue: 0 };
    }

    // Add event to bucket
    hourlyMap[hourKey].events.push(event);

    // Track purchases and revenue separately for quick access
    if (event.type === 'purchase') {
      hourlyMap[hourKey].purchases += 1;
      hourlyMap[hourKey].revenue += event.metadata.totalAmount || 0;
    }
  }

  // Step 2: Transform map to array and sort by hour
  return Object.entries(hourlyMap)
    .map(([hour, data]) => ({
      hour,
      eventCount: data.events.length,
      purchases: data.purchases,
      revenue: data.revenue
    }))
    .sort((a, b) => a.hour.localeCompare(b.hour));
}


/**
 * EXERCISE 6: Find Abandoned Carts
 * 
 * Find sessions where user added to cart but didn't purchase.
 * This is critical for remarketing and understanding drop-off.
 * 
 * Returns sessions with:
 * - Items left in cart
 * - Time since last activity
 * - Total cart value
 * 
 * THINK ABOUT:
 * - How would you trigger a "cart abandonment" email?
 * - What's the right threshold for "abandoned"?
 * - How would you prioritize which carts to follow up on?
 */
export interface AbandonedCart {
  sessionId: string;
  userId: string;
  cartItems: Array<{ productId: string; productName: string; price: number }>;
  cartValue: number;
  lastActivity: string;
  timeSinceLastActivity: number; // seconds
}

export function findAbandonedCarts(events: VideoEvent[]): AbandonedCart[] {
  // Step 1: Group events by session
  const sessionMap: Record<string, VideoEvent[]> = {};
  
  for (const event of events) {
    if (!sessionMap[event.sessionId]) {
      sessionMap[event.sessionId] = [];
    }
    sessionMap[event.sessionId].push(event);
  }

  // Step 2: Find sessions with add_to_cart but no purchase
  const abandonedCarts: AbandonedCart[] = [];
  const now = new Date();

  for (const [sessionId, sessionEvents] of Object.entries(sessionMap)) {
    const addToCartEvents = sessionEvents.filter(e => e.type === 'add_to_cart');
    const purchaseEvents = sessionEvents.filter(e => e.type === 'purchase');
    
    // Skip if no cart items or if they completed purchase
    if (addToCartEvents.length === 0) continue;
    
    // Get purchased product IDs to exclude from abandoned cart
    const purchasedProductIds = new Set(purchaseEvents.map(e => e.productId));
    
    // Find items added to cart but not purchased
    const abandonedItems = addToCartEvents
      .filter(e => e.productId && !purchasedProductIds.has(e.productId))
      .map(e => ({
        productId: e.productId!,
        productName: e.metadata.productName || 'Unknown',
        price: e.metadata.productPrice || 0
      }));

    if (abandonedItems.length === 0) continue;

    // Calculate cart value and last activity
    const cartValue = abandonedItems.reduce((sum, item) => sum + item.price, 0);
    const sortedEvents = sessionEvents.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    const lastActivity = sortedEvents[0].timestamp;
    const timeSinceLastActivity = (now.getTime() - new Date(lastActivity).getTime()) / 1000;

    abandonedCarts.push({
      sessionId,
      userId: sessionEvents[0].userId,
      cartItems: abandonedItems,
      cartValue,
      lastActivity,
      timeSinceLastActivity
    });
  }

  // Sort by cart value (highest first - these are most valuable to recover)
  return abandonedCarts.sort((a, b) => b.cartValue - a.cartValue);
}


/**
 * EXERCISE 7: Cohort Analysis
 * 
 * Group users by their first purchase date and track behavior.
 * This helps understand how different "cohorts" of users behave over time.
 * 
 * Example: "Users who first purchased in January have 40% repeat rate"
 * 
 * THINK ABOUT:
 * - How would you track retention over weeks/months?
 * - What makes a "healthy" cohort vs a concerning one?
 * - How would this inform marketing spend decisions?
 */
export interface UserCohort {
  cohortDate: string; // First purchase date (day granularity)
  userCount: number;
  totalRevenue: number;
  avgRevenuePerUser: number;
  repeatPurchaseRate: number; // % of users with more than one purchase
}

export function analyzeCohorts(events: VideoEvent[]): UserCohort[] {
  // Step 1: Find each user's first purchase date
  const userFirstPurchase: Record<string, { date: string; purchases: number; revenue: number }> = {};

  // Sort events by timestamp to ensure we find the FIRST purchase
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  for (const event of sortedEvents) {
    if (event.type !== 'purchase') continue;

    const userId = event.userId;
    const purchaseDate = event.timestamp.split('T')[0]; // Get just the date part

    if (!userFirstPurchase[userId]) {
      // First purchase for this user
      userFirstPurchase[userId] = {
        date: purchaseDate,
        purchases: 1,
        revenue: event.metadata.totalAmount || 0
      };
    } else {
      // Subsequent purchase - add to totals
      userFirstPurchase[userId].purchases += 1;
      userFirstPurchase[userId].revenue += event.metadata.totalAmount || 0;
    }
  }

  // Step 2: Group users by their cohort (first purchase date)
  const cohortMap: Record<string, { users: string[]; totalRevenue: number; repeatUsers: number }> = {};

  for (const [userId, data] of Object.entries(userFirstPurchase)) {
    const cohortDate = data.date;

    if (!cohortMap[cohortDate]) {
      cohortMap[cohortDate] = { users: [], totalRevenue: 0, repeatUsers: 0 };
    }

    cohortMap[cohortDate].users.push(userId);
    cohortMap[cohortDate].totalRevenue += data.revenue;
    
    if (data.purchases > 1) {
      cohortMap[cohortDate].repeatUsers += 1;
    }
  }

  // Step 3: Transform to output format
  return Object.entries(cohortMap)
    .map(([cohortDate, data]) => ({
      cohortDate,
      userCount: data.users.length,
      totalRevenue: data.totalRevenue,
      avgRevenuePerUser: data.users.length > 0 ? data.totalRevenue / data.users.length : 0,
      repeatPurchaseRate: data.users.length > 0 ? data.repeatUsers / data.users.length : 0
    }))
    .sort((a, b) => a.cohortDate.localeCompare(b.cohortDate));
}


/**
 * EXERCISE 8: Real-time Event Stream Processing (Sliding Window)
 * 
 * Calculate metrics over a sliding time window (e.g., last 5 minutes).
 * This simulates real-time dashboards and alerting systems.
 * 
 * THINK ABOUT:
 * - How would you implement this with actual streaming data?
 * - What's the memory cost of keeping events in a window?
 * - How would you trigger alerts based on thresholds?
 */
export interface WindowMetrics {
  windowStart: string;
  windowEnd: string;
  eventCount: number;
  uniqueUsers: number;
  purchaseCount: number;
  revenue: number;
  eventsPerSecond: number;
}

export function calculateSlidingWindow(
  events: VideoEvent[], 
  windowSizeSeconds: number = 300 // 5 minutes default
): WindowMetrics {
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowSizeSeconds * 1000);

  // Filter events within the window
  const windowEvents = events.filter(e => {
    const eventTime = new Date(e.timestamp);
    return eventTime >= windowStart && eventTime <= now;
  });

  // Calculate metrics
  const uniqueUsers = new Set(windowEvents.map(e => e.userId)).size;
  const purchaseEvents = windowEvents.filter(e => e.type === 'purchase');
  const revenue = purchaseEvents.reduce((sum, e) => sum + (e.metadata.totalAmount || 0), 0);

  return {
    windowStart: windowStart.toISOString(),
    windowEnd: now.toISOString(),
    eventCount: windowEvents.length,
    uniqueUsers,
    purchaseCount: purchaseEvents.length,
    revenue,
    eventsPerSecond: windowEvents.length / windowSizeSeconds
  };
}
