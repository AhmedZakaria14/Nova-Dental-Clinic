import { ImageResponse } from 'next/og';
import fs from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';
export const alt =
  'NOVA Dental Clinic — Luxury Cosmetic Dentistry, Implants & Smile Design in Cairo';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

function loadLogoDataUri(): string | null {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'assets', 'nova-logo-hd.png');
    const buffer = fs.readFileSync(logoPath);
    return `data:image/png;base64,${buffer.toString('base64')}`;
  } catch {
    return null;
  }
}

export default function OpenGraphImage() {
  const logoSrc = loadLogoDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'radial-gradient(circle at 82% 20%, rgba(212, 175, 55, 0.22), transparent 52%), linear-gradient(135deg, #080808 0%, #14120D 55%, #0A0908 100%)',
          padding: '56px 68px',
          border: '2px solid rgba(212, 175, 55, 0.35)',
          color: '#F7F3E9',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {logoSrc && (
              <img
                src={logoSrc}
                alt="NOVA Dental Clinic"
                width={92}
                height={92}
                style={{
                  borderRadius: '20px',
                  border: '1px solid rgba(212, 175, 55, 0.45)',
                  background: '#080808',
                  objectFit: 'contain',
                  padding: '8px',
                }}
              />
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '34px',
                  fontWeight: 800,
                  color: '#E6C76A',
                  letterSpacing: '0.04em',
                }}
              >
                NOVA DENTAL CLINIC
              </span>
              <span
                style={{
                  fontSize: '18px',
                  color: '#C8BFA8',
                  marginTop: '4px',
                }}
              >
                Fifth Settlement (Ozone Medical Center) • Nasr City, Cairo
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              padding: '10px 22px',
              borderRadius: '999px',
              border: '1px solid rgba(212, 175, 55, 0.45)',
              background: 'rgba(212, 175, 55, 0.14)',
              color: '#E6C76A',
              fontSize: '18px',
              fontWeight: 700,
            }}
          >
            CAIRO • EGYPT
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: '56px',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#F7F3E9',
            }}
          >
            Digital Smile Design, Veneers & Guided Implants
          </div>
          <div
            style={{
              fontSize: '25px',
              color: '#C8BFA8',
              maxWidth: '940px',
              lineHeight: 1.4,
            }}
          >
            Precision cosmetic & restorative dentistry — Instant online appointment booking for Fifth Settlement and Nasr City.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(212, 175, 55, 0.25)',
            paddingTop: '24px',
            fontSize: '20px',
            color: '#E6C76A',
            fontWeight: 700,
          }}
        >
          <span>+20 10 31235562</span>
          <span>@nova.dental.clinic.eg</span>
          <span>Sat – Thu • 12:00 PM – 9:00 PM</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
