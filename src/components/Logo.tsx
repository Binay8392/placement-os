import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showTagline = false, className }: LogoProps) {
  const sizes = {
    sm: {
      icon: 'w-5 h-5',
      text: 'text-base',
      tagline: 'text-[10px]',
    },
    md: {
      icon: 'w-6 h-6',
      text: 'text-xl',
      tagline: 'text-xs',
    },
    lg: {
      icon: 'w-8 h-8',
      text: 'text-2xl',
      tagline: 'text-sm',
    },
  };

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-center gap-2">
        {/* Minimal geometric icon - abstract "P" mark */}
        <div className={cn(
          'relative flex items-center justify-center rounded-lg bg-primary',
          size === 'sm' && 'w-7 h-7',
          size === 'md' && 'w-8 h-8',
          size === 'lg' && 'w-10 h-10'
        )}>
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className={sizes[size].icon}
          >
            {/* Abstract "P" with progress indicator */}
            <path 
              d="M7 4h6a5 5 0 0 1 0 10H7V4z" 
              stroke="hsl(var(--primary-foreground))" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
            />
            <path 
              d="M7 14v6" 
              stroke="hsl(var(--primary-foreground))" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            {/* Progress dot */}
            <circle 
              cx="17" 
              cy="17" 
              r="3" 
              fill="hsl(var(--primary-foreground))"
              opacity="0.9"
            />
          </svg>
        </div>
        
        {/* Wordmark */}
        <span className={cn(
          'font-semibold tracking-tight text-foreground',
          sizes[size].text
        )}>
          Prep<span className="text-primary">Track</span>
        </span>
      </div>
      
      {showTagline && (
        <p className={cn(
          'text-muted-foreground mt-1 tracking-wide',
          sizes[size].tagline
        )}>
          Personal Placement System
        </p>
      )}
    </div>
  );
}
