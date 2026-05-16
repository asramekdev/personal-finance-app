import { Plus } from 'lucide-react'
import { tickerCurrentValue, tickerTotalShares, tickerCostBasis, formatCZK } from './investovaniData'
import PrimaryButton from '../ui/PrimaryButton'

function TickerRow({ ticker, brokerId, onOpenDetail }) {
  const value = tickerCurrentValue(ticker.records)
  const totalShares = tickerTotalShares(ticker.purchases)
  const costBasis = tickerCostBasis(ticker.purchases)
  const gain = value - costBasis
  const isPositive = gain >= 0

  return (
    <div
      className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-white/[0.04]"
      onClick={() => onOpenDetail(brokerId, ticker.id)}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white/90">{ticker.name}</p>
        <p className="mt-0.5 text-xs text-white/40">
          {totalShares} {ticker.symbol}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-white/90">{formatCZK(costBasis)}</p>
        <p className={`text-xs font-medium ${isPositive ? 'text-[#30D158]' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}
          {formatCZK(gain)}
        </p>
      </div>
    </div>
  )
}

export default function BrokerCard({ broker, onOpenDetail, onAddTicker }) {
  const brokerTotal = broker.tickers.reduce((s, t) => s + tickerCurrentValue(t.records), 0)

  return (
    <div className="liquid-glass flex flex-col overflow-hidden rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-5">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{
              backgroundColor: broker.color,
              boxShadow: `0 0 6px 1px ${broker.color}60`,
            }}
          />
          <span className="text-sm font-semibold text-white/80">{broker.name}</span>
        </div>
        <p className="text-base font-semibold tracking-tight text-white/90">
          {formatCZK(brokerTotal)}
        </p>
      </div>

      {/* Divider */}
      {broker.tickers.length > 0 && <div className="mx-4 border-t border-white/[0.07]" />}

      {/* Ticker rows */}
      <div className="flex flex-col py-1">
        {broker.tickers.map((ticker, i) => (
          <div key={ticker.id}>
            {i > 0 && <div className="mx-4 border-t border-white/[0.05]" />}
            <TickerRow ticker={ticker} brokerId={broker.id} onOpenDetail={onOpenDetail} />
          </div>
        ))}
        {broker.tickers.length === 0 && (
          <p className="px-5 py-3 text-xs text-white/25">
            Žádné tickery — přidejte první pozici.
          </p>
        )}
      </div>

      {/* Add ticker button */}
      <div className="px-4 pb-4 pt-1">
        <PrimaryButton className="w-full justify-center" onClick={() => onAddTicker(broker.id)}>
          <Plus size={13} strokeWidth={2.5} />
          Přidat ticker
        </PrimaryButton>
      </div>
    </div>
  )
}
