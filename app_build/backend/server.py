# CampusConnect app_build Zero-Dependency Local Python HTTP Server
# Serves frontend static files and route nicknames on http://localhost:3000

import http.server
import socketserver
import os
import urllib.parse
import webbrowser

PORT = 3000
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))

ROUTES = {
    '/': 'login.html',
    '/login': 'login.html',
    '/dashboard': 'index.html',
    '/observability': 'observability.html',
    '/executive': 'steering_committee_dashboard.html'
}

class CampusConnectHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=FRONTEND_DIR, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        pathname = parsed.path

        # Map route nicknames
        if pathname in ROUTES:
            target = ROUTES[pathname]
            self.path = '/' + target

        # Path sanitization check against directory traversal
        decoded = urllib.parse.unquote(self.path)
        normalized = os.path.normpath(decoded)
        if normalized.startswith('..') or '../' in normalized or '..\\' in normalized:
            self.send_response(403)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(b"<h1>403 Forbidden</h1><p>Path traversal blocked by CampusConnect Security Engine.</p>")
            return

        return super().do_GET()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CampusConnectHandler) as httpd:
        url = f"http://localhost:{PORT}"
        print("====================================================")
        print(f"🎓 CampusConnect MVP Server Listening at: {url}")
        print(f"📂 Serving Frontend Files From: {FRONTEND_DIR}")
        print("====================================================")
        
        try:
            webbrowser.open(url)
        except Exception:
            pass

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down CampusConnect server.")
            httpd.server_close()
