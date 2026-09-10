import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Middleware to handle clean URLs and trailing slashes for .html files
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  
  let cleanPath = req.path.replace(/\/+$/, ''); // Remove trailing slash
  if (!cleanPath) cleanPath = '/index';

  // If path already has an extension, pass through
  if (path.extname(cleanPath)) return next();

  const filePath = path.join(__dirname, `${cleanPath}.html`);
  res.sendFile(filePath, (err) => {
    if (err) {
      // Check if it matches a directory index.html
      const dirIndex = path.join(__dirname, cleanPath, 'index.html');
      res.sendFile(dirIndex, (err2) => {
        if (err2) return next();
      });
    }
  });
});

// Serve static files from the project directory with .html extension resolution
app.use(express.static(__dirname, {
  extensions: ['html', 'htm']
}));

// Fallback for not found routes to index.html
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
