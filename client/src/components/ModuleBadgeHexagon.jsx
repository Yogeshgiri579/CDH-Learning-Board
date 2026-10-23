import React from 'react';

/**
 * High-performance SVG Hexagonal Shield Badge matching CloudDevOpsHub Curriculum Badges.
 * Optimized with generous internal text padding and dynamic font sizing so text never overflows.
 */
export const ModuleBadgeHexagon = ({
  moduleNumber = '02',
  title = 'LINUX',
  subtitle = 'UBUNTU + GCP',
  brand = 'CloudDevOpsHub',
  isUnlocked = false,
  gradient = { from: '#f04124', to: '#9e1c07' },
  size = 145,
  className = '',
}) => {
  const height = Math.round(size * 1.14);
  const gradId = `badge-grad-${moduleNumber}-${isUnlocked ? 'unlocked' : 'locked'}`;
  const bevelId = `badge-bevel-${moduleNumber}-${isUnlocked ? 'unlocked' : 'locked'}`;

  // Proportional Hexagon Points on 220 x 250 viewBox
  // Top apex at (110, 10), upper corners at (206, 58) & (14, 58)
  const outerPoints = '110,10 206,58 206,192 110,240 14,192 14,58';
  const blackBorderPoints = '110,16 200,61 200,187 110,233 20,187 20,61';
  const innerPoints = '110,22 194,65 194,183 110,227 26,183 26,65';

  // Dynamic Title Font Size & Spacing so long words like FOUNDATIONS or DOCKER never touch borders
  const getTitleFontSize = (t = '') => {
    const len = t.length;
    if (len <= 4) return 24; // AWS, TF
    if (len <= 6) return 21; // LINUX, CI/CD, DOCKER
    if (len <= 8) return 18; // PYTHON, AZURE, CAREER
    return 15.5; // FOUNDATIONS, CAPSTONE
  };

  const titleFontSize = getTitleFontSize(title);
  const titleY = 114;

  // Dynamic Subtitle Font Size
  const subtitleFontSize = subtitle.length > 12 ? 8.5 : 9.5;

  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none transition-transform duration-150 ${isUnlocked ? 'hover:scale-[1.02]' : 'opacity-90'} ${className}`}
      style={{ 
        width: size, 
        height, 
        contain: 'paint layout',
        transform: 'translateZ(0)',
      }}
    >
      <svg
        viewBox="0 0 220 250"
        width={size}
        height={height}
        className="pointer-events-none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Main Face Gradient */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            {isUnlocked ? (
              <>
                <stop offset="0%" stopColor={gradient.from} />
                <stop offset="60%" stopColor={gradient.from} stopOpacity="0.95" />
                <stop offset="100%" stopColor={gradient.to} />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#252a33" />
                <stop offset="50%" stopColor="#1a1e26" />
                <stop offset="100%" stopColor="#101318" />
              </>
            )}
          </linearGradient>

          {/* Bevel highlight */}
          <linearGradient id={bevelId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={isUnlocked ? '0.45' : '0.12'} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {/* 1. Outer Dark Shadow Stroke (Zero filter overhead for silky 60fps scrolling) */}
        <polygon
          points={outerPoints}
          fill="none"
          stroke="rgba(0, 0, 0, 0.55)"
          strokeWidth="7"
          strokeLinejoin="round"
        />

        {/* 2. Crisp White Outer Border */}
        <polygon
          points={outerPoints}
          fill={isUnlocked ? '#ffffff' : '#30363d'}
          stroke={isUnlocked ? '#ffffff' : '#30363d'}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* 3. Black Inset Border Framing the Face (Matching Screenshot 2) */}
        <polygon
          points={blackBorderPoints}
          fill="#06090e"
          stroke="#06090e"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* 4. Inner Shield Face with Gradient */}
        <polygon
          points={innerPoints}
          fill={`url(#${gradId})`}
          stroke={`url(#${bevelId})`}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* 5. Top Tag: MODULE XX (Safely nested deep inside the colored box) */}
        <text
          x="110"
          y="56"
          textAnchor="middle"
          fill={isUnlocked ? '#ffffff' : '#8b949e'}
          fontSize="10"
          fontWeight="800"
          letterSpacing="1.8"
          fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        >
          MODULE {moduleNumber}
        </text>

        {/* 6. Clean Accent Underline */}
        <line
          x1="88"
          y1="64"
          x2="132"
          y2="64"
          stroke={isUnlocked ? '#ffffff' : '#484f58'}
          strokeWidth="1.5"
          opacity={isUnlocked ? '0.85' : '0.4'}
        />

        {/* 7. Primary Title (e.g. FOUNDATIONS, LINUX, AWS, CI/CD, DOCKER) */}
        <text
          x="110"
          y={titleY}
          textAnchor="middle"
          fill={isUnlocked ? '#ffffff' : '#8b949e'}
          fontSize={titleFontSize}
          fontWeight="900"
          letterSpacing="0.8"
          fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        >
          {title}
        </text>

        {/* 8. Subtitle (e.g. & AI, UBUNTU + GCP, SERVICES, GIT & JENKINS) */}
        <text
          x="110"
          y="138"
          textAnchor="middle"
          fill={isUnlocked ? '#ffffff' : '#6e7681'}
          fontSize={subtitleFontSize}
          fontWeight="700"
          letterSpacing="0.9"
          opacity={isUnlocked ? '0.95' : '0.7'}
          fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        >
          {subtitle}
        </text>

        {/* 9. Brand Name: CloudDevOpsHub */}
        <text
          x="110"
          y="166"
          textAnchor="middle"
          fill={isUnlocked ? '#ffffff' : '#6e7681'}
          fontSize="8.5"
          fontWeight="700"
          letterSpacing="1.2"
          opacity={isUnlocked ? '0.9' : '0.6'}
          fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        >
          {brand}
        </text>

        {/* 10. Star Rating Motif / Lock Icon */}
        {isUnlocked ? (
          <g transform="translate(110, 194)">
            {/* Left Dot */}
            <circle cx="-15" cy="0" r="2.2" fill="#ffb703" opacity="0.9" />
            {/* Center Star */}
            <path
              d="M0,-7 L2,-2.2 L7,-1.8 L3.5,2 L4.6,7 L0,4.2 L-4.6,7 L-3.5,2 L-7,-1.8 L-2,-2.2 Z"
              fill="#ffb703"
            />
            {/* Right Dot */}
            <circle cx="15" cy="0" r="2.2" fill="#ffb703" opacity="0.9" />
          </g>
        ) : (
          <g transform="translate(110, 194)">
            {/* Crisp Padlock Icon for locked state */}
            <path
              d="M-5,0 L-5,-3 C-5,-5.5 -3,-7.5 0,-7.5 C3,-7.5 5,-5.5 5,-3 L5,0 L6,0 C6.6,0 7,0.4 7,1 L7,7 C7,7.6 6.6,8 6,8 L-6,8 C-6.6,8 -7,7.6 -7,7 L-7,1 C-7,0.4 -6.6,0 -6,0 Z M-3,0 L3,0 L3,-3 C3,-4.5 1.5,-6 0,-6 C-1.5,-6 -3,-4.5 -3,-3 Z"
              fill="#8b949e"
              opacity="0.85"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
