const DB_NAME = 'tianji-sizhu'
const DB_VERSION = 1
const STORE_NAME = 'charts'

export interface ChartRecord {
  id?: number
  name: string
  gender: number
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number
  calendar: number
  chartData: string
  notes: string
  createdAt: string
}

export interface ChartSummary {
  id: number
  name: string
  gender: number
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number
  calendar: number
  createdAt: string
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
        store.createIndex('name', 'name', { unique: false })
        store.createIndex('createdAt', 'createdAt', { unique: false })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveChart(record: Omit<ChartRecord, 'id'>): Promise<number> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.add(record)
    request.onsuccess = () => resolve(request.result as number)
    request.onerror = () => reject(request.error)
  })
}

export async function getChart(id: number): Promise<ChartRecord | undefined> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.get(id)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function listCharts(): Promise<ChartSummary[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.getAll()
    request.onsuccess = () => {
      const all = (request.result as ChartRecord[]).map(r => ({
        id: r.id!,
        name: r.name,
        gender: r.gender,
        birthYear: r.birthYear,
        birthMonth: r.birthMonth,
        birthDay: r.birthDay,
        birthHour: r.birthHour,
        calendar: r.calendar,
        createdAt: r.createdAt,
      }))
      all.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      resolve(all)
    }
    request.onerror = () => reject(request.error)
  })
}

export async function deleteChart(id: number): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function exportAllCharts(): Promise<ChartRecord[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export function downloadJSON(data: unknown, filename: string) {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
