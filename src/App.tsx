import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './features/landing/LandingPage';
import { AdminLayout } from './features/admin/AdminLayout';
import { KnowledgeBase } from './features/admin/pages/KnowledgeBase';

import { ServicesPage } from './features/landing/pages/ServicesPage';
import { AboutPage } from './features/landing/pages/AboutPage';
import { ContactPage } from './features/landing/pages/ContactPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Admin Routes (Protected - to add auth later) */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/knowledge" replace />} />
                    <Route path="dashboard" element={<div className="p-4">Dashboard em construção...</div>} />
                    <Route path="knowledge" element={<KnowledgeBase />} />
                    <Route path="calculator" element={<div className="p-4">Calculadora em construção...</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
