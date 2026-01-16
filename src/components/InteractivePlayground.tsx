import { useState, useCallback } from 'react';
import type { VideoEvent } from '../types/events';
import { VideoPlayer } from './VideoPlayer';
import styles from './InteractivePlayground.module.scss';

// Generate IDs
const generateSessionId = () => `session_${Date.now().toString(36)}`;
const generateUserId = () => `user_demo`;

export const InteractivePlayground = () => {
  const [sessionId] = useState(generateSessionId);
  const [userId] = useState(generateUserId);
  const [events, setEvents] = useState<VideoEvent[]>([]);
  const [filter, setFilter] = useState<string>('all');

  // Handle new events from the video player
  const handleEvent = useCallback((event: VideoEvent) => {
    setEvents((prev) => [event, ...prev].slice(0, 100)); // Keep last 100 events
  }, []);

  // Get event type color
  const getEventColor = (type: VideoEvent['type']) => {
    switch (type) {
      case 'video_play':
        return '#58a6ff';
      case 'video_pause':
        return '#8b949e';
      case 'video_complete':
        return '#3fb950';
      case 'video_seek':
        return '#d29922';
      case 'product_hover':
        return '#a371f7';
      case 'product_click':
        return '#f0883e';
      case 'add_to_cart':
        return '#f85149';
      case 'purchase':
        return '#3fb950';
      default:
        return '#8b949e';
    }
  };

  // Get event icon
  const getEventIcon = (type: VideoEvent['type']) => {
    switch (type) {
      case 'video_play':
        return '▶️';
      case 'video_pause':
        return '⏸️';
      case 'video_complete':
        return '✅';
      case 'video_seek':
        return '⏭️';
      case 'product_hover':
        return '👆';
      case 'product_click':
        return '🖱️';
      case 'add_to_cart':
        return '🛒';
      case 'purchase':
        return '💳';
      default:
        return '📌';
    }
  };

  // Filter events
  const filteredEvents =
    filter === 'all'
      ? events
      : events.filter((e) => {
          if (filter === 'video') {
            return ['video_play', 'video_pause', 'video_complete', 'video_seek'].includes(
              e.type
            );
          }
          if (filter === 'product') {
            return ['product_hover', 'product_click', 'add_to_cart', 'purchase'].includes(
              e.type
            );
          }
          return true;
        });

  // Calculate stats
  const stats = {
    total: events.length,
    videoEvents: events.filter((e) =>
      ['video_play', 'video_pause', 'video_complete', 'video_seek'].includes(e.type)
    ).length,
    productEvents: events.filter((e) =>
      ['product_hover', 'product_click', 'add_to_cart', 'purchase'].includes(e.type)
    ).length,
    purchases: events.filter((e) => e.type === 'purchase').length,
  };

  return (
    <div className={styles.playground}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Interactive Video Playground</h1>
          <p className={styles.subtitle}>
            Generate real events by interacting with the video
          </p>
        </div>
        <div className={styles.sessionInfo}>
          <span className={styles.sessionLabel}>Session:</span>
          <code className={styles.sessionId}>{sessionId}</code>
        </div>
      </header>

      <div className={styles.content}>
        {/* Video Player Section */}
        <section className={styles.videoSection}>
          <VideoPlayer
            onEvent={handleEvent}
            sessionId={sessionId}
            userId={userId}
          />
        </section>

        {/* Event Log Section */}
        <section className={styles.eventSection}>
          <div className={styles.eventHeader}>
            <h2>📋 Live Event Log</h2>
            <div className={styles.stats}>
              <span className={styles.statItem}>
                Total: <strong>{stats.total}</strong>
              </span>
              <span className={styles.statItem}>
                Video: <strong>{stats.videoEvents}</strong>
              </span>
              <span className={styles.statItem}>
                Product: <strong>{stats.productEvents}</strong>
              </span>
              <span className={styles.statItem}>
                Purchases: <strong>{stats.purchases}</strong>
              </span>
            </div>
          </div>

          <div className={styles.filters}>
            <button
              className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
              onClick={() => setFilter('all')}
            >
              All Events
            </button>
            <button
              className={`${styles.filterBtn} ${filter === 'video' ? styles.active : ''}`}
              onClick={() => setFilter('video')}
            >
              Video Events
            </button>
            <button
              className={`${styles.filterBtn} ${filter === 'product' ? styles.active : ''}`}
              onClick={() => setFilter('product')}
            >
              Product Events
            </button>
            {events.length > 0 && (
              <button
                className={styles.clearBtn}
                onClick={() => setEvents([])}
              >
                Clear Log
              </button>
            )}
          </div>

          <div className={styles.eventLog}>
            {filteredEvents.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No events yet. Start interacting with the video!</p>
              </div>
            ) : (
              filteredEvents.map((event, idx) => (
                <div
                  key={event.id}
                  className={styles.eventItem}
                  style={{
                    borderLeftColor: getEventColor(event.type),
                    animationDelay: `${idx * 0.02}s`,
                  }}
                >
                  <div className={styles.eventMain}>
                    <span className={styles.eventIcon}>
                      {getEventIcon(event.type)}
                    </span>
                    <span className={styles.eventType}>{event.type}</span>
                    {event.productId && (
                      <span className={styles.productBadge}>
                        {event.metadata.productName || event.productId}
                      </span>
                    )}
                  </div>
                  <div className={styles.eventDetails}>
                    <span className={styles.timestamp}>
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                    {event.metadata.videoTimestamp !== undefined && (
                      <span className={styles.videoTime}>
                        @{event.metadata.videoTimestamp}s
                      </span>
                    )}
                    {event.metadata.totalAmount && (
                      <span className={styles.amount}>
                        ${event.metadata.totalAmount.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Raw JSON view */}
          {filteredEvents.length > 0 && (
            <details className={styles.rawJson}>
              <summary>View Raw Event JSON</summary>
              <pre>
                {JSON.stringify(filteredEvents[0], null, 2)}
              </pre>
            </details>
          )}
        </section>
      </div>

      <footer className={styles.footer}>
        <p>
          💡 <strong>Tip:</strong> This simulates real event collection in a
          video commerce platform. Watch how different interactions generate
          different event types.
        </p>
      </footer>
    </div>
  );
};
