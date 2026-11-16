import React, { useEffect, useRef, useState } from 'react';

interface TimelineAnimateProps {
  children: React.ReactNode;
  mode?: 'vertical' | 'horizontal';
}

export const TimelineAnimate: React.FC<TimelineAnimateProps> = ({
  children,
  mode = 'vertical',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full transition-all duration-1000 ${
        isVisible ? 'timeline-active' : 'timeline-inactive'
      }`}
      style={{
        // Define timeline line draw state
        // When active, CSS can animate the line drawing from 0 to 100%
        contentVisibility: 'auto',
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};
export default TimelineAnimate;
