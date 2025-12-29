import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { LibraryBackground } from '@/components/layout/LibraryBackground'
import LoginPage from '@/pages/LoginPage'
import BooksPage from '@/pages/BooksPage'

// Layout pour les pages protegees (avec Header)
function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative z-10">
      <Header />
      <main>{children}</main>
    </div>
  )
}

// Redirect si deja connecte (pour /login)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      {/* Route publique - Login */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* Route protegee - Page principale */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ProtectedLayout>
              <BooksPage />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      {/* Redirect toute autre route vers / */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ma-bibliotheque-theme">
      <BrowserRouter>
        <AuthProvider>
          <LibraryBackground />
          <AppRoutes />
          <Toaster position="bottom-right" />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
