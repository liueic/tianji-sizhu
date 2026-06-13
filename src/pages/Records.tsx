import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listCharts, deleteChart, exportAllCharts, downloadJSON } from '../lib/storage/db'
import type { ChartSummary } from '../lib/storage/db'
import type { BaziInput } from '../lib/bazi/types'

function Records() {
  const navigate = useNavigate()
  const [records, setRecords] = useState<ChartSummary[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadRecords()
  }, [])

  const loadRecords = async () => {
    try {
      const list = await listCharts()
      setRecords(list)
    } catch (e) {
      console.error('load records failed', e)
    }
  }

  const handleViewChart = (r: ChartSummary) => {
    const baziInput: BaziInput = {
      name: r.name,
      gender: r.gender,
      year: r.birthYear,
      month: r.birthMonth,
      day: r.birthDay,
      hour: r.birthHour,
      calendar: r.calendar,
    }
    navigate('/result', { state: baziInput })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条记录吗？')) return
    try {
      await deleteChart(id)
      loadRecords()
    } catch (e) {
      console.error('delete failed', e)
    }
  }

  const handleExport = async () => {
    try {
      const charts = await exportAllCharts()
      downloadJSON(charts, 'tianji-export.json')
    } catch (e) {
      console.error('export failed', e)
    }
  }

  const filteredRecords = search
    ? records.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
    : records

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold font-heading text-gold tracking-wide-cn">历史记录</h1>
        <div className="flex gap-2">
          <button onClick={handleExport} className="px-4 py-2 bg-gold/15 border border-gold/40 text-gold hover:bg-gold/25 rounded-sm text-sm font-heading transition-colors">
            导出
          </button>
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-ink-700 hover:bg-ink-600 border border-bronze/30 rounded-sm text-sm transition-colors">
            返回
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜索记录..."
          className="w-full px-4 py-2.5 bg-ink-800 border border-bronze/30 rounded-sm text-parchment-300 placeholder:text-[var(--text-muted)] focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
        />
      </div>

      {filteredRecords.length === 0 ? (
        <p className="text-[var(--text-muted)] text-center py-12">
          {search ? '没有匹配的记录' : '暂无保存记录'}
        </p>
      ) : (
        <div className="space-y-2">
          {filteredRecords.map(r => (
            <div
              key={r.id}
              onClick={() => handleViewChart(r)}
              className="flex justify-between items-center panel-traditional p-4 hover:bg-ink-600 transition-colors cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <span className="font-heading text-parchment-100">{r.name}</span>
                <span className="ml-2 text-sm text-[var(--text-secondary)]">{r.gender === 0 ? '男' : '女'}</span>
                <span className="ml-3 text-xs text-[var(--text-tertiary)]">
                  {r.birthYear}年{r.birthMonth}月{r.birthDay}日
                </span>
                <span className="ml-4 text-xs text-[var(--text-muted)]">{r.createdAt?.slice(0, 10)}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-jade/70 font-heading">点击查看 →</span>
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(r.id) }}
                  className="px-3 py-1 text-cinnabar/70 hover:text-cinnabar text-sm transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-center text-xs text-[var(--text-muted)]">
        共 {filteredRecords.length} 条记录 · 点击记录查看排盘详情
      </div>
    </div>
  )
}

export default Records
