import React, { useEffect, useState, useRef } from 'react';

interface CountUpProps {
  value: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({ value, className }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    // Identify availability label e.g., 24/7
    const isAvailabilityLabel = value.includes('/');
    if (isAvailabilityLabel) {
      setDisplayValue(value);
      return;
    }

    // Parse float/int value
    const match = value.match(/([\d.]+)/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const targetNumber = parseFloat(match[1]);
    const suffix = value.replace(match[1], '');

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTimestamp: number | null = null;
          const duration = 1200; // 1.2s duration (fits 900-1600ms requirement)

          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Ease-out cubic formula
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = easeProgress * targetNumber;

            // Formatter logic
            let formatted = '';
            if (value.includes('.')) {
              const decimals = value.split('.')[1].replace(/[^\d]/g, '').length;
              formatted = current.toFixed(decimals);
            } else {
              formatted = Math.floor(current).toString();
            }

            setDisplayValue(`${formatted}${suffix}`);

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setDisplayValue(value);
            }
          };

          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [value, hasAnimated]);

  const isAvailabilityLabel = value.includes('/');

  return (
    <span
      ref={elementRef}
      className={`${className} ${
        isAvailabilityLabel ? 'inline-block animate-pulse duration-1000' : ''
      }`}
    >
      {displayValue}
    </span>
  );
};
