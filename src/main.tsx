import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { FFmpegVersionProvider } from './contexts/FFmpegVersionContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FFmpegVersionProvider>
      <App />
    </FFmpegVersionProvider>
  </React.StrictMode>,
)
