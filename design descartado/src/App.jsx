import { useState } from 'react'
import { CartProvider } from './context/CartContext.jsx'
import IntroLoader from './components/IntroLoader.jsx'
import Navbar from './components/Navbar.jsx'
import Hero3D from './components/Hero3D.jsx'
import QuemSomos from './components/QuemSomos.jsx'
import Menu from './components/Menu.jsx'
import Acai from './components/Acai.jsx'
import Locations from './components/Locations.jsx'
import PrivateEvents from './components/PrivateEvents.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/cart/CartDrawer.jsx'

export default function App() {
  const [canvasReady, setCanvasReady] = useState(false)

  return (
    <CartProvider>
      <div className="min-h-screen bg-ink">
        <IntroLoader onCanvasReady={() => setCanvasReady(true)} />
        <Navbar />
        <main>
          <Hero3D activateCanvas={canvasReady} />
          <QuemSomos />
          <Menu />
          <Acai />
          <Locations />
          <PrivateEvents />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}
