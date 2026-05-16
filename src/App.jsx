import { useState } from 'react'
import Sidebar from './components/Sidebar'
import StickyHeader from './components/StickyHeader'
import BottomTabBar from './components/BottomTabBar'
import Prehled from './components/sections/Prehled'
import DostupneProstredky from './components/sections/DostupneProstredky'
import Investovani from './components/sections/Investovani'
import PenzijniSporeni from './components/sections/PenzijniSporeni'
import { INITIAL_FUNDS } from './components/pension/pensionData'
import { INITIAL_PRODUCTS } from './components/dostupne/dostupneData'
import { INITIAL_BROKERS } from './components/investovani/investovaniData'

const SECTION_LABELS = {
  prehled: 'Přehled',
  dostupne: 'Dostupné prostředky',
  investovani: 'Investování',
  penzijni: 'Penzijní spoření',
}

export default function App() {
  const [activeSection, setActiveSection] = useState('prehled')
  const [funds, setFunds] = useState(INITIAL_FUNDS)
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [brokers, setBrokers] = useState(INITIAL_BROKERS)

  function renderSection() {
    switch (activeSection) {
      case 'prehled':
        return <Prehled key="prehled" funds={funds} products={products} onSectionChange={setActiveSection} />
      case 'dostupne':
        return <DostupneProstredky key="dostupne" products={products} setProducts={setProducts} />
      case 'investovani':
        return <Investovani key="investovani" brokers={brokers} setBrokers={setBrokers} />
      case 'penzijni':
        return <PenzijniSporeni key="penzijni" funds={funds} setFunds={setFunds} />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <StickyHeader title={SECTION_LABELS[activeSection]} />
        <main className="flex flex-1 overflow-hidden">
          {renderSection()}
        </main>
      </div>
      <BottomTabBar activeSection={activeSection} onSectionChange={setActiveSection} />
    </div>
  )
}
