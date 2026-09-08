import React, { useEffect, useRef, useState } from 'react';
import '../styles/pharma-bg-animation.css';
import GlossyIcon, { IconType } from './GlossyIcon';

const icones: IconType[] = ['cross', 'pill', 'mouth', 'inhaler', 'syringe'];
const DUREE_CYCLE_MS = 4000;

const PharmaBackgroundAnimation: React.FC = () => {
  const [etape, setEtape] = useState(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Cycle des paires d'icônes : gauche et droite changent ensemble, toutes les 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setEtape((prev) => (prev + 1) % icones.length);
    }, DUREE_CYCLE_MS);
    return () => clearInterval(interval);
  }, []);

  // Parallax léger qui suit la souris, sans jamais changer l'emplacement de base
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 à 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 à 1
      setParallax({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const iconeGauche = icones[etape];
  const iconeDroite = icones[(etape + 2) % icones.length];

  const AMPLITUDE_PX = 10;

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Halos dégradés flous en fond, ambiance premium */}
      <div
        className="bg-blob absolute top-[10%] left-[15%] w-72 h-72 rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, #86efac, transparent 70%)' }}
      ></div>
      <div
        className="bg-blob absolute bottom-[10%] right-[15%] w-80 h-80 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #4ade80, transparent 70%)', animationDelay: '4s' }}
      ></div>

      {/* Emplacement fixe à GAUCHE — ne bouge jamais de position, seul le contenu change */}
      <div
        className="hidden md:block absolute top-1/2 left-[7%] w-32 h-32 lg:w-36 lg:h-36"
        style={{
          transform: `translateY(-50%) translate(${parallax.x * AMPLITUDE_PX}px, ${parallax.y * AMPLITUDE_PX}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <div className="icon-glow absolute -inset-3 rounded-[32px] bg-primary-400 blur-xl"></div>
        <div key={`gauche-${etape}`} className="icon-badge-cycle relative w-full h-full">
          <GlossyIcon type={iconeGauche} />
        </div>
      </div>

      {/* Emplacement fixe à DROITE — ne bouge jamais de position, seul le contenu change */}
      <div
        className="hidden md:block absolute top-1/2 right-[7%] w-32 h-32 lg:w-36 lg:h-36"
        style={{
          transform: `translateY(-50%) translate(${parallax.x * AMPLITUDE_PX}px, ${parallax.y * AMPLITUDE_PX}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <div className="icon-glow absolute -inset-3 rounded-[32px] bg-primary-400 blur-xl" style={{ animationDelay: '1.5s' }}></div>
        <div key={`droite-${etape}`} className="icon-badge-cycle relative w-full h-full">
          <GlossyIcon type={iconeDroite} />
        </div>
      </div>
    </div>
  );
};

export default PharmaBackgroundAnimation;