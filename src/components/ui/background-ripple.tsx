'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react';

export const BackgroundRipple = ({
  className,
  rows = 10,
  cols = 10,
  cellWidth = 40,
  cellHeight = 40,
}: {
  className?: string;
  rows?: number;
  cols?: number;
  cellWidth?: number;
  cellHeight?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setLastMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn('relative w-full h-full overflow-hidden', className)}
    >
      <div
        className={cn('absolute inset-0 z-0')}
        style={{
          display: 'grid',
          width: '100%',
          height: '100%',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => (
          <Cell
            key={i}
            isHovering={isHovering}
            lastMousePosition={lastMousePosition}
            cellWidth={cellWidth}
            cellHeight={cellHeight}
            rows={rows}
            cols={cols}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-white via-white/80 to-white" />
    </div>
  );
};

const Cell = ({
  isHovering,
  lastMousePosition,
  cellWidth,
  cellHeight,
  rows,
  cols,
}: {
  isHovering: boolean;
  lastMousePosition: { x: number; y: number };
  cellWidth: number;
  cellHeight: number;
  rows: number;
  cols: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [delay, setDelay] = useState(0);

  useEffect(() => {
    setDelay(Math.random() * 200);
  }, []);

  const distanceFromMouse = (x: number, y: number) => {
    if (!ref.current) return 0;
    const rect = ref.current.getBoundingClientRect();
    const cellCenterX = rect.left + rect.width / 2;
    const cellCenterY = rect.top + rect.height / 2;
    const distance = Math.sqrt(
      Math.pow(cellCenterX - x, 2) + Math.pow(cellCenterY - y, 2)
    );
    return distance;
  };

  const ripple = (x: number, y: number) => {
    const distance = distanceFromMouse(x, y);
    const intensity = 1 - Math.min(distance / 400, 1);
    return intensity;
  };
  const intensity = isHovering ? ripple(lastMousePosition.x, lastMousePosition.y) : 0;

  return (
    <div
      ref={ref}
      className={cn(
        'h-full w-full border-l border-t border-neutral-200 transition-colors duration-500'
      )}
      style={
        {
          '--delay': `${delay}ms`,
          '--duration': '200ms',
          backgroundColor: `rgba(240, 240, 240, ${intensity})`,
        } as React.CSSProperties
      }
    />
  );
};
