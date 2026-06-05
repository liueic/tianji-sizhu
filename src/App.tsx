import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Result from './pages/Result'
import Records from './pages/Records'
import Settings from './pages/Settings'

function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  if (location.pathname === '/result') return null

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-ink-800 border-b border-bronze/30">
      <button
        onClick={() => navigate('/')}
        className="font-heading text-lg text-gold tracking-traditional hover:text-gold-light transition-colors"
      >
        天机四柱
      </button>
      <div className="flex gap-4 text-sm font-body">
        {!isHome && (
          <button onClick={() => navigate('/')} className="text-[var(--text-secondary)] hover:text-gold transition-colors">
            排盘
          </button>
        )}
        <button onClick={() => navigate('/records')} className="text-[var(--text-secondary)] hover:text-gold transition-colors">
          记录
        </button>
        <button onClick={() => navigate('/settings')} className="text-[var(--text-secondary)] hover:text-gold transition-colors">
          设置
        </button>
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-ink-900 text-parchment-300 font-body">
        <NavBar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/result" element={<Result />} />
            <Route path="/records" element={<Records />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
        <footer className="py-4 text-center text-xs text-[var(--text-tertiary)] border-t border-bronze/20">
          <a
            href="https://github.com/hhx465453939/tianji-sizhu"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors"
          >
            GitHub · 天机四柱
          </a>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
