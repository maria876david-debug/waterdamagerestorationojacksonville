import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// 301 Redirect Rules
const explicitRedirects = {
  // 1. Duplicate content: flood-damage-cleanup -> flood-damage-restoration/
  '/services/flood-damage-cleanup': '/services/flood-damage-restoration/',
  '/services/flood-damage-cleanup/': '/services/flood-damage-restoration/',
  '/services/flood-damage-cleanup.html': '/services/flood-damage-restoration/',

  // 2. Duplicate neighborhood pages -> /service-areas/...
  '/locations/water-damage-restoration-in-san-marco': '/service-areas/san-marco/',
  '/locations/water-damage-restoration-in-san-marco/': '/service-areas/san-marco/',
  '/locations/water-damage-restoration-in-san-marco.html': '/service-areas/san-marco/',

  '/locations/water-damage-restoration-in-riverside': '/service-areas/riverside/',
  '/locations/water-damage-restoration-in-riverside/': '/service-areas/riverside/',
  '/locations/water-damage-restoration-in-riverside.html': '/service-areas/riverside/',

  // 3. Off-topic page removed -> homepage
  '/services/fire-damage-restoration': '/',
  '/services/fire-damage-restoration/': '/',
  '/services/fire-damage-restoration.html': '/',

  // Root file alias
  '/index.html': '/'
};

app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();

  const reqPath = req.path;

  // 1. Check explicit redirect map first
  if (explicitRedirects[reqPath]) {
    return res.redirect(301, explicitRedirects[reqPath]);
  }

  // 2. Handle requests ending with .html (redirect to canonical trailing-slash URL)
  if (reqPath.endsWith('.html')) {
    const clean = reqPath.slice(0, -5); // remove .html
    if (clean === '/index') {
      return res.redirect(301, '/');
    }
    // Check if the clean path was in explicitRedirects
    if (explicitRedirects[clean] || explicitRedirects[clean + '/']) {
      return res.redirect(301, explicitRedirects[clean] || explicitRedirects[clean + '/']);
    }
    return res.redirect(301, clean + '/');
  }

  // 3. Pass through static files with extensions (.svg, .png, .jpg, .css, .js, .xml, .txt, .json, .ico, etc.)
  if (path.extname(reqPath)) {
    return next();
  }

  // 4. Trailing slash consistency:
  // If the path does NOT end with a trailing slash, 301 redirect to trailing slash
  if (!reqPath.endsWith('/')) {
    const query = req._parsedUrl.search || '';
    return res.redirect(301, reqPath + '/' + query);
  }

  // 5. Serving files for paths ending with '/'
  if (reqPath === '/') {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }

  // Check if directory has an index.html (e.g. /about/ -> /about/index.html)
  const dirIndex = path.join(__dirname, reqPath, 'index.html');
  if (fs.existsSync(dirIndex)) {
    return res.sendFile(dirIndex);
  }

  // Fallback: check if root has matching .html file (e.g. /about/ -> /about.html)
  const trimmed = reqPath.replace(/\/+$/, '');
  const flatHtml = path.join(__dirname, `${trimmed}.html`);
  if (fs.existsSync(flatHtml)) {
    return res.sendFile(flatHtml);
  }

  next();
});

// Serve static assets from project root
app.use(express.static(__dirname));

// 404 Fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
