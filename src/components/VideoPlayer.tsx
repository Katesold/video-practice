import { useState, useRef, useCallback, useEffect } from 'react';
import type { VideoEvent, EventType } from '../types/events';
import styles from './VideoPlayer.module.scss';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  // Position as percentage of video dimensions
  position: { x: number; y: number };
  // When this product appears in the video (seconds)
  appearAt: number;
  disappearAt: number;
}

interface VideoPlayerProps {
  onEvent: (event: VideoEvent) => void;
  sessionId: string;
  userId: string;
}

// Products that appear at different times in the video
const PRODUCTS: Product[] = [
  {
    id: 'prod_101',
    name: 'Minimalist Watch',
    price: 189.99,
    category: 'Accessories',
    position: { x: 20, y: 30 },
    appearAt: 2,
    disappearAt: 15,
  },
  {
    id: 'prod_102',
    name: 'Canvas Sneakers',
    price: 79.99,
    category: 'Footwear',
    position: { x: 70, y: 65 },
    appearAt: 5,
    disappearAt: 20,
  },
  {
    id: 'prod_103',
    name: 'Leather Backpack',
    price: 149.99,
    category: 'Bags',
    position: { x: 45, y: 40 },
    appearAt: 10,
    disappearAt: 25,
  },
  {
    id: 'prod_104',
    name: 'Sunglasses',
    price: 59.99,
    category: 'Accessories',
    position: { x: 30, y: 20 },
    appearAt: 18,
    disappearAt: 30,
  },
];

const VIDEO_ID = 'vid_interactive_demo';

export const VideoPlayer = ({ onEvent, sessionId, userId }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [clickedProduct, setClickedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Product[]>([]);

  // Generate a unique event ID
  const generateEventId = () => Math.random().toString(36).substring(2, 9);

  // Create and emit an event
  const emitEvent = useCallback(
    (type: EventType, product?: Product, extraMetadata?: Record<string, unknown>) => {
      const event: VideoEvent = {
        id: generateEventId(),
        type,
        timestamp: new Date().toISOString(),
        userId,
        sessionId,
        videoId: VIDEO_ID,
        productId: product?.id,
        metadata: {
          videoTimestamp: Math.floor(currentTime),
          videoDuration: Math.floor(duration),
          deviceType: 'desktop',
          productPrice: product?.price,
          productName: product?.name,
          productCategory: product?.category,
          ...extraMetadata,
        },
      };
      onEvent(event);
    },
    [currentTime, duration, userId, sessionId, onEvent]
  );

  // Update visible products based on current time
  useEffect(() => {
    const visible = PRODUCTS.filter(
      (p) => currentTime >= p.appearAt && currentTime <= p.disappearAt
    );
    setTimeout(() => {
      setVisibleProducts(visible);
    }, 0);
  }, [currentTime]);

  // Handle video time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Handle video metadata loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Handle play
  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      emitEvent('video_play');
    }
  };

  // Handle pause
  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      emitEvent('video_pause');
    }
  };

  // Handle video ended
  const handleEnded = () => {
    setIsPlaying(false);
    emitEvent('video_complete');
  };

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      emitEvent('video_seek');
    }
  };

  // Handle product hover
  const handleProductHover = (product: Product) => {
    setHoveredProduct(product.id);
    emitEvent('product_hover', product);
  };

  // Handle product click
  const handleProductClick = (product: Product) => {
    emitEvent('product_click', product);
    setClickedProduct(product);
    // Pause video when product is clicked
    if (videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
    emitEvent('add_to_cart', product, { quantity: 1 });
    setClickedProduct(null);
  };

  // Handle purchase
  const handlePurchase = () => {
    const total = cart.reduce((sum, p) => sum + p.price, 0);
    cart.forEach((product) => {
      emitEvent('purchase', product, {
        quantity: 1,
        totalAmount: product.price,
      });
    });
    setCart([]);
    alert(`Purchase complete! Total: $${total.toFixed(2)}`);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.videoPlayer}>
      <div className={styles.videoContainer}>
        {/* Video element with placeholder/demo video */}
        <video
          ref={videoRef}
          className={styles.video}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          poster="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
        >
          {/* Using a free stock video - Big Buck Bunny is a common test video */}
          <source
            src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Product hotspots overlay */}
        <div className={styles.productOverlay}>
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              className={`${styles.productHotspot} ${
                hoveredProduct === product.id ? styles.hovered : ''
              }`}
              style={{
                left: `${product.position.x}%`,
                top: `${product.position.y}%`,
              }}
              onMouseEnter={() => handleProductHover(product)}
              onMouseLeave={() => setHoveredProduct(null)}
              onClick={() => handleProductClick(product)}
            >
              <div className={styles.hotspotPulse} />
              <div className={styles.hotspotDot} />
              {hoveredProduct === product.id && (
                <div className={styles.productTooltip}>
                  <span className={styles.productName}>{product.name}</span>
                  <span className={styles.productPrice}>
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Play overlay when paused */}
        {!isPlaying && currentTime === 0 && (
          <div className={styles.playOverlay} onClick={handlePlay}>
            <div className={styles.playButton}>▶</div>
            <p>Click to play</p>
          </div>
        )}
      </div>

      {/* Video controls */}
      <div className={styles.controls}>
        <button
          className={styles.playPauseBtn}
          onClick={isPlaying ? handlePause : handlePlay}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <span className={styles.time}>{formatTime(currentTime)}</span>
        <input
          type="range"
          className={styles.seekBar}
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
        />
        <span className={styles.time}>{formatTime(duration)}</span>
      </div>

      {/* Product detail modal */}
      {clickedProduct && (
        <div className={styles.modalOverlay} onClick={() => setClickedProduct(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={() => setClickedProduct(null)}
            >
              ×
            </button>
            <div className={styles.modalContent}>
              <div className={styles.productImage}>
                <span className={styles.productEmoji}>
                  {clickedProduct.category === 'Accessories' && '⌚'}
                  {clickedProduct.category === 'Footwear' && '👟'}
                  {clickedProduct.category === 'Bags' && '🎒'}
                </span>
              </div>
              <h3>{clickedProduct.name}</h3>
              <p className={styles.category}>{clickedProduct.category}</p>
              <p className={styles.price}>${clickedProduct.price.toFixed(2)}</p>
              <button
                className={styles.addToCartBtn}
                onClick={() => handleAddToCart(clickedProduct)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart sidebar */}
      {cart.length > 0 && (
        <div className={styles.cartSidebar}>
          <h4>🛒 Cart ({cart.length})</h4>
          <div className={styles.cartItems}>
            {cart.map((item, idx) => (
              <div key={idx} className={styles.cartItem}>
                <span>{item.name}</span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className={styles.cartTotal}>
            <span>Total:</span>
            <span>${cart.reduce((s, p) => s + p.price, 0).toFixed(2)}</span>
          </div>
          <button className={styles.checkoutBtn} onClick={handlePurchase}>
            Complete Purchase
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className={styles.instructions}>
        <h4>🎯 Interactive Demo</h4>
        <ul>
          <li>Play the video to see products appear</li>
          <li>Hover over the pulsing dots to see product info</li>
          <li>Click a product to view details and add to cart</li>
          <li>Complete a purchase to generate all event types</li>
        </ul>
      </div>
    </div>
  );
};
