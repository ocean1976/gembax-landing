// Vercel Function for the existing static HTML site. No external service or API key.
// This is a regional business rule, not a guess about a visitor's native language.
const SPANISH_COUNTRIES = new Set([
  'ES',
  'MX', 'GT', 'BZ', 'SV', 'HN', 'NI', 'CR', 'PA',
  'CU', 'DO', 'HT', 'PR',
  'CO', 'VE', 'GY', 'SR', 'GF', 'EC', 'PE', 'BO',
  'BR', 'PY', 'CL', 'AR', 'UY'
]);

export function GET(request) {
  const country = (request.headers.get('x-vercel-ip-country') || '').trim().toUpperCase();
  const language = country === 'TR' ? 'tr' : SPANISH_COUNTRIES.has(country) ? 'es' : 'en';
  return new Response(JSON.stringify({ language }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'private, no-store, max-age=0',
      'Vercel-CDN-Cache-Control': 'no-store'
    }
  });
}
