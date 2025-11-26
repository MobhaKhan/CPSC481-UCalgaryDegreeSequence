import http from 'node:http'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const PUBLIC_DIR = path.resolve('./public')
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml'
}

const handler = async (req, res) => {
  try {
    const host = req.headers.host ?? 'localhost'
    const url = new URL(req.url, `http://${host}`)
    let pathname = url.pathname
    if (pathname === '/') {
      pathname = '/index.html'
    }

    const filePath = path.join(PUBLIC_DIR, pathname)
    const stats = await fs.stat(filePath).catch(() => null)
    if (!stats) {
      throw new Error('Not found')
    }

    const finalPath = stats.isDirectory() ? path.join(filePath, 'index.html') : filePath
    const data = await fs.readFile(finalPath)
    const ext = path.extname(finalPath)
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] ?? 'application/octet-stream' })
    res.end(data)
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not found')
  }
}

const PORT = Number(process.env.PORT) || 3000
const server = http.createServer(handler)
server.listen(PORT, () => {
  console.log(`Serving classic static site on http://localhost:${PORT}`)
})
