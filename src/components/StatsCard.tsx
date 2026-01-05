import "./StatsCard.css";

interface Stat {
  label: string;
  value: string;
  icon: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

interface StatsCardProps {
  stats: Stat[];
  isLoading?: boolean;
}

export function StatsCard({ stats, isLoading }: StatsCardProps) {
  return (
    <div className="stats-card">
      <h3 className="stats-title">📊 Vault Statistics</h3>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">
                {isLoading ? (
                  <span className="skeleton">--</span>
                ) : (
                  stat.value
                )}
              </span>
              {stat.change && (
                <span className={`stat-change ${stat.changeType || "neutral"}`}>
                  {stat.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
