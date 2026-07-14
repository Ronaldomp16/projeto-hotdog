import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([a-zA-Z]:)/, '$1')
const publicDir = join(root, 'public')

const toDataUri = (file, mime) =>
  `data:${mime};base64,${readFileSync(join(publicDir, file)).toString('base64')}`

const LOGO = toDataUri('logo-transparent.png', 'image/png')
const CAR = toDataUri('intro-car.png', 'image/png')
const CART = toDataUri('intro-cart.png', 'image/png')

let html = readFileSync(join(root, 'scripts', 'comparison-template.html'), 'utf-8')
html = html.split('__LOGO__').join(LOGO)
html = html.split('__CAR__').join(CAR)
html = html.split('__CART__').join(CART)

const outFile = join(root, 'Comparativo - Redesign Visual.html')
writeFileSync(outFile, html, 'utf-8')
console.log('✓ gerado:', outFile)
