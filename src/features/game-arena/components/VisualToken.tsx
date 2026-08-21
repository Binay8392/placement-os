import type { VisualToken } from '../types';
import { cn } from '@/lib/utils';

const colorValues: Record<VisualToken['color'], string> = {
  primary: 'hsl(var(--primary))',
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  destructive: 'hsl(var(--destructive))',
  sky: 'hsl(199 89% 48%)',
  violet: 'hsl(270 90% 65%)',
  slate: 'hsl(var(--muted-foreground))',
};

const sizeClass = {
  sm: 'h-5 w-5',
  md: 'h-7 w-7',
  lg: 'h-9 w-9',
};

function SingleToken({ token }: { token: VisualToken }) {
  const color = colorValues[token.color];
  const className = cn('shrink-0 transition-transform', sizeClass[token.size || 'md']);
  const style = { transform: `rotate(${token.rotation || 0}deg)` };

  if (token.shape === 'triangle') {
    return (
      <span
        aria-hidden="true"
        className="block h-0 w-0 border-x-[14px] border-b-[24px] border-x-transparent"
        style={{ ...style, borderBottomColor: color }}
      />
    );
  }

  if (token.shape === 'plus') {
    return (
      <span
        aria-hidden="true"
        className="flex h-8 w-8 items-center justify-center text-3xl font-semibold leading-none"
        style={{ ...style, color }}
      >
        +
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        className,
        token.shape === 'circle' && 'rounded-full',
        token.shape === 'square' && 'rounded-[5px]',
        token.shape === 'diamond' && 'rounded-[5px]',
        token.shape === 'hexagon' && 'rounded-[7px]',
        token.shape === 'bar' && 'h-2 rounded-full',
      )}
      style={{
        ...style,
        backgroundColor: color,
        clipPath: token.shape === 'hexagon' ? 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0 50%)' : undefined,
        transform: `${style.transform} ${token.shape === 'diamond' ? 'rotate(45deg)' : ''}`,
      }}
    />
  );
}

export function VisualTokenView({ token, className }: { token: VisualToken; className?: string }) {
  const count = Math.max(1, Math.min(token.count || 1, 4));

  return (
    <span
      className={cn('inline-flex min-h-10 min-w-10 items-center justify-center gap-1 rounded-lg', className)}
      aria-label={token.label || `${token.color} ${token.shape}`}
    >
      {Array.from({ length: count }, (_, index) => (
        <SingleToken key={index} token={{ ...token, size: count > 2 ? 'sm' : token.size || 'md' }} />
      ))}
    </span>
  );
}
