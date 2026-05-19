import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * AETHER Design System Components
 * Neo-Operational Intelligence aesthetic with professional polish
 */

interface ThreatIndicatorProps {
  ssi: number; // Sovereign Stability Index (0-1)
  label?: string;
  animated?: boolean;
}

export const ThreatIndicator: React.FC<ThreatIndicatorProps> = ({ 
  ssi, 
  label = 'System Status',
  animated = true 
}) => {
  const getThreatLevel = (index: number) => {
    if (index >= 0.7) return { level: 'OPERATIONAL', color: 'from-emerald-500 to-emerald-600', textColor: 'text-emerald-300' };
    if (index >= 0.5) return { level: 'WARNING', color: 'from-amber-500 to-amber-600', textColor: 'text-amber-300' };
    return { level: 'CRITICAL', color: 'from-red-500 to-red-600', textColor: 'text-red-300' };
  };

  const threat = getThreatLevel(ssi);
  const percentage = Math.round(ssi * 100);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="metric-label">{label}</div>
      <div className={`relative w-40 h-40 rounded-full border-2 border-border flex items-center justify-center ${animated ? 'pulse-threat' : ''}`}
           style={{
             background: `conic-gradient(from 0deg, ${threat.color === 'from-emerald-500 to-emerald-600' ? '#10b981' : threat.color === 'from-amber-500 to-amber-600' ? '#f59e0b' : '#ef4444'} ${percentage}%, rgba(26, 31, 46, 0.4) ${percentage}%)`,
           }}>
        <div className="absolute inset-2 bg-card rounded-full flex flex-col items-center justify-center">
          <div className="metric-value text-2xl">{percentage}%</div>
          <div className={`text-xs font-semibold uppercase tracking-wider ${threat.textColor}`}>
            {threat.level}
          </div>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: 'operational' | 'warning' | 'critical';
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  label, 
  value, 
  unit, 
  status = 'operational',
  icon,
  trend 
}) => {
  const statusClasses = {
    operational: 'border-emerald-500/30 bg-emerald-500/5',
    warning: 'border-amber-500/30 bg-amber-500/5',
    critical: 'border-red-500/30 bg-red-500/5'
  };

  const statusTextClasses = {
    operational: 'text-emerald-300',
    warning: 'text-amber-300',
    critical: 'text-red-300'
  };

  return (
    <div className={`glass-panel glass-panel-hover p-4 border ${statusClasses[status]}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="metric-label">{label}</div>
        {icon && <div className={statusTextClasses[status]}>{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <div className="metric-value">{value}</div>
        {unit && <div className="text-sm text-muted-foreground">{unit}</div>}
      </div>
      {trend && (
        <div className="text-xs text-muted-foreground mt-2">
          {trend === 'up' && '↑ Increasing'}
          {trend === 'down' && '↓ Decreasing'}
          {trend === 'stable' && '→ Stable'}
        </div>
      )}
    </div>
  );
};

interface SectorCardProps {
  name: string;
  status: 'operational' | 'warning' | 'critical';
  sectorId: string;
  metric?: string;
}

export const SectorCard: React.FC<SectorCardProps> = ({ 
  name, 
  status, 
  sectorId,
  metric 
}) => {
  const statusConfig = {
    operational: { badge: 'status-operational', icon: CheckCircle, label: 'OPERATIONAL' },
    warning: { badge: 'status-warning', icon: AlertTriangle, label: 'WARNING' },
    critical: { badge: 'status-critical', icon: AlertCircle, label: 'CRITICAL' }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="glass-panel glass-panel-hover p-6 flex flex-col items-center gap-4 relative">
      <div className="absolute top-3 left-3 text-xs text-muted-foreground font-mono">
        {sectorId}
      </div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
        {name}
      </h3>
      <div className={`status-badge ${config.badge}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </div>
      {metric && (
        <div className="text-xs text-muted-foreground text-center">
          {metric}
        </div>
      )}
    </div>
  );
};

interface AlertBannerProps {
  type: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ 
  type, 
  title, 
  message, 
  action 
}) => {
  const typeConfig = {
    info: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-300', icon: AlertCircle },
    warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-300', icon: AlertTriangle },
    critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-300', icon: AlertCircle }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={`glass-panel border ${config.bg} ${config.border} p-4 flex items-start gap-4`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.text}`} />
      <div className="flex-1">
        <h4 className={`font-semibold mb-1 ${config.text}`}>{title}</h4>
        <p className="text-sm text-foreground/80">{message}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className={`px-3 py-1 text-xs font-semibold rounded border ${config.border} ${config.text} hover:bg-white/5 transition-colors flex-shrink-0`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

interface DataGridProps {
  columns: Array<{ key: string; label: string; width?: string }>;
  data: Array<Record<string, any>>;
}

export const DataGrid: React.FC<DataGridProps> = ({ columns, data }) => {
  return (
    <div className="glass-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left metric-label"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-border/50 hover:bg-white/5 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={`${idx}-${col.key}`}
                    className="px-4 py-3 text-sm text-foreground/80"
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  status?: 'operational' | 'warning' | 'critical';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max = 100, 
  label,
  showPercentage = true,
  status = 'operational'
}) => {
  const percentage = (value / max) * 100;
  
  const statusColors = {
    operational: 'bg-emerald-500',
    warning: 'bg-amber-500',
    critical: 'bg-red-500'
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <div className="metric-label">{label}</div>}
          {showPercentage && <div className="text-xs font-semibold text-accent">{Math.round(percentage)}%</div>}
        </div>
      )}
      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
        <div
          className={`h-full ${statusColors[status]} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default {
  ThreatIndicator,
  MetricCard,
  SectorCard,
  AlertBanner,
  DataGrid,
  ProgressBar
};
