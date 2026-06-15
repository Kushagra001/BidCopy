import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// Image metadata
export const alt = 'BidCopy — Write bids that win'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            color: '#2563eb',
            padding: '20px 40px',
            borderRadius: '20px',
            fontSize: 64,
            fontWeight: 'bold',
            marginBottom: 40,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          }}
        >
          BidCopy
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 'bold',
            textAlign: 'center',
            maxWidth: '800px',
            marginBottom: 20,
          }}
        >
          AI-powered bid proposals for freelancers.
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#94a3b8',
            textAlign: 'center',
          }}
        >
          Write bids that win — in 30 seconds.
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
