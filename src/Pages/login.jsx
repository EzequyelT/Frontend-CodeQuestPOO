import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, CheckCircle, XCircle, X } from 'lucide-react';
import logo from '../Assets/logo.png';
import Bg from '../Assets/Login/BgLogin.jpg';
import HeroSection from '../Assets/Login/Hero.png';
import { useNavigate } from "react-router-dom";
import { login as authLogin, saveToken } from "../Services/auth/authService";

// Componente de Notificação Toast
const Toast = ({ message, type, onClose }) => {
  const isSuccess = type === 'success';
  
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`flex items-center gap-3 min-w-[320px] max-w-md p-4 rounded-lg shadow-2xl backdrop-blur-sm border ${
        isSuccess 
          ? 'bg-emerald-500/90 border-emerald-400/50' 
          : 'bg-red-500/90 border-red-400/50'
      }`}>
        {/* Icon */}
        <div className="flex-shrink-0">
          {isSuccess ? (
            <CheckCircle className="w-6 h-6 text-white" />
          ) : (
            <XCircle className="w-6 h-6 text-white" />
          )}
        </div>
        
        {/* Message */}
        <div className="flex-1">
          <p className="text-white font-medium text-sm">{message}</p>
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="flex-shrink-0 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // Função para mostrar toast
  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000); // Auto-close após 5 segundos
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token, user } = await authLogin(email, password);
      saveToken(token);
      localStorage.setItem('cq_user', JSON.stringify(user));
      showToast('Login efetuado com sucesso!', 'success');
      setTimeout(() => navigate('/Dashboard'), 1500);
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || 'Erro ao efetuar login. Verifique suas credenciais.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigate("/CriarConta");
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Background Image */}
      <img src={Bg} alt="Background" className="fixed inset-0 bg-gradient-to-br from-black/300 via-slate-900/60 to-black/300 z-10" />

      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/80 z-10"></div>

      <div className="min-h-screen flex relative z-20">
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Logo/Brand */}
            <div className="text-center mb-8">
              <img src={logo} alt="CodeQuestPOO RP Logo" className="mx-auto w-150 h-55 mb-4" />
            </div>

            {/* Login Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-10 border border-slate-700/50">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Bem-vindo de Volta</h2>
                <p className="text-slate-400 text-sm">
                  Entre com suas credenciais para aceder sua conta
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@exemplo.com"
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:border-slate-600"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite sua password"
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-11 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:border-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                    <input type="checkbox" className="mr-2 rounded border-slate-600 bg-slate-900/50 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0" />
                    Lembrar-me
                  </label>
                  <a href="#" className="text-cyan-500 hover:text-cyan-400 transition-colors">
                    Esqueceu a password?
                  </a>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3.5 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 flex items-center justify-center gap-2 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Lock className="w-5 h-5" />
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-800/50 text-slate-400">
                    Não tens conta?
                  </span>
                </div>
              </div>

              {/* Create Account Button */}
              <button
                type="button"
                onClick={handleCreateAccount}
                className="w-full bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <User className="w-5 h-5" />
                Criar Conta
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 relative">
          <div className="relative z-10 flex items-center justify-center">
            {/* Geometric shapes */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-[450px] h-[450px] bg-gradient-to-br from-cyan-500/40 to-blue-500/40 rounded-[3rem] rotate-12 -z-10"></div>
              <div className="absolute w-[370px] h-[370px] bg-gradient-to-br from-blue-600/30 to-cyan-600/30 rounded-[2.5rem] -rotate-12 translate-x-12 translate-y-8 -z-20"></div>
              <div className="absolute w-32 h-32 bg-cyan-400/50 rounded-2xl rotate-45 -left-16 -top-16 -z-10"></div>
              <div className="absolute w-24 h-24 bg-blue-400/50 rounded-xl -rotate-45 -right-12 -bottom-12 -z-10"></div>
            </div>

            {/* Hero Image */}
            <img
              src={HeroSection}
              alt="Hero Section"
              className="relative w-auto h-auto max-h-[750px] object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* CSS para animação */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}