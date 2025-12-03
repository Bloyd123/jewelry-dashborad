// ============================================================================
// FILE: src/main.tsx
// Application Entry Point with Redux Provider
// ============================================================================

import React from 'react'

import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App.tsx'
import { store } from './store'
import './styles/index.css'

import '@/lib/i18n'
// ============================================================================
// RENDER APPLICATION
// ============================================================================

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
