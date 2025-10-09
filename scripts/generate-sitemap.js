/*
  Sitemap generator for CRA projects.
  - Parses `src/App.js` for static <Route path="..." />
  - Fetches dynamic slugs/ids for categories and packages from API
  - Skips wildcard routes
  - Writes `public/sitemap.xml`
*/

const fs = require('fs');
const path = require('path');
const axios = require('axios');
// Load environment variables from .env at project root (if present)
try {
  require('dotenv').config({ path: path.join(process.cwd(), '.env') });
} catch (_) {
  // optional
}

const PROJECT_ROOT = process.cwd();
const APP_FILE = path.join(PROJECT_ROOT, 'src', 'App.js');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'public', 'sitemap.xml');

// Change this to your production site origin
const SITE_ORIGIN = process.env.SITEMAP_SITE_ORIGIN || 'https://mycarbuddy.in';
const API_BASE = process.env.REACT_APP_CARBUDDY_BASE_URL || process.env.CARBUDDY_BASE_URL;
const DEBUG = process.env.SITEMAP_DEBUG === '1' || process.env.SITEMAP_DEBUG === 'true';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function readAppFile() {
  return fs.readFileSync(APP_FILE, 'utf8');
}

function extractRoutes(appJsSource) {
  // Match Route components with path attribute, e.g. <Route exact path="/about" element={<AboutPage />} />
  const routeRegex = /<Route\s+[^>]*path\s*=\s*(["'])(.*?)\1[^>]*>/g;
  const routes = new Set();

  let match;
  while ((match = routeRegex.exec(appJsSource)) !== null) {
    const routePath = match[2].trim();
    if (!routePath) continue;
    // Skip wildcard and parameterized routes
    if (routePath === '*' || routePath.includes(':')) continue;
    // Normalize leading slash
    const normalized = routePath.startsWith('/') ? routePath : `/${routePath}`;
    routes.add(normalized);
  }

  // Ensure root exists if present in file
  return Array.from(routes).sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));
}

async function fetchDynamicPaths() {
  if (!API_BASE) {
    if (DEBUG) {
      console.warn('[sitemap] API_BASE missing. Set REACT_APP_CARBUDDY_BASE_URL or CARBUDDY_BASE_URL');
    }
    return [];
  }

  const dynamicPaths = [];

  try {
    // Categories → /service/:categoryname/:categoryId
    const categoryResp = await axios.get(`https://api.mycarsbuddy.com/api/Category`);
    const categories = Array.isArray(categoryResp.data) ? categoryResp.data : [];

    const activeCategories = categories.filter(c => c.IsActive);
    for (const cat of activeCategories) {
      const nameSlug = slugify(cat.CategoryName);
      const id = cat.CategoryID;
      if (nameSlug && id) {
        dynamicPaths.push(`/service/${nameSlug}/${id}`);
        if (DEBUG) console.log(`[sitemap] Added category: /service/${nameSlug}/${id}`);
      }
    }
  } catch (e) {
    console.warn('Skipping category URLs (API error):', e.message);
  }

  try {
    // Packages → /servicedetails/:packagename/:id
    const pkgResp = await axios.get(`${API_BASE}PlanPackage/GetPlanPackagesByCategoryAndSubCategory`);
    const packages = Array.isArray(pkgResp.data) ? pkgResp.data : [];

    for (const pkg of packages) {
      if (pkg.IsActive && pkg.PackageID && pkg.PackageName) {
        const pkgSlug = slugify(pkg.PackageName);
        dynamicPaths.push(`/servicedetails/${pkgSlug}/${pkg.PackageID}`);
        if (DEBUG) console.log(`[sitemap] Added package: /servicedetails/${pkgSlug}/${pkg.PackageID}`);
      }
    }
  } catch (e) {
    console.warn('Skipping package URLs (API error):', e.message);
  }

  return dynamicPaths;
}


function buildSitemapXml(paths) {
  const lastMod = new Date().toISOString();
  const urls = paths
    .map((p) => {
      const loc = `${SITE_ORIGIN}${p}`;
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastMod}</lastmod>`,
        '    <priority>1.0</priority>',
        '  </url>'
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>'
  ].join('\n');
}

function writeSitemap(xml) {
  fs.writeFileSync(OUTPUT_FILE, xml, 'utf8');
  // eslint-disable-next-line no-console
  console.log(`Sitemap written to ${OUTPUT_FILE}`);
}

async function main() {
  try {
    const appSource = readAppFile();

    // 1. Extract static routes
    const staticPaths = extractRoutes(appSource);

    // 2. Build dynamic routes inline (no extra function)
    const dynamicPaths = [];
    try {
      const categoryResp = await axios.get(`https://api.mycarsbuddy.com/api/Category`);
      if (Array.isArray(categoryResp.data)) {
        categoryResp.data
          .filter(c => c.IsActive)
          .forEach(c => {
            dynamicPaths.push(`/service/${slugify(c.CategoryName)}/${c.CategoryID}`);
          });
      }
    } catch (e) {
      console.warn("⚠️ Failed to fetch categories:", e.message);
    }

    try {
      const pkgResp = await axios.get(`https://api.mycarsbuddy.com/api/PlanPackage/GetPlanPackagesByCategoryAndSubCategory`);
      if (Array.isArray(pkgResp.data)) {
        pkgResp.data
          .filter(p => p.IsActive)
          .forEach(pkg => {
            dynamicPaths.push(`/servicedetails/${slugify(pkg.PackageName)}/${pkg.PackageID}`);
          });
      }
    } catch (e) {
      console.warn("⚠️ Failed to fetch packages:", e.message);
    }

    // 3. Merge static + dynamic
    const allPaths = Array.from(new Set([...staticPaths, ...dynamicPaths]));

    // Debug logs
    if (DEBUG) {
      console.log(`[sitemap] Static URLs: ${staticPaths.length}, Dynamic URLs: ${dynamicPaths.length}, Total: ${allPaths.length}`);
      console.log("[sitemap] Sample dynamic:", dynamicPaths.slice(0, 5));
    }

    if (allPaths.length === 0) {
      throw new Error("No static or dynamic routes found");
    }

    // 4. Build sitemap
    const xml = buildSitemapXml(allPaths);
    writeSitemap(xml);

  } catch (err) {
    console.error("❌ Failed to generate sitemap:", err.message);
    process.exit(1);
  }
}


if (require.main === module) {
  main();
}


