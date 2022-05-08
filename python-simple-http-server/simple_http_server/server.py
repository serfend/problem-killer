import http.server
import sys
import threading


class DualStackServer(http.server.ThreadingHTTPServer):
    def server_bind(self):
        # suppress exception when protocol is IPv4
        with http.server.contextlib.suppress(Exception):
            self.socket.setsockopt(
                http.server.socket.IPPROTO_IPV6, http.server.socket.IPV6_V6ONLY, 0)
        return super().server_bind()


class HTTPServer(threading.Thread):
    def __init__(self, directory='.', bind='0.0.0.0', port=8080):
        self.directory = directory
        self.bind = bind
        self.port = port
        super().__init__()

    def run(self):
        print('is running')
        self.main()
        print('complete')

    def main(self):
        self.server = get_server(
            HandlerClass=http.server.partial(
                http.server.SimpleHTTPRequestHandler, directory=self.directory),
            ServerClass=DualStackServer,
            port=self.port,
            bind=self.bind
        )
        try:
            self.server.serve_forever()
        except KeyboardInterrupt:
            print("\nKeyboard interrupt received, exiting.")
            sys.exit(0)


def get_server(HandlerClass=http.server.BaseHTTPRequestHandler,
               ServerClass=http.server.ThreadingHTTPServer,
               protocol="HTTP/1.0", port=8000, bind=None):
    """Test the HTTP request handler class.

    This runs an HTTP server on port 8000 (or the port argument).

    """
    ServerClass.address_family, addr = http.server._get_best_family(bind, port)
    HandlerClass.protocol_version = protocol
    httpd = ServerClass(addr, HandlerClass)
    host, port = httpd.socket.getsockname()[:2]
    url_host = f'[{host}]' if ':' in host else host
    print(
        f"Serving HTTP on {host} port {port} "
        f"(http://{url_host}:{port}/) ..."
    )

    return httpd


class SimpleServerConfig:
    directory: str = None
    bind: str = None
    port: int = None

    def __init__(self, directory: str, bind: str, port: int):
        self.directory = directory
        self.bind = bind
        self.port = port

    def __str__(self) -> str:
        return f'{self.directory} -> [{self.bind}:{self.port}]'
