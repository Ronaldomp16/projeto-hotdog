import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('.', import.meta.url).pathname.replace(/^\/([a-zA-Z]:)/, '$1')

const toDataUri = (relPath, mime) =>
  `data:${mime};base64,${readFileSync(join(root, relPath)).toString('base64')}`

const LOGO = toDataUri('assets/logo.png', 'image/png')
const DOG_SIMPLES = toDataUri('assets/menu/dog-simples.svg', 'image/svg+xml')
const DOG_DUPLO = toDataUri('assets/menu/dog-duplo.svg', 'image/svg+xml')
const DOG_BACON = toDataUri('assets/menu/dog-bacon.svg', 'image/svg+xml')
const DOG_BACON_DUPLO = toDataUri('assets/menu/dog-bacon-duplo.svg', 'image/svg+xml')
const DOG_SEMPAO = toDataUri('assets/menu/dog-sem-pao.svg', 'image/svg+xml')
const DOG_SEMPAO_DUPLO = toDataUri('assets/menu/dog-sem-pao-duplo.svg', 'image/svg+xml')
const BATATA_CHIPS = toDataUri('assets/menu/batata-chips.svg', 'image/svg+xml')
const DRINK_REFRI = toDataUri('assets/menu/drink-refri.svg', 'image/svg+xml')
const DRINK_SUCO = toDataUri('assets/menu/drink-suco.svg', 'image/svg+xml')
const DRINK_AGUA = toDataUri('assets/menu/drink-agua.svg', 'image/svg+xml')
const ACAI_LOGO = toDataUri('assets/acai-logo.jpeg', 'image/jpeg')
const INTRO_CART = toDataUri('assets/intro-cart.png', 'image/png')
const INTRO_CAR = toDataUri('assets/intro-car.png', 'image/png')
const EVENTO_1 = toDataUri('assets/eventos/evento-1.svg', 'image/svg+xml')
const EVENTO_2 = toDataUri('assets/eventos/evento-2.svg', 'image/svg+xml')
const EVENTO_3 = toDataUri('assets/eventos/evento-3.svg', 'image/svg+xml')
const EVENTO_4 = toDataUri('assets/eventos/evento-4.svg', 'image/svg+xml')
const SPROUT = toDataUri('assets/sprout/hotdog-outline.png', 'image/png')
const PILLAR_HOTDOG = toDataUri('assets/pillar-hotdog.png', 'image/png')
const ACAI_BOWL = toDataUri('assets/acai/acai-bowl-outline.png', 'image/png')

let html = readFileSync(join(root, 'template.html'), 'utf-8')
html = html.split('__LOGO__').join(LOGO)
html = html.split('__SPROUT__').join(SPROUT)
html = html.split('__PILLAR_HOTDOG__').join(PILLAR_HOTDOG)
html = html.split('__ACAI_BOWL__').join(ACAI_BOWL)
html = html.split('__ACAI_LOGO__').join(ACAI_LOGO)
html = html.split('__INTRO_CART__').join(INTRO_CART)
html = html.split('__INTRO_CAR__').join(INTRO_CAR)
html = html.split('__EVENTO_1__').join(EVENTO_1)
html = html.split('__EVENTO_2__').join(EVENTO_2)
html = html.split('__EVENTO_3__').join(EVENTO_3)
html = html.split('__EVENTO_4__').join(EVENTO_4)
html = html.split('__DOG_SIMPLES__').join(DOG_SIMPLES)
html = html.split('__DOG_DUPLO__').join(DOG_DUPLO)
html = html.split('__DOG_BACON__').join(DOG_BACON)
html = html.split('__DOG_BACON_DUPLO__').join(DOG_BACON_DUPLO)
html = html.split('__DOG_SEMPAO__').join(DOG_SEMPAO)
html = html.split('__DOG_SEMPAO_DUPLO__').join(DOG_SEMPAO_DUPLO)
html = html.split('__BATATA_CHIPS__').join(BATATA_CHIPS)
html = html.split('__DRINK_REFRI__').join(DRINK_REFRI)
html = html.split('__DRINK_SUCO__').join(DRINK_SUCO)
html = html.split('__DRINK_AGUA__').join(DRINK_AGUA)

const sizeLabel = `${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB`

// docs/index.html: alvo do deploy (Cloudflare Worker lê a pasta docs/ como site estático)
const deployFile = join(root, '..', 'docs', 'index.html')
writeFileSync(deployFile, html, 'utf-8')
console.log('✓ gerado (deploy):', deployFile, `(${sizeLabel})`)

// cópia com nome amigável, pronta pra mandar por WhatsApp/e-mail
const whatsappFile = join(root, '..', 'Dog Quadradinho - Versão Oficial.html')
writeFileSync(whatsappFile, html, 'utf-8')
console.log('✓ gerado (whatsapp):', whatsappFile, `(${sizeLabel})`)
