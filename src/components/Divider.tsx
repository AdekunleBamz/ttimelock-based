interface DividerProps {
  text?: string;
  spacing?: "sm" | "md" | "lg";
}

export function Divider({ text, spacing = "md" }: DividerProps) {
  const spacingMap = { sm: "8px", md: "16px", lg: "24px" };
  const margin = spacingMap[spacing];

  if (text) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: `${margin} 0` }}>
        <div style={{ flex: 1, height: "1px", background: "#2a2a4e" }} />
        <span style={{ color: "#888", fontSize: "0.85rem" }}>{text}</span>
        <div style={{ flex: 1, height: "1px", background: "#2a2a4e" }} />
      </div>
    );
  }

  return <div style={{ height: "1px", background: "#2a2a4e", margin: `${margin} 0` }} />;
}
