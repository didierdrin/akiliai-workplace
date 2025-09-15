import { NextRequest } from 'next/server';

function parseDims(params: { dims?: string[] }) {
  const [w, h] = params.dims || [];
  const width = Math.max(1, Math.min(4096, parseInt(w || '600', 10) || 600));
  const height = Math.max(1, Math.min(4096, parseInt(h || '400', 10) || 400));
  return { width, height };
}

export async function GET(_req: NextRequest, context: any) {
  const { params } = context || {};
  const { width, height } = parseDims(params || {});
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ecfdf5"/>
      <stop offset="100%" stop-color="#d1fae5"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect x="16" y="16" width="${width-32}" height="${height-32}" rx="12" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="6 6"/>
  <g fill="#065f46">
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, ui-sans-serif" font-size="${Math.max(12, Math.min(28, Math.floor(Math.min(width, height) / 12)))}" opacity="0.9">
      ${width}×${height}
    </text>
  </g>
</svg>`;
  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, immutable'
    }
  });
}


