import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Prehled from './components/sections/Prehled'
import DostupneProstredky from './components/sections/DostupneProstredky'
import Investovani from './components/sections/Investovani'
import PenzijniSporeni from './components/sections/PenzijniSporeni'

const SECTIONS = {
  prehled: Prehled,
  dostupne: DostupneProstredky,
  investovani: Investovani,
  penzijni: PenzijniSporeni,
}

export default function App() {
  const [activeSection, setActiveSection] = useState('prehled')

  const ActiveComponent = SECTIONS[activeSection]

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex flex-1 overflow-hidden">
        <ActiveComponent key={activeSection} />
      </main>
    </div>
  )
}
