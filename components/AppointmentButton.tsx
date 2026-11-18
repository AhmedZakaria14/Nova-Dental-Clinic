'use client';

import Link from 'next/link';
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

interface AppointmentButtonProps {
  href?: string;
  label?: string;
  highlighted?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function AppointmentButton({
  href = '/appointment',
  label,
  highlighted = false,
  onClick,
  className = '',
}: AppointmentButtonProps) {
  const { dir, t } = useLanguage();
  const text = label ?? t.nav.bookAppointment;
  const ArrowIcon = dir === 'rtl' ? ArrowUpLeft : ArrowUpRight;

  const classes = `dentaire-btn ${
    highlighted ? 'dentaire-btn-highlighted' : ''
  } whitespace-nowrap shrink-0 cursor-pointer ${className}`;

  const content = (
    <>
      <span>{text}</span>
      <span className="dentaire-btn-circle" aria-hidden="true">
        <ArrowIcon className="h-4 w-4" />
      </span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
