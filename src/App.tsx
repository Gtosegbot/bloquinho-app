import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './features/landing/LandingPage';
import { AdminLayout } from './features/admin/AdminLayout';
import { KnowledgeBase } from './features/admin/pages/KnowledgeBase';
import { ServicesPage } from './features/landing/pages/ServicesPage';
import { AboutPage } from './features/landing/pages/AboutPage';
import { ContactPage } from './features/landing/pages/ContactPage';
import { LoginPage } from './features/auth/LoginPage';
import { AuthProvider } from './features/auth/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* Admin Routes (Protected) */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<Navigate to="/admin/knowledge" replace />} />
                            <Route path="dashboard" element={<div className="p-4">Dashboard CRM (Em Breve)</div>} />
                            <Route path="knowledge" element={<KnowledgeBase />} />
                            <Route path="calculator" element={<div className="p-4">Calculadora (Em Breve)</div>} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
