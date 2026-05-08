import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Prehled from './components/sections/Prehled'
import DostupneProstredky from './components/sections/DostupneProstredky'
import Investovani from './components/sections/Investovani'
import PenzijniSporeni from './components/sections/PenzijniSporeni'
import { INITIAL_FUNDS } from './components/pension/pensionData'
import { INITIAL_PRODUCTS } from './components/dostupne/dostupneData'

export default function App() {
  const [activeSection, setActiveSection] = useState('prehled')
  const [funds, setFunds] = useState(INITIAL_FUNDS)
  const [products, setProducts] = useState(INITIAL_PRODUCTS)

  function renderSection() {
    switch (activeSection) {
      case 'prehled':
        return <Prehled key="prehled" funds={funds} products={products} onSectionChange={setActiveSection} />
      case 'dostupne':
        return <DostupneProstredky key="dostupne" products={products} setProducts={setProducts} />
      case 'investovani':
        return <Investovani key="investovani" />
      case 'penzijni':
        return <PenzijniSporeni key="penzijni" funds={funds} setFunds={setFunds} />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex flex-1 overflow-hidden">
        {renderSection()}
      </main>
    </div>
  )
}
