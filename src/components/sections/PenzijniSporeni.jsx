import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { INITIAL_FUNDS } from '../pension/pensionData'
import HeroModule from '../pension/HeroModule'
import FundCard from '../pension/FundCard'
import DrawerLevel1 from '../pension/DrawerLevel1'
import DrawerLevel2 from '../pension/DrawerLevel2'

export default function PenzijniSporeni() {
  const [funds, setFunds] = useState(INITIAL_FUNDS)
  const [chartView, setChartView] = useState('months')
  const [openFundId, setOpenFundId] = useState(null)     // L1
  const [editRecord, setEditRecord] = useState(null)     // L2: record obj | 'new' | null
  const [editFundId, setEditFundId] = useState(null)     // which fund is being edited in L2

  const openFund = funds.find(f => f.id === openFundId) ?? null

  function handleOpenDetail(fundId) {
    setOpenFundId(fundId)
    setEditRecord(null)
  }

  function handleNewRecord(fundId) {
    setEditFundId(fundId)
    setEditRecord('new')
    // Also open L1 if we're opening from fund card (so L1 is behind)
    if (!openFundId) setOpenFundId(fundId)
  }

  function handleEditRecord(record) {
    setEditRecord(record)
    setEditFundId(openFundId)
  }

  function handleCloseL1() {
    setOpenFundId(null)
    setEditRecord(null)
  }

  function handleCloseL2() {
    setEditRecord(null)
  }

  function handleSaveRecord(fundId, newRecord) {
    setFunds(prev =>
      prev.map(fund => {
        if (fund.id !== fundId) return fund
        const exists = fund.records.find(r => r.id === newRecord.id)
        const records = exists
          ? fund.records.map(r => (r.id === newRecord.id ? newRecord : r))
          : [...fund.records, newRecord].sort((a, b) => a.date.localeCompare(b.date))
        return { ...fund, records }
      })
    )
    setEditRecord(null)
  }

  return (
    <div className="section-fade relative flex flex-1 overflow-hidden">
      {/* Scrollable main content */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
        <HeroModule
          funds={funds}
          chartView={chartView}
          onChartViewChange={setChartView}
        />

        <div className="grid grid-cols-2 gap-4">
          {funds.map(fund => (
            <FundCard
              key={fund.id}
              fund={fund}
              onOpenDetail={handleOpenDetail}
              onNewRecord={handleNewRecord}
            />
          ))}
        </div>
      </div>

      {/* Level 1 drawer */}
      <AnimatePresence>
        {openFund && (
          <DrawerLevel1
            key="l1"
            fund={openFund}
            chartView={chartView}
            isL2Open={editRecord !== null}
            onClose={handleCloseL1}
            onEditRecord={handleEditRecord}
            onNewRecord={handleNewRecord}
          />
        )}
      </AnimatePresence>

      {/* Level 2 drawer */}
      <AnimatePresence>
        {editRecord !== null && (
          <DrawerLevel2
            key="l2"
            fundId={editFundId}
            record={editRecord === 'new' ? null : editRecord}
            onSave={handleSaveRecord}
            onClose={handleCloseL2}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
