import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center font-medium rounded-full';

    const variantClasses = {
      default: 'bg-gray-100 text-gray-800',
      primary: 'bg-primary-100 text-primary-800',
      success: 'bg-success-100 text-success-800',
      warning: 'bg-warning-100 text-warning-800',
      danger: 'bg-danger-100 text-danger-800',
      info: 'bg-blue-100 text-blue-800',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-base',
    };

    return (
      <span
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// KPI用の特別なバッジコンポーネント
export interface KPIBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  kpiType: 'finalDisposalRate' | 'recyclingRate' | 'sortingRate';
  size?: 'sm' | 'md' | 'lg';
}

export const KPIBadge = React.forwardRef<HTMLSpanElement, KPIBadgeProps>(
  ({ className, value, kpiType, size = 'md', ...props }, ref) => {
    const getVariant = () => {
      const thresholds = {
        finalDisposalRate: { excellent: 2.0, good: 3.0, average: 5.0, poor: 7.0 },
        recyclingRate: { excellent: 95.0, good: 90.0, average: 85.0, poor: 80.0 },
        sortingRate: { excellent: 95.0, good: 90.0, average: 80.0, poor: 70.0 },
      };

      const threshold = thresholds[kpiType];

      if (kpiType === 'finalDisposalRate') {
        if (value <= threshold.excellent) return 'success';
        if (value <= threshold.good) return 'success';
        if (value <= threshold.average) return 'warning';
        if (value <= threshold.poor) return 'warning';
        return 'danger';
      } else {
        if (value >= threshold.excellent) return 'success';
        if (value >= threshold.good) return 'success';
        if (value >= threshold.average) return 'warning';
        if (value >= threshold.poor) return 'warning';
        return 'danger';
      }
    };

    return (
      <Badge
        ref={ref}
        variant={getVariant()}
        size={size}
        className={className}
        {...props}
      >
        {value.toFixed(1)}%
      </Badge>
    );
  }
);

KPIBadge.displayName = 'KPIBadge';

// ステータス用バッジ
export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: 'active' | 'completed' | 'suspended' | 'open' | 'in_progress' | 'resolved';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, size = 'md', ...props }, ref) => {
    const statusConfig = {
      active: { variant: 'success' as const, label: '進行中' },
      completed: { variant: 'default' as const, label: '完了' },
      suspended: { variant: 'warning' as const, label: '一時停止' },
      open: { variant: 'danger' as const, label: '未対応' },
      in_progress: { variant: 'warning' as const, label: '対応中' },
      resolved: { variant: 'success' as const, label: '解決済' },
    };

    const config = statusConfig[status];

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        size={size}
        className={className}
        {...props}
      >
        {config.label}
      </Badge>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';