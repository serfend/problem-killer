from .server import HTTPServer, SimpleServerConfig

server: HTTPServer = None


def stop_server():
    global server
    print('stop previous server...')
    server.server.shutdown()
    server = None

def on_start(is_start: bool, config_server: SimpleServerConfig):
    global server
    print('on_start', is_start, config_server)
    if server and is_start:
        stop_server()
    if is_start:
        server = HTTPServer(directory=config_server.directory,
                            bind=config_server.bind,
                            port=config_server.port)
        server.start()
    else:
        stop_server()
