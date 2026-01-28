import "./Avatar.css";

interface AvatarProps {
  address?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ address, size = "md" }: AvatarProps) {
  const initials = address ? address.slice(2, 4).toUpperCase() : "??";
  return <div className={`avatar avatar-${size}`}>{initials}</div>;
}
