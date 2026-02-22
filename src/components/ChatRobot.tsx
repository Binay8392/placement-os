import { motion } from 'framer-motion';

export function ChatRobot({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Antenna */}
      <motion.g
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: '60px 22px' }}
      >
        <line x1="60" y1="22" x2="60" y2="8" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
        <circle cx="60" cy="6" r="4" fill="hsl(var(--primary))" />
        <motion.circle
          cx="60" cy="6" r="4"
          fill="hsl(var(--primary))"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.g>

      {/* Head */}
      <rect x="30" y="22" width="60" height="40" rx="12" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2.5" />

      {/* Eyes */}
      <motion.g animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}>
        <circle cx="45" cy="40" r="6" fill="hsl(var(--primary))" />
        <circle cx="75" cy="40" r="6" fill="hsl(var(--primary))" />
        <circle cx="47" cy="38" r="2" fill="hsl(var(--primary-foreground))" />
        <circle cx="77" cy="38" r="2" fill="hsl(var(--primary-foreground))" />
      </motion.g>

      {/* Smile */}
      <path d="M 48 50 Q 60 58 72 50" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Body */}
      <rect x="35" y="65" width="50" height="30" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2.5" />
      
      {/* Body detail */}
      <circle cx="60" cy="78" r="5" fill="hsl(var(--primary))" opacity="0.3" />
      <motion.circle
        cx="60" cy="78" r="3"
        fill="hsl(var(--primary))"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Left arm (static) */}
      <motion.g
        animate={{ rotate: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: '35px 70px' }}
      >
        <rect x="15" y="68" width="20" height="8" rx="4" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
        {/* Left hand */}
        <circle cx="15" cy="72" r="5" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
      </motion.g>

      {/* Right arm (waving/shaking hand!) */}
      <motion.g
        animate={{ rotate: [-15, 25, -15, 20, -10, 25, -15] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: '85px 70px' }}
      >
        <rect x="85" y="68" width="20" height="8" rx="4" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
        {/* Hand with fingers */}
        <motion.g style={{ transformOrigin: '108px 72px' }}>
          <circle cx="108" cy="72" r="6" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
          {/* Fingers */}
          <motion.g
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: '108px 72px' }}
          >
            <line x1="112" y1="67" x2="116" y2="64" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="114" y1="70" x2="118" y2="68" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="114" y1="74" x2="118" y2="74" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" />
          </motion.g>
        </motion.g>
      </motion.g>

      {/* Legs */}
      <rect x="42" y="95" width="10" height="14" rx="4" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
      <rect x="68" y="95" width="10" height="14" rx="4" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2" />
      
      {/* Feet */}
      <rect x="38" y="105" width="18" height="6" rx="3" fill="hsl(var(--primary))" opacity="0.6" />
      <rect x="64" y="105" width="18" height="6" rx="3" fill="hsl(var(--primary))" opacity="0.6" />
    </svg>
  );
}
