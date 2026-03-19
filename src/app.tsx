import { BrowserRouter, Route, Routes } from "react-router-dom"
import ForgotPasswordPage from "./components/auth/forgot-password-page"
import ProtectedRoute from "./components/auth/protected-route"
import ResetPasswordPage from "./components/auth/reset-password-page"
import SignInPage from "./components/auth/sign-in-page"
import SignUpPage from "./components/auth/sign-up-page"
import VerifyEmailPage from "./components/auth/verify-email-page"
import AdminPage from "./components/admin/admin-page"
import Header from "./components/header/header"
import Homepage from "./components/homepage/homepage"
import InternacionalMain from "./components/international-opportunities/internacional-main"
import InternacionalInfo from "./components/international-opportunities/internacional-info"
import NacionalMain from "./components/national-opportunities/nacional-main"
import NacionalInfo from "./components/national-opportunities/nacional-info"
import ProfileMain from "./components/profile/profile-main"
import WorldMapPage from "./components/world-map/world-map-page"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages — no header */}
        <Route element={<SignInPage />} path="/login" />
        <Route element={<SignUpPage />} path="/cadastro" />
        <Route element={<ForgotPasswordPage />} path="/esqueci-senha" />
        <Route element={<ResetPasswordPage />} path="/redefinir-senha" />
        <Route element={<VerifyEmailPage />} path="/verificar-email" />

        {/* App pages — with header */}
        <Route
          element={
            <div className="min-h-screen bg-slate-950 text-slate-200">
              <Header />
              <Routes>
                <Route element={<Homepage />} path="/" />
                <Route element={<InternacionalMain />} path="/oportunidades/internacionais" />
                <Route element={<InternacionalInfo />} path="/oportunidades/internacionais/:id" />
                <Route element={<NacionalMain />} path="/oportunidades/nacionais" />
                <Route element={<NacionalInfo />} path="/oportunidades/nacionais/:id" />
                <Route element={<WorldMapPage />} path="/mapa" />
                <Route
                  element={
                    <ProtectedRoute>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                  path="/admin"
                />
                <Route
                  element={
                    <ProtectedRoute>
                      <ProfileMain />
                    </ProtectedRoute>
                  }
                  path="/perfil"
                />
              </Routes>
            </div>
          }
          path="/*"
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
