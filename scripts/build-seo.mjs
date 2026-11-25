import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';

const siteDomain = process.env.SITE_URL?.trim()
  || process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

if (!siteDomain) {
  throw new Error('Set SITE_URL or expose VERCEL_PROJECT_PRODUCTION_URL to build the SEO files.');
}

const siteUrl = new URL(siteDomain.includes('://') ? siteDomain : `https://${siteDomain}`);
if (siteUrl.protocol !== 'https:' || siteUrl.href !== `${siteUrl.origin}/`
    || !/^[a-z0-9.-]+$/.test(siteUrl.hostname)) {
  throw new Error('Use the HTTPS production homepage URL for SITE_URL.');
}

const homepage = siteUrl.href;
const brand = 'Chiara Group';
const description = 'Official website of Chiara Group, an Indonesian business group with units in architecture and interiors, branding, catering, consulting, and lifestyle retail.';
const logoPath = 'assets/chiara-logo.png';
const logoUrl = new URL(logoPath, siteUrl).href;
const organizationId = `${homepage}#organization`;
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${homepage}#website`,
      name: brand,
      alternateName: 'Chiara',
      url: homepage,
      publisher: { '@id': organizationId },
    },
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: brand,
      alternateName: 'Chiara',
      url: homepage,
      description,
      logo: logoUrl,
      email: 'chiarastore21@gmail.com',
    },
  ],
};

const metadata = `<link rel="canonical" href="${homepage}">
<meta property="og:site_name" content="${brand}">
<meta property="og:type" content="website">
<meta property="og:url" content="${homepage}">
<meta property="og:title" content="${brand}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${logoUrl}">
<meta property="og:image:alt" content="Chiara Group logo">
<meta name="twitter:card" content="summary">
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>`;

const robots = `User-agent: *
Allow: /

Sitemap: ${new URL('sitemap.xml', siteUrl).href}
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${homepage}</loc>
  </url>
</urlset>
`;

const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
const googleVerificationFile = 'google276d901ea1f943e4.html';
const source = await readFile(new URL('index.html', root), 'utf8');
const closingHead = /<\/head>/i;
if (!closingHead.test(source)) {
  throw new Error('index.html must contain a closing head tag.');
}

const endOfLine = source.includes('\r\n') ? '\r\n' : '\n';
const html = source.replace(closingHead, (tag) => {
  return metadata.replaceAll('\n', endOfLine) + endOfLine + tag;
});

await mkdir(new URL('assets/', output), { recursive: true });
await Promise.all([
  writeFile(new URL('index.html', output), html),
  writeFile(new URL('robots.txt', output), robots),
  writeFile(new URL('sitemap.xml', output), sitemap),
  copyFile(new URL(logoPath, root), new URL(logoPath, output)),
  copyFile(new URL(googleVerificationFile, root), new URL(googleVerificationFile, output)),
]);

console.log(`Built static site and SEO files for ${homepage}`);
