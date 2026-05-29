'use client';

import React from 'react';

interface FlashBorderProps {
  children: React.ReactNode;
  className?: string;
}

export default function FlashBorder({ children, className = '' }: FlashBorderProps) {
  return (
    <div className={`animate-border-pulse rounded-2xl ${className}`}>
      {children}
    </div>
  );
}
