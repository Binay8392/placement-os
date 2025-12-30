import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const routes = [
  '/',
  '/timer',
  '/habits',
  '/dsa',
  '/aptitude',
  '/placements',
  '/calendar',
  '/analytics',
  '/reflect',
  '/profile',
];

interface SwipeState {
  startX: number;
  startY: number;
  startTime: number;
}

export function useSwipeNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const swipeRef = useRef<SwipeState | null>(null);

  useEffect(() => {
    const minSwipeDistance = 80;
    const maxSwipeTime = 300;
    const maxVerticalMovement = 100;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      swipeRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!swipeRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - swipeRef.current.startX;
      const deltaY = touch.clientY - swipeRef.current.startY;
      const deltaTime = Date.now() - swipeRef.current.startTime;

      // Check if it's a valid horizontal swipe
      if (
        Math.abs(deltaX) > minSwipeDistance &&
        Math.abs(deltaY) < maxVerticalMovement &&
        deltaTime < maxSwipeTime
      ) {
        const currentIndex = routes.indexOf(location.pathname);
        if (currentIndex === -1) return;

        if (deltaX > 0 && currentIndex > 0) {
          // Swipe right - go to previous page
          navigate(routes[currentIndex - 1]);
        } else if (deltaX < 0 && currentIndex < routes.length - 1) {
          // Swipe left - go to next page
          navigate(routes[currentIndex + 1]);
        }
      }

      swipeRef.current = null;
    };

    // Only add listeners on mobile
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [navigate, location.pathname]);
}
