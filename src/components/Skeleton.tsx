import React from "react";
import "./Skeleton.css";

interface SkeletonProps {
  variant?: "text" | "title" | "card" | "circle";
  width?: string;
  height?: string;
  className?: string;
}

export function Skeleton({ variant = "text", width, height, className = "" }: SkeletonProps) {
  const variantClass = `skeleton-${variant}`;
  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return <div className={`skeleton ${variantClass} ${className}`} style={style} />;
}
