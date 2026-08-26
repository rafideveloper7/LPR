'use client'

export default function PixelDecoration({ className = '', size = 'md', variant = 'scattered' }) {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-7 h-7',
  }

  const px = sizes[size] || sizes.md

  if (variant === 'grid') {
    // 4x4 grid with some cells filled
    const pattern = [1,0,1,0, 0,1,0,1, 1,0,0,1, 0,1,1,0]
    return (
      <div className={`grid grid-cols-4 gap-1.5 ${className}`}>
        {pattern.map((active, i) => (
          <div
            key={i}
            className={`${px} rounded-sm transition-all duration-300`}
            style={{
              background: active ? '#1E90FF' : 'transparent',
              opacity: active ? (0.4 + (i % 3) * 0.2) : 0,
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'scattered') {
    const blocks = [
      { top: '0%', left: '60%', w: 40, h: 40, op: 1 },
      { top: '15%', left: '80%', w: 20, h: 20, op: 0.7 },
      { top: '35%', left: '70%', w: 28, h: 28, op: 0.5 },
      { top: '10%', left: '40%', w: 16, h: 16, op: 0.4 },
      { top: '55%', left: '85%', w: 22, h: 22, op: 0.8 },
      { top: '70%', left: '60%', w: 14, h: 14, op: 0.3 },
    ]
    return (
      <div className={`absolute pointer-events-none ${className}`}>
        {blocks.map((b, i) => (
          <div
            key={i}
            className="absolute bg-brand-blue rounded-sm"
            style={{
              top: b.top,
              left: b.left,
              width: b.w,
              height: b.h,
              opacity: b.op,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
    )
  }

  return null
}
