import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App as AntdApp, ConfigProvider } from 'antd'
import { ConvexProvider } from 'convex/react'
import 'antd/dist/reset.css'
import './index.css'
import App from './App.tsx'
import { convex } from './convex.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 18,
          colorPrimary: '#1d4ed8',
          fontFamily: '"Avenir Next", "Segoe UI", sans-serif',
        },
      }}
    >
      <AntdApp>
        <ConvexProvider client={convex}>
          <App />
        </ConvexProvider>
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
)
