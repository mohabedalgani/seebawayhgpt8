import React, { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
}

export function AnimatedNumber({ value, duration = 2000 }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValue = useRef(0);
  const frameRef = useRef(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (previousValue.current === value) return;

    const startValue = previousValue.current;
    const endValue = value;
    const totalChange = endValue - startValue;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      // Enhanced easing function for smoother animation
      const easeProgress = 1 - Math.pow(1 - progress, 4); // Quartic ease-out
      
      const currentValue = Math.round(startValue + totalChange * easeProgress);
      setDisplayValue(currentValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        previousValue.current = value;
        startTimeRef.current = 0;
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span className="tabular-nums transition-all duration-300">
      {new Intl.NumberFormat('ar-SA').format(displayValue)}
    </span>
  );
}