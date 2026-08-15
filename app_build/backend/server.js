// CampusConnect app_build Zero-Dependency Local Node.js HTTP Server
// Uses ONLY built-in Node.js modules: http, fs, path, child_process, url

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

// Explicit route mappings for clean URLs
const routes = {
  '/': 'login.html',
  '/login': 'login.html',
  '/dashboard': 'index.html',
  '/observability': 'observability.html',
  '/executive': 'steering_committee_dashboard.html'
};

// MIME types for static assets
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.csv': 'text/csv',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

/**
 * Sanitizes requested path to block directory traversal attacks (e.g. /../../../etc/passwd)
 */
function sanitizePath(requestPath) {
  try {
    const decoded = decodeURIComponent(requestPath);
    const normalized = path.normalize(decoded);
    
    // Block any attempt to break out of root
    if (normalized.startsWith('..') || normalized.includes('../') || normalized.includes('..\\')) {
      return null;
    }
    return normalized;
  } catch (e) {
    return null;
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = parsedUrl.pathname;

  // Map route nicknames to HTML files
  if (routes[pathname]) {
    pathname = '/' + routes[pathname];
  }

  const safePath = sanitizePath(pathname);

  // Return 403 Forbidden if security check fails
  if (!safePath) {
    res.writeHead(403, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>403 Forbidden</title></head>
      <body style="font-family: system-ui; background: #0f172a; color: #f8fafc; padding: 3rem; text-align: center;">
        <h1 style="color: #ef4444; font-size: 2.5rem;">403 Forbidden</h1>
        <p>Path traversal attempt detected and blocked by CampusConnect Security Engine.</p>
        <a href="/" style="color: #38bdf8; text-decoration: underline;">Return to Home</a>
      </body>
      </html>
    `);
    return;
  }

  const filePath = path.join(FRONTEND_DIR, safePath);

  // Security check to ensure target file is strictly inside FRONTEND_DIR
  if (!filePath.startsWith(FRONTEND_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden: Invalid path scope');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <!DOCTYPE html>
          <html>
          <head><title>404 Page Not Found</title></head>
          <body style="font-family: system-ui; background: #0f172a; color: #f8fafc; padding: 3rem; text-align: center;">
            <h1 style="color: #f59e0b; font-size: 2.5rem;">404 — Page Not Found</h1>
            <p>The requested route or file <code>${pathname}</code> does not exist.</p>
            <a href="/" style="color: #38bdf8; text-decoration: underline;">Return to CampusConnect Login</a>
          </body>
          </html>
        `);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error: ' + err.message);
      }
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log('====================================================');
  console.log(`🎓 CampusConnect MVP Server Listening at: ${url}`);
  console.log(`📂 Serving Frontend Files From: ${FRONTEND_DIR}`);
  console.log('====================================================');

  // Auto-open browser on startup
  const cmd = process.platform === 'darwin' ? 'open' :
              process.platform === 'win32' ? 'start' : 'xdg-open';

  exec(`${cmd} ${url}`, (err) => {
    if (err) {
      console.log(`Auto-open browser notice: Please open ${url} in your browser.`);
    }
  });
});
