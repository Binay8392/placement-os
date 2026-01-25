import { cn } from '@/lib/utils';
import preptrackLogo from '@/assets/preptrack-logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ size = 'md', showTagline = false, className, iconOnly = false }: LogoProps) {
  const sizes = {
    sm: {
      container: 'h-8',
      tagline: 'text-[10px]',
    },
    md: {
      container: 'h-10',
      tagline: 'text-xs',
    },
    lg: {
      container: 'h-14',
      tagline: 'text-sm',
    },
  };

  if (iconOnly) {
    return (
      <img 
        src={preptrackLogo} 
        alt="PrepTrack OS" 
        className={cn(
          'object-contain',
          size === 'sm' && 'h-8 w-8',
          size === 'md' && 'h-10 w-10',
          size === 'lg' && 'h-14 w-14',
          className
        )}
      />
    );
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <img 
        src={preptrackLogo} 
        alt="PrepTrack OS" 
        className={cn(
          'object-contain object-left',
          sizes[size].container
        )}
      />
      
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
