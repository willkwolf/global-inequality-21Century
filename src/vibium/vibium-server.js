/**
 * src/vibium/vibium-server.js
 * 
 * SERVIDOR LOCAL ESTÁTICO DETERMINISTA PARA VERIFICACIÓN VIBIUM
 * 
 * Provee un servidor HTTP nativo sin dependencias externas para servir la
 * aplicación construida (Escala-visual-de-riqueza-mundial.html) durante las
 * pruebas visuales, funcionales y de accesibilidad de Vibium.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '../../');
const DEFAULT_HTML_PATH = path.resolve(PROJECT_ROOT, 'Escala-visual-de-riqueza-mundial.html');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

export class VibiumLocalServer {
  constructor(port = 8088, customHtmlPath = null) {
    this.port = port;
    this.htmlPath = customHtmlPath || DEFAULT_HTML_PATH;
    this.server = null;
    this.serverUrl = `http://127.0.0.1:${port}`;
  }

  start() {
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        let reqPath = req.url.split('?')[0];
        
        // Si solicita raíz o el HTML principal
        if (reqPath === '/' || reqPath === '/index.html' || reqPath === '/Escala-visual-de-riqueza-mundial.html') {
          if (fs.existsSync(this.htmlPath)) {
            const content = fs.readFileSync(this.htmlPath, 'utf8');
            res.writeHead(200, {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'no-store, no-cache, must-revalidate',
              'Access-Control-Allow-Origin': '*'
            });
            res.end(content);
            return;
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('HTML file not found');
            return;
          }
        }

        // Para cualquier otro recurso relativo en el proyecto
        const filePath = path.join(PROJECT_ROOT, reqPath);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          const mime = MIME_TYPES[ext] || 'application/octet-stream';
          res.writeHead(200, { 'Content-Type': mime, 'Access-Control-Allow-Origin': '*' });
          fs.createReadStream(filePath).pipe(res);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        }
      });

      this.server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          // Si el puerto está ocupado, probar el siguiente puerto
          this.port += 1;
          this.serverUrl = `http://127.0.0.1:${this.port}`;
          this.start().then(resolve).catch(reject);
        } else {
          reject(err);
        }
      });

      this.server.listen(this.port, '127.0.0.1', () => {
        resolve({ port: this.port, url: this.serverUrl });
      });
    });
  }

  stop() {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => resolve(true));
      } else {
        resolve(true);
      }
    });
  }
}
