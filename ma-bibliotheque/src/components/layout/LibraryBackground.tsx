/**
 * LibraryBackground - Fond animé avec éléments de bibliothèque flottants
 * Inspiré du style Five Pathways avec thème librairie
 */

import { useEffect, useState } from 'react'

interface FloatingElement {
  id: number
  type: 'book' | 'page' | 'bookmark'
  style: React.CSSProperties
}

export function LibraryBackground() {
  const [elements, setElements] = useState<FloatingElement[]>([])

  useEffect(() => {
    // Générer les éléments flottants
    const items: FloatingElement[] = []
    const types: ('book' | 'page' | 'bookmark')[] = ['book', 'page', 'bookmark']

    for (let i = 0; i < 15; i++) {
      items.push({
        id: i,
        type: types[i % 3],
        style: {
          position: 'absolute',
          left: `${Math.random() * 90 + 5}%`,
          top: `${Math.random() * 90 + 5}%`,
          animationDelay: `${-Math.random() * 20}s`,
          animationDuration: `${20 + Math.random() * 10}s`,
        },
      })
    }

    setElements(items)
  }, [])

  return (
    <div
      className="library-bg"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Texture papier */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.04,
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(26, 26, 26, 0.05) 3px,
            rgba(26, 26, 26, 0.05) 6px
          )`,
        }}
      />

      {/* Éléments flottants */}
      {elements.map((el) => (
        <div
          key={el.id}
          style={{
            ...el.style,
            animation: `floatGentle ${el.style.animationDuration} ease-in-out infinite`,
            animationDelay: el.style.animationDelay as string,
          }}
        >
          {el.type === 'book' && <FloatingBook />}
          {el.type === 'page' && <FloatingPage />}
          {el.type === 'bookmark' && <FloatingBookmark />}
        </div>
      ))}

      {/* Keyframes via style tag */}
      <style>{`
        @keyframes floatGentle {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(3deg);
          }
          50% {
            transform: translateY(-10px) rotate(-2deg);
          }
          75% {
            transform: translateY(-25px) rotate(2deg);
          }
        }
      `}</style>
    </div>
  )
}

function FloatingBook() {
  return (
    <div
      style={{
        width: 28,
        height: 36,
        border: '2px solid #1a1a1a',
        borderRadius: '2px 5px 5px 2px',
        background: 'linear-gradient(90deg, #FEE3D9 4px, #FFFAF5 4px)',
        opacity: 0.2,
        position: 'relative',
      }}
    >
      {/* Lignes de texte */}
      <div
        style={{
          position: 'absolute',
          left: 7,
          top: 8,
          width: 14,
          height: 2,
          background: '#1a1a1a',
          opacity: 0.3,
          boxShadow: '0 6px 0 #1a1a1a, 0 12px 0 #1a1a1a',
        }}
      />
    </div>
  )
}

function FloatingPage() {
  return (
    <div
      style={{
        width: 22,
        height: 28,
        border: '1.5px solid #1a1a1a',
        borderRadius: 2,
        background: '#FFFAF5',
        opacity: 0.15,
        position: 'relative',
      }}
    >
      {/* Lignes */}
      <div
        style={{
          position: 'absolute',
          left: 4,
          top: 5,
          width: 12,
          height: 1.5,
          background: '#1a1a1a',
          opacity: 0.25,
          boxShadow: '0 5px 0 #1a1a1a, 0 10px 0 #1a1a1a, 0 15px 0 #1a1a1a',
        }}
      />
    </div>
  )
}

function FloatingBookmark() {
  return (
    <div
      style={{
        width: 10,
        height: 32,
        background: '#63CFBF',
        border: '1.5px solid #1a1a1a',
        clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)',
        opacity: 0.2,
      }}
    />
  )
}
