
import { useAuth } from './AuthContext';
import { Navbar } from '../../components/layout/Navbar';
import bloquinhoHead from '../../assets/bloquinho.png';
import { motion } from 'framer-motion';

export const LoginPage = () => {
    const { signInWithGoogle, user, isAdmin } = useAuth();

    if (user && isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-green-600 mb-4">Login Autorizado! 🔓</h2>
                    <p className="text-gray-600">Redirecionando para o painel...</p>
                    {/* The redirection logic is handled by the ProtectedRoute wrapper usually, 
                      but we can add a manual link just in case */}
                    <a href="/admin" className="mt-4 inline-block text-blue-600 underline">Ir para Admin</a>
                </div>
            </div>
        )
    }

    if (user && !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-red-100">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">🚫</span>
                    </div>
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Acesso Restrito</h1>
                    <p className="text-gray-600 mb-6">
                        O email <strong>{user.email}</strong> não tem permissão de administrador.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors"
                    >
                        Voltar ao Início
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-100"
                >
                    <div className="w-32 h-32 bg-blue-50 rounded-full p-4 mx-auto mb-8 shadow-inner">
                        <img src={bloquinhoHead} alt="Bloquinho" className="w-full h-full object-contain" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Área Administrativa</h1>
                    <p className="text-gray-500 mb-8">
                        Faça login para acessar o CRM e o Cérebro do Bloquinho.
                    </p>

                    <button
                        onClick={signInWithGoogle}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all shadow-sm hover:shadow-md"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
                        Entrar com Google
                    </button>

                    <p className="mt-6 text-xs text-gray-400">
                        Apenas e-mails autorizados (@gtosegbot, @admgtoseg, @disparoseguroback)
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
