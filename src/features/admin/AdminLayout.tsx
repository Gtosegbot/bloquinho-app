
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Database, Calculator, LogOut } from 'lucide-react';
import bloquinhoHead from '../../../assets/bloquinho.png'; // Re-using existing asset

export const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 p-1">
                        <img src={bloquinhoHead} alt="Bloquinho" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-gray-800">Bloquinho Admin</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Painel
                    </NavLink>
                    <NavLink
                        to="/admin/knowledge"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Database className="w-5 h-5" />
                        Conhecimento (RAG)
                    </NavLink>
                    <NavLink
                        to="/admin/calculator"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Calculator className="w-5 h-5" />
                        Calculadora
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut className="w-5 h-5" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};
