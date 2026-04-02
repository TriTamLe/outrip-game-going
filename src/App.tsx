import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api.js'
import './App.css'

function RootLayout() {
  return (
    <main className="app-shell">
      <Outlet />
    </main>
  )
}

function IndexPage() {
  const title = useQuery(api.health.getTitle)

  return <h1>{title ?? 'Game Going'}</h1>
}

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
})

const routeTree = rootRoute.addChildren([indexRoute])

const router = createRouter({
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return <RouterProvider router={router} />
}

export default App
