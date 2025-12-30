import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; positive: boolean };
  className?: string;
  variant?: 'default' | 'primary' | 'success';
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon,
  trend,
  className,
  variant = 'default'
}: StatCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl p-4 transition-all duration-200",
      variant === 'default' && "bg-card border border-border",
      variant === 'primary' && "gradient-primary text-primary-foreground",
      variant === 'success' && "gradient-success text-success-foreground",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={cn(
            "text-xs font-medium uppercase tracking-wider",
            variant === 'default' ? "text-muted-foreground" : "opacity-80"
          )}>
            {title}
          </p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className={cn(
              "text-xs",
              variant === 'default' ? "text-muted-foreground" : "opacity-70"
            )}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1 text-xs font-medium",
              trend.positive ? "text-success" : "text-destructive"
            )}>
              <span>{trend.positive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn(
            "p-2 rounded-xl",
            variant === 'default' ? "bg-primary/10 text-primary" : "bg-white/20"
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
