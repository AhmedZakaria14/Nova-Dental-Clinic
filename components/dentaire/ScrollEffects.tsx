'use client';

import { motion } from 'motion/react';
import { useLanguage } from '@/components/LanguageProvider';

const VIEWPORT_ONCE = { once: true, amount: 0.12 } as const;
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export function FadeInUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 0.65, delay, ease: EASE_OUT_EXPO }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Mirrors Dentaire's GSAP `.reveal` + `.image-anime` curtain unveil:
 * outer frame sweeps open via clipPath while the inner image glides into place.
 * IntersectionObserver watches the unshifted outer wrapper so it always triggers reliably.
 */
export function CurtainImageReveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { dir } = useLanguage();
  const hiddenClip =
    dir === 'rtl' ? 'inset(0 0% 0 100%)' : 'inset(0 100% 0 0%)';
  const innerOffset = dir === 'rtl' ? -36 : 36;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      className={`overflow-hidden ${className}`}
    >
      <motion.div
        variants={{
          hidden: { clipPath: hiddenClip, opacity: 0.4 },
          visible: {
            clipPath: 'inset(0 0% 0 0%)',
            opacity: 1,
            transition: { duration: 0.85, delay, ease: [0.25, 1, 0.5, 1] },
          },
        }}
        className="dentaire-image-anime w-full overflow-hidden rounded-[inherit]"
      >
        <motion.div
          variants={{
            hidden: { x: innerOffset, scale: 1.07 },
            visible: {
              x: 0,
              scale: 1,
              transition: { duration: 0.85, delay, ease: [0.25, 1, 0.5, 1] },
            },
          }}
          className="relative w-full"
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Mirrors Dentaire's `.text-anime-style-2` staggered horizontal word reveal.
 * Splits by whole words (preserving Arabic cursive ligatures and RTL word flow).
 */
export function SplitHeadingReveal({
  prefix,
  accent,
  className = '',
  accentClassName = 'text-[#D4AF37]',
}: {
  prefix: string;
  accent?: string;
  className?: string;
  accentClassName?: string;
}) {
  const { dir } = useLanguage();
  const slideFrom = dir === 'rtl' ? -18 : 18;

  const prefixWords = prefix.trim().split(/\s+/).filter(Boolean);
  const accentWords = accent ? accent.trim().split(/\s+/).filter(Boolean) : [];

  return (
    <motion.h2
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      className={className}
    >
      {prefixWords.map((word, idx) => (
        <motion.span
          key={`p-${idx}-${word}`}
          variants={{
            hidden: { opacity: 0, x: slideFrom },
            visible: {
              opacity: 1,
              x: 0,
              transition: {
                duration: 0.55,
                delay: idx * 0.045,
                ease: EASE_OUT_EXPO,
              },
            },
          }}
          className="inline-block"
        >
          {word}
          {idx < prefixWords.length - 1 || accentWords.length > 0 ? '\u00A0' : ''}
        </motion.span>
      ))}
      {accentWords.map((word, idx) => (
        <motion.span
          key={`a-${idx}-${word}`}
          variants={{
            hidden: { opacity: 0, x: slideFrom },
            visible: {
              opacity: 1,
              x: 0,
              transition: {
                duration: 0.55,
                delay: (prefixWords.length + idx) * 0.045,
                ease: EASE_OUT_EXPO,
              },
            },
          }}
          className={`inline-block ${accentClassName}`}
        >
          {word}
          {idx < accentWords.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </motion.h2>
  );
}
