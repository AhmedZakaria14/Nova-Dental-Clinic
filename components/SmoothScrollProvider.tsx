'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { MotionConfig } from 'motion/react';

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      autoRaf: true,
      wheelMultiplier: 1.5,
      touchMultiplier: 1.5,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
