import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import ControlPage from './pages/control.tsx'
import IdiomsPage from './pages/idioms.tsx'
import IndexPage from './pages/index.tsx'
import PostureWordsPage from './pages/posture-words.tsx'
import PresentPage from './pages/present.tsx'

function RootLayout() {
  return (
    <main className="min-h-svh px-4 py-6 sm:px-6 lg:px-9 lg:py-8">
      <Outlet />
    </main>
  )
}

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexPage,
})

const idiomsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/idioms',
  component: IdiomsPage,
})

const postureWordsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/posture-words',
  component: PostureWordsPage,
})

const presentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/present',
  component: PresentPage,
})

const controlRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/control',
  component: ControlPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  idiomsRoute,
  postureWordsRoute,
  presentRoute,
  controlRoute,
])

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
