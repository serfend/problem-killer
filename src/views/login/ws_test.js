var ws = new WebSocket('ws://localhost:2333/nebula/message')
ws.onmessage = (e) => console.log('ws message', e.data)
ws.onclose = (e) => console.error('ws close', e)
ws.onerror = e => console.error('ws error', e)
function ws_send(title, content) {
  ws.send(JSON.stringify({
    title,
    content
  }))
}

ws.onopen = e => {
  // ws.binaryType = 'arraybuffer'
  console.info('ws connected')
  setInterval(() => {
    ws_send('test', {})
  }, 5000)
}
