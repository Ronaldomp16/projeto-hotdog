import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([a-zA-Z]:)/, '$1')
const distDir = join(root, 'dist-whatsapp')
const publicDir = join(root, 'public')
const outFile = join(root, 'Dog Quadradinho - Preview.html')

function toDataUri(filePath, mime) {
  const buf = readFileSync(filePath)
  return `data:${mime};base64,${buf.toString('base64')}`
}

// Imagens/ícones referenciados por caminho absoluto (pasta public/, fora do
// grafo de módulos do Vite, então precisam ser embutidos manualmente).
const publicAssets = [
  { literal: '/favicon.svg', file: 'favicon.svg', mime: 'image/svg+xml' },
  { literal: '/intro-car.png', file: 'intro-car.png', mime: 'image/png' },
  { literal: '/intro-cart.png', file: 'intro-cart.png', mime: 'image/png' },
  { literal: '/logo-transparent.png?v=5', file: 'logo-transparent.png', mime: 'image/png' },
  { literal: '/logo-transparent-cylinder.png?v=1', file: 'logo-transparent-cylinder.png', mime: 'image/png' },
]

let html = readFileSync(join(distDir, 'index.html'), 'utf-8')

const jsFile = html.match(/<script[^>]*src="([^"]+)"[^>]*><\/script>/)?.[1]
const cssFile = html.match(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/)?.[1]

if (!jsFile) throw new Error('Não encontrei o <script src> no dist-whatsapp/index.html')

let js = readFileSync(join(distDir, jsFile.replace(/^\//, '')), 'utf-8')
let css = cssFile ? readFileSync(join(distDir, cssFile.replace(/^\//, '')), 'utf-8') : ''

for (const asset of publicAssets) {
  const dataUri = toDataUri(join(publicDir, asset.file), asset.mime)
  js = js.split(asset.literal).join(dataUri)
  html = html.split(asset.literal).join(dataUri)
}

// Injeta JS e CSS inline e remove as tags externas.
// Usa função de replacer (não string) para evitar que padrões "$&", "$`" etc.
// dentro do bundle minificado (cheio de "$" em nomes de variável) sejam
// interpretados como backreferences do String.replace.
html = html.replace(/<script[^>]*src="[^"]+"[^>]*><\/script>/, () => `<script type="module">\n${js}\n</script>`)
if (cssFile) {
  html = html.replace(/<link[^>]*rel="stylesheet"[^>]*href="[^"]+"[^>]*>/, () => `<style>\n${css}\n</style>`)
}

writeFileSync(outFile, html, 'utf-8')

const sizeMb = (Buffer.byteLength(html, 'utf-8') / (1024 * 1024)).toFixed(2)
console.log(`✓ Preview standalone gerada: ${outFile} (${sizeMb} MB)`)
