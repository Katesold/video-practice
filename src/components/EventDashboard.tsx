import { useState, useMemo } from 'react';
import { videoEvents } from '../data/videoEvents';
import {
  aggregateUserEngagement,
  aggregateProductPerformance,
  aggregateVideoAnalytics,
  buildSessionSummary,
  analyzeFunnel,
  findHighValueUsers,
} from '../exercises/eventAggregator';
import styles from './EventDashboard.module.scss';

type TabType = 'overview' | 'users' | 'products' | 'videos' | 'sessions';

export const EventDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedUserId, setSelectedUserId] = useState<string>('user_001');
  const [selectedProductId, setSelectedProductId] = useState<string>('prod_001');
  const [selectedVideoId, setSelectedVideoId] = useState<string>('vid_fashion_summer');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('session_001');

  // Memoize aggregations for performance
  const funnel = useMemo(() => analyzeFunnel(videoEvents), []);
  const highValueUsers = useMemo(() => findHighValueUsers(videoEvents, 5), []);
  const userEngagement = useMemo(
    () => aggregateUserEngagement(videoEvents, selectedUserId),
    [selectedUserId]
  );
  const productPerf = useMemo(
    () => aggregateProductPerformance(videoEvents, selectedProductId),
    [selectedProductId]
  );
  const videoAnalytics = useMemo(
    () => aggregateVideoAnalytics(videoEvents, selectedVideoId),
    [selectedVideoId]
  );
  const sessionSummary = useMemo(
    () => buildSessionSummary(videoEvents, selectedSessionId),
    [selectedSessionId]
  );

  // Extract unique IDs for dropdowns
  const userIds = useMemo(
    () => [...new Set(videoEvents.map((e) => e.userId))],
    []
  );
  const productIds = useMemo(
    () => [...new Set(videoEvents.filter((e) => e.productId).map((e) => e.productId!))],
    []
  );
  const videoIds = useMemo(
    () => [...new Set(videoEvents.map((e) => e.videoId))],
    []
  );
  const sessionIds = useMemo(
    () => [...new Set(videoEvents.map((e) => e.sessionId))],
    []
  );

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👤' },
    { id: 'products', label: 'Products', icon: '🛍️' },
    { id: 'videos', label: 'Videos', icon: '🎬' },
    { id: 'sessions', label: 'Sessions', icon: '🔄' },
  ];

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Video Events Analytics</h1>
          <p className={styles.subtitle}>
            Event-based data aggregation • {videoEvents.length} events loaded
          </p>
        </div>
        <div className={styles.badge}>Interview Practice</div>
      </header>

      <nav className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      <main className={styles.content}>
        {activeTab === 'overview' && (
          <div className={styles.overview}>
            {/* Funnel Visualization */}
            <section className={styles.card}>
              <h2>Conversion Funnel</h2>
              <div className={styles.funnel}>
                <FunnelStep
                  label="Video Views"
                  value={funnel.videoViews}
                  percentage={100}
                  color="var(--color-view)"
                />
                <FunnelStep
                  label="Product Clicks"
                  value={funnel.productClicks}
                  percentage={funnel.viewToClickRate * 100}
                  color="var(--color-click)"
                />
                <FunnelStep
                  label="Add to Cart"
                  value={funnel.addToCarts}
                  percentage={funnel.clickToCartRate * 100}
                  color="var(--color-cart)"
                />
                <FunnelStep
                  label="Purchases"
                  value={funnel.purchases}
                  percentage={funnel.cartToPurchaseRate * 100}
                  color="var(--color-purchase)"
                />
              </div>
              <div className={styles.funnelStats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Overall Conversion</span>
                  <span className={styles.statValue}>
                    {(funnel.overallConversionRate * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </section>

            {/* High Value Users */}
            <section className={styles.card}>
              <h2>Top Customers</h2>
              <div className={styles.leaderboard}>
                {highValueUsers.map((user, idx) => (
                  <div key={user.userId} className={styles.leaderboardItem}>
                    <span className={styles.rank}>#{idx + 1}</span>
                    <span className={styles.userId}>{user.userId}</span>
                    <span className={styles.spent}>
                      ${user.totalSpent.toFixed(2)}
                    </span>
                    <span className={styles.convRate}>
                      {(user.conversionRate * 100).toFixed(0)}% conv
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Stats */}
            <section className={styles.quickStats}>
              <StatCard
                label="Total Events"
                value={videoEvents.length}
                icon="📈"
              />
              <StatCard
                label="Unique Users"
                value={userIds.length}
                icon="👥"
              />
              <StatCard
                label="Videos"
                value={videoIds.length}
                icon="🎥"
              />
              <StatCard
                label="Products"
                value={productIds.length}
                icon="🏷️"
              />
            </section>
          </div>
        )}

        {activeTab === 'users' && (
          <div className={styles.detailView}>
            <div className={styles.selector}>
              <label>Select User:</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                {userIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.metricsGrid}>
              <MetricCard
                label="Watch Time"
                value={`${userEngagement.totalWatchTime}s`}
                sublabel="Total seconds"
              />
              <MetricCard
                label="Videos Watched"
                value={userEngagement.videosWatched}
                sublabel="Unique videos"
              />
              <MetricCard
                label="Products Clicked"
                value={userEngagement.productsClicked}
                sublabel="Click events"
              />
              <MetricCard
                label="Purchases"
                value={userEngagement.purchaseCount}
                sublabel="Completed orders"
              />
              <MetricCard
                label="Total Spent"
                value={`$${userEngagement.totalSpent.toFixed(2)}`}
                sublabel="Revenue"
              />
              <MetricCard
                label="Conversion Rate"
                value={`${(userEngagement.conversionRate * 100).toFixed(1)}%`}
                sublabel="Purchases / Clicks"
              />
            </div>

            <div className={styles.card}>
              <h3>Sessions</h3>
              <div className={styles.sessionList}>
                {userEngagement.sessions.map((sessionId) => (
                  <span key={sessionId} className={styles.sessionTag}>
                    {sessionId}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className={styles.detailView}>
            <div className={styles.selector}>
              <label>Select Product:</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                {productIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.productHeader}>
              <h2>{productPerf.productName}</h2>
              <span className={styles.categoryBadge}>
                {productPerf.productCategory}
              </span>
            </div>

            <div className={styles.metricsGrid}>
              <MetricCard
                label="Impressions"
                value={productPerf.impressions}
                sublabel="Views + Hovers"
              />
              <MetricCard
                label="Clicks"
                value={productPerf.clicks}
                sublabel="Product clicks"
              />
              <MetricCard
                label="Add to Cart"
                value={productPerf.addToCartCount}
                sublabel="Cart additions"
              />
              <MetricCard
                label="Purchases"
                value={productPerf.purchases}
                sublabel="Completed sales"
              />
              <MetricCard
                label="Revenue"
                value={`$${productPerf.revenue.toFixed(2)}`}
                sublabel="Total revenue"
              />
              <MetricCard
                label="CTR"
                value={`${(productPerf.clickThroughRate * 100).toFixed(1)}%`}
                sublabel="Click-through rate"
              />
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className={styles.detailView}>
            <div className={styles.selector}>
              <label>Select Video:</label>
              <select
                value={selectedVideoId}
                onChange={(e) => setSelectedVideoId(e.target.value)}
              >
                {videoIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.metricsGrid}>
              <MetricCard
                label="Total Views"
                value={videoAnalytics.totalViews}
                sublabel="Play events"
              />
              <MetricCard
                label="Completion Rate"
                value={`${(videoAnalytics.completionRate * 100).toFixed(1)}%`}
                sublabel="Finished watching"
              />
              <MetricCard
                label="Avg Watch Time"
                value={`${videoAnalytics.avgWatchTime.toFixed(0)}s`}
                sublabel="Per viewer"
              />
              <MetricCard
                label="Product Clicks"
                value={videoAnalytics.totalProductClicks}
                sublabel="From this video"
              />
            </div>

            {videoAnalytics.topProducts.length > 0 && (
              <div className={styles.card}>
                <h3>Top Products</h3>
                <div className={styles.topProductsList}>
                  {videoAnalytics.topProducts.map((p, idx) => (
                    <div key={p.productId} className={styles.topProduct}>
                      <span className={styles.rank}>#{idx + 1}</span>
                      <span className={styles.productId}>{p.productId}</span>
                      <span className={styles.clicks}>{p.clicks} clicks</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {videoAnalytics.dropOffPoints.length > 0 && (
              <div className={styles.card}>
                <h3>Drop-off Points</h3>
                <p className={styles.hint}>
                  Timestamps where users paused or skipped
                </p>
                <div className={styles.dropOffList}>
                  {videoAnalytics.dropOffPoints.map((timestamp, idx) => (
                    <span key={idx} className={styles.timestamp}>
                      {Math.floor(timestamp / 60)}:{(timestamp % 60)
                        .toString()
                        .padStart(2, '0')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className={styles.detailView}>
            <div className={styles.selector}>
              <label>Select Session:</label>
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
              >
                {sessionIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.sessionHeader}>
              <div className={styles.sessionMeta}>
                <span className={styles.userId}>{sessionSummary.userId}</span>
                <span
                  className={`${styles.purchaseBadge} ${
                    sessionSummary.purchased ? styles.purchased : ''
                  }`}
                >
                  {sessionSummary.purchased ? '✓ Purchased' : 'No Purchase'}
                </span>
              </div>
            </div>

            <div className={styles.metricsGrid}>
              <MetricCard
                label="Duration"
                value={`${Math.floor(sessionSummary.duration / 60)}:${Math.floor(
                  sessionSummary.duration % 60
                )
                  .toString()
                  .padStart(2, '0')}`}
                sublabel="Session length"
              />
              <MetricCard
                label="Videos"
                value={sessionSummary.videosWatched.length}
                sublabel="Watched"
              />
              <MetricCard
                label="Products"
                value={sessionSummary.productsInteracted.length}
                sublabel="Interacted with"
              />
              <MetricCard
                label="Spent"
                value={`$${sessionSummary.totalSpent.toFixed(2)}`}
                sublabel="This session"
              />
            </div>

            <div className={styles.timelineCard}>
              <h3>Session Timeline</h3>
              <div className={styles.timeline}>
                <div className={styles.timelineItem}>
                  <span className={styles.timelineLabel}>Started</span>
                  <span className={styles.timelineValue}>
                    {new Date(sessionSummary.startTime).toLocaleTimeString()}
                  </span>
                </div>
                <div className={styles.timelineItem}>
                  <span className={styles.timelineLabel}>Ended</span>
                  <span className={styles.timelineValue}>
                    {new Date(sessionSummary.endTime).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {sessionSummary.videosWatched.length > 0 && (
              <div className={styles.card}>
                <h3>Videos Watched</h3>
                <div className={styles.tagList}>
                  {sessionSummary.videosWatched.map((vid) => (
                    <span key={vid} className={styles.videoTag}>
                      {vid}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {sessionSummary.productsInteracted.length > 0 && (
              <div className={styles.card}>
                <h3>Products Viewed</h3>
                <div className={styles.tagList}>
                  {sessionSummary.productsInteracted.map((prod) => (
                    <span key={prod} className={styles.productTag}>
                      {prod}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>
          📚 Open <code>src/exercises/eventAggregator.ts</code> to see the
          aggregation logic
        </p>
        <p>
          📖 Read <code>src/exercises/README.md</code> for interview tips
        </p>
      </footer>
    </div>
  );
};

// Sub-components

const FunnelStep = ({
  label,
  value,
  percentage,
  color,
}: {
  label: string;
  value: number;
  percentage: number;
  color: string;
}) => (
  <div className={styles.funnelStep}>
    <div
      className={styles.funnelBar}
      style={{
        width: `${Math.max(percentage, 10)}%`,
        backgroundColor: color,
      }}
    />
    <div className={styles.funnelLabel}>
      <span className={styles.funnelValue}>{value}</span>
      <span className={styles.funnelText}>{label}</span>
    </div>
  </div>
);

const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: string;
}) => (
  <div className={styles.statCard}>
    <span className={styles.statIcon}>{icon}</span>
    <div className={styles.statContent}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  </div>
);

const MetricCard = ({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: number | string;
  sublabel: string;
}) => (
  <div className={styles.metricCard}>
    <span className={styles.metricValue}>{value}</span>
    <span className={styles.metricLabel}>{label}</span>
    <span className={styles.metricSublabel}>{sublabel}</span>
  </div>
);
