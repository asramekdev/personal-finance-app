import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { TrendingUp, Plus } from 'lucide-react'
import InvestovaniHero from '../investovani/InvestovaniHero'
import BrokerCard from '../investovani/BrokerCard'
import PortfolioStructureCard from '../investovani/PortfolioStructureCard'
import InvestovaniDrawerL1 from '../investovani/InvestovaniDrawerL1'
import InvestovaniDrawerL2 from '../investovani/InvestovaniDrawerL2'
import PrimaryButton from '../ui/PrimaryButton'
import { BROKER_COLORS } from '../investovani/investovaniData'

export default function Investovani({ brokers, setBrokers }) {
  const [chartView, setChartView] = useState('months')
  const [openL1, setOpenL1] = useState(null)  // { brokerId, tickerId }
  const [openL2, setOpenL2] = useState(null)  // { mode, brokerId?, tickerId?, record?, purchase? }

  const l1Broker = openL1 ? (brokers.find(b => b.id === openL1.brokerId) ?? null) : null
  const l1Ticker = l1Broker ? (l1Broker.tickers.find(t => t.id === openL1.tickerId) ?? null) : null

  // ─── Navigation handlers ────────────────────────────────────────────────────

  function handleOpenDetail(brokerId, tickerId) {
    setOpenL1({ brokerId, tickerId })
    setOpenL2(null)
  }

  function handleCloseL1() {
    setOpenL1(null)
    setOpenL2(null)
  }

  function handleCloseL2() {
    setOpenL2(null)
  }

  // From main view
  function handleAddBroker() {
    setOpenL2({ mode: 'addBroker' })
  }

  // From BrokerCard
  function handleAddTicker(brokerId) {
    setOpenL2({ mode: 'addTicker', brokerId })
  }

  // From L1 drawer
  function handleNewRecord() {
    if (!openL1) return
    setOpenL2({ mode: 'newRecord', brokerId: openL1.brokerId, tickerId: openL1.tickerId })
  }

  function handleEditRecord(record) {
    if (!openL1) return
    setOpenL2({ mode: 'editRecord', brokerId: openL1.brokerId, tickerId: openL1.tickerId, record })
  }

  function handleNewPurchase() {
    if (!openL1) return
    setOpenL2({ mode: 'newPurchase', brokerId: openL1.brokerId, tickerId: openL1.tickerId })
  }

  function handleEditPurchase(purchase) {
    if (!openL1) return
    setOpenL2({ mode: 'editPurchase', brokerId: openL1.brokerId, tickerId: openL1.tickerId, purchase })
  }

  // ─── Save handler ────────────────────────────────────────────────────────────

  function handleSave(savedData) {
    const { mode, brokerId, tickerId } = openL2

    if (mode === 'addBroker') {
      setBrokers(prev => [
        ...prev,
        {
          id: `broker-${Date.now()}`,
          name: savedData.name,
          color: BROKER_COLORS[prev.length % BROKER_COLORS.length],
          tickers: [],
        },
      ])
    }

    else if (mode === 'addTicker') {
      const initValue = (savedData.shares || 0) * (savedData.pricePerShare || 0)
      setBrokers(prev =>
        prev.map(b => {
          if (b.id !== brokerId) return b
          const newTicker = {
            id: `ticker-${Date.now()}`,
            symbol: savedData.symbol,
            name: savedData.name,
            purchases:
              savedData.shares > 0
                ? [
                    {
                      id: `p-${Date.now()}`,
                      date: savedData.date,
                      shares: savedData.shares,
                      pricePerShare: savedData.pricePerShare,
                    },
                  ]
                : [],
            records:
              initValue > 0
                ? [{ id: savedData.date, date: savedData.date, value: initValue }]
                : [],
          }
          return { ...b, tickers: [...b.tickers, newTicker] }
        }),
      )
    }

    else if (mode === 'newRecord' || mode === 'editRecord') {
      setBrokers(prev =>
        prev.map(b => {
          if (b.id !== brokerId) return b
          return {
            ...b,
            tickers: b.tickers.map(t => {
              if (t.id !== tickerId) return t
              const exists = t.records.find(r => r.id === savedData.id)
              const records = exists
                ? t.records.map(r => (r.id === savedData.id ? savedData : r))
                : [...t.records, savedData].sort((a, b) => a.date.localeCompare(b.date))
              return { ...t, records }
            }),
          }
        }),
      )
    }

    else if (mode === 'newPurchase' || mode === 'editPurchase') {
      setBrokers(prev =>
        prev.map(b => {
          if (b.id !== brokerId) return b
          return {
            ...b,
            tickers: b.tickers.map(t => {
              if (t.id !== tickerId) return t
              const exists = t.purchases.find(p => p.id === savedData.id)
              const purchases = exists
                ? t.purchases.map(p => (p.id === savedData.id ? savedData : p))
                : [...t.purchases, savedData].sort((a, b) => a.date.localeCompare(b.date))
              return { ...t, purchases }
            }),
          }
        }),
      )
    }

    setOpenL2(null)
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="section-fade relative flex flex-1 overflow-hidden">
      {/* Scrollable main content */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
          <InvestovaniHero
            brokers={brokers}
            chartView={chartView}
            onChartViewChange={setChartView}
            className="h-full"
          />
          <PortfolioStructureCard brokers={brokers} />
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <TrendingUp size={18} strokeWidth={1.8} className="text-white/40" />
              <h1 className="text-lg font-semibold tracking-tight text-white/80">Brokeři</h1>
            </div>
            <PrimaryButton onClick={handleAddBroker}>
              <Plus size={13} strokeWidth={2.5} />
              Přidat brokera
            </PrimaryButton>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {brokers.map(broker => (
              <BrokerCard
                key={broker.id}
                broker={broker}
                onOpenDetail={handleOpenDetail}
                onAddTicker={handleAddTicker}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Level 1 drawer – ticker detail */}
      <AnimatePresence>
        {l1Broker && l1Ticker && (
          <InvestovaniDrawerL1
            key="inv-l1"
            broker={l1Broker}
            ticker={l1Ticker}
            isL2Open={openL2 !== null}
            onClose={handleCloseL1}
            onNewRecord={handleNewRecord}
            onEditRecord={handleEditRecord}
            onNewPurchase={handleNewPurchase}
            onEditPurchase={handleEditPurchase}
          />
        )}
      </AnimatePresence>

      {/* Level 2 drawer – forms */}
      <AnimatePresence>
        {openL2 && (
          <InvestovaniDrawerL2
            key="inv-l2"
            mode={openL2.mode}
            data={openL2.record || openL2.purchase || null}
            onSave={handleSave}
            onClose={handleCloseL2}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
