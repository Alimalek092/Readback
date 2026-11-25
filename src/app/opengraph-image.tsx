import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'ReadBack — Read less forgetfully. Learn more permanently.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#F8F6F0',
          padding: '64px 72px',
          border: '16px solid #E9E5DC',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#74866B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: 700,
            }}
          >
            R
          </div>
          <span
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#292820',
              letterSpacing: '-0.02em',
            }}
          >
            ReadBack
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontSize: '60px',
              lineHeight: 1.12,
              color: '#292820',
              fontWeight: 600,
              maxWidth: '920px',
            }}
          >
            Don&apos;t just finish books. Remember what they teach you.
          </div>
          <div
            style={{
              fontSize: '26px',
              color: '#6B685F',
              maxWidth: '820px',
              lineHeight: 1.4,
            }}
          >
            Capture book lessons, organize highlights, and retain wisdom permanently with daily spaced repetition.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid #E9E5DC',
            paddingTop: '24px',
            fontSize: '20px',
            color: '#74866B',
            fontWeight: 600,
          }}
        >
          <span>READ → CAPTURE → ORGANIZE → REMEMBER → APPLY</span>
          <span style={{ color: '#858276' }}>Free to start</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
