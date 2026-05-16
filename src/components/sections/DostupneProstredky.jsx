import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Wallet, Plus } from 'lucide-react'
import PrimaryButton from '../ui/PrimaryButton'
import { generateProductId, nextColor } from '../dostupne/dostupneData'
import HeroModuleDostupne from '../dostupne/HeroModuleDostupne'
import ProductCard from '../dostupne/ProductCard'
import DrawerHistorie from '../dostupne/DrawerHistorie'
import DrawerForm from '../dostupne/DrawerForm'
import DeleteConfirmModal from '../dostupne/DeleteConfirmModal'
import Snackbar from '../dostupne/Snackbar'

export default function DostupneProstredky({ products, setProducts }) {
  const [chartView, setChartView] = useState('months')
  const [openProductId, setOpenProductId] = useState(null)
  // editState: null | { mode: 'record', productId, record? } | { mode: 'product' }
  const [editState, setEditState] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [snackbar, setSnackbar] = useState(null)

  const visibleProducts = products.filter(p => !p.isDeleted)
  const openProduct = products.find(p => p.id === openProductId) ?? null
  const isL2Open = editState !== null

  function handleOpenHistorie(productId) {
    setOpenProductId(productId)
    setEditState(null)
  }

  function handleCloseHistorie() {
    setOpenProductId(null)
    setEditState(null)
  }

  function handleNewRecordFromCard(productId) {
    setEditState({ mode: 'record', productId })
  }

  function handleNewRecordFromHistorie(productId) {
    setEditState({ mode: 'record', productId })
  }

  function handleEditRecord(record) {
    setEditState({ mode: 'record', productId: openProductId, record })
  }

  function handleAddProduct() {
    setEditState({ mode: 'product' })
  }

  function handleDeleteRequest(productId) {
    const product = products.find(p => p.id === productId)
    if (product) setDeleteTarget(product)
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return
    setProducts(prev =>
      prev.map(p => p.id === deleteTarget.id ? { ...p, isDeleted: true } : p)
    )
    if (openProductId === deleteTarget.id) {
      setOpenProductId(null)
      setEditState(null)
    }
    setSnackbar({ id: Date.now(), message: `Produkt ${deleteTarget.name} byl smazán.` })
    setDeleteTarget(null)
  }

  function handleDeleteCancel() {
    setDeleteTarget(null)
  }

  const handleSnackbarDismiss = useCallback(() => setSnackbar(null), [])

  function handleCloseForm() {
    setEditState(null)
  }

  function handleSave(payload) {
    if (payload.type === 'product') {
      const newProduct = {
        id: generateProductId(),
        name: payload.name,
        color: nextColor(),
        records: [{ id: payload.date, date: payload.date, balance: payload.balance }],
      }
      setProducts(prev => [...prev, newProduct])
    } else {
      const productId = editState?.productId
      setProducts(prev =>
        prev.map(p => {
          if (p.id !== productId) return p
          const exists = p.records.find(r => r.date === payload.date)
          let records
          if (exists) {
            records = p.records.map(r =>
              r.date === payload.date ? { ...r, balance: payload.balance } : r
            )
          } else {
            records = [...p.records, { id: payload.date, date: payload.date, balance: payload.balance }]
          }
          return { ...p, records }
        })
      )
    }
    setEditState(null)
  }

  return (
    <div className="section-fade relative flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
        <HeroModuleDostupne
          products={products}
          chartView={chartView}
          onChartViewChange={setChartView}
        />

        {/* Section heading */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <Wallet size={18} strokeWidth={1.8} className="text-white/40" />
            <h1 className="text-lg font-semibold tracking-tight text-white/80">
              Dostupné prostředky
            </h1>
          </div>
          <PrimaryButton onClick={handleAddProduct}>
            <Plus size={13} strokeWidth={2.5} />
            Přidat produkt
          </PrimaryButton>
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visibleProducts.map(product => (
              <motion.div
                key={product.id}
                layout
                exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.18 } }}
              >
                <ProductCard
                  product={product}
                  onOpenHistorie={handleOpenHistorie}
                  onNewRecord={handleNewRecordFromCard}
                  onDelete={handleDeleteRequest}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Drawers */}
      <AnimatePresence>
        {openProduct && (
          <DrawerHistorie
            key="historie"
            product={openProduct}
            isL2Open={isL2Open}
            onClose={handleCloseHistorie}
            onEditRecord={handleEditRecord}
            onNewRecord={handleNewRecordFromHistorie}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editState && (
          <DrawerForm
            key="form"
            mode={editState.mode}
            record={editState.record}
            onClose={handleCloseForm}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmModal
            key="delete-modal"
            product={deleteTarget}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
          />
        )}
      </AnimatePresence>

      {/* Snackbar */}
      <AnimatePresence>
        {snackbar && (
          <Snackbar
            key={snackbar.id}
            message={snackbar.message}
            onDismiss={handleSnackbarDismiss}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
