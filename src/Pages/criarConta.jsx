import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, CheckCircle, XCircle, X, Mail, GraduationCap, School, Calendar, Hash } from 'lucide-react';
import logo from '../Assets/logo.png';
import Bg from '../Assets/Login/BgLogin.jpg';
import HeroSection from '../Assets/Login/Hero.png';
import { useNavigate } from "react-router-dom";
import { registerUser } from '../Services/alunos/alunoService';

// Componente Toast
const Toast = ({ message, type, onClose }) => {
  const isSuccess = type === 'success';

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`flex items-center gap-3 min-w-[320px] max-w-md p-4 rounded-lg shadow-2xl backdrop-blur-sm border ${isSuccess
        ? 'bg-emerald-500/90 border-emerald-400/50'
        : 'bg-red-500/90 border-red-400/50'
        }`}>
        <div className="flex-shrink-0">
          {isSuccess ? (
            <CheckCircle className="w-6 h-6 text-white" />
          ) : (
            <XCircle className="w-6 h-6 text-white" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-white font-medium text-sm">{message}</p>
        </div>
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

// Modal de Escolha de Avatar
const AvatarModal = ({ onSelect, onClose }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  // Array de avatares (você pode substituir por suas imagens)
  const avatars = [
    { id: 1, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', name: 'Avatar 1' },
    { id: 2, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', name: 'Avatar 2' },
    { id: 3, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', name: 'Avatar 3' },
    { id: 4, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', name: 'Avatar 4' },
    { id: 5, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5', name: 'Avatar 5' },
    { id: 6, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6', name: 'Avatar 6' },
    { id: 7, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7', name: 'Avatar 7' },
    { id: 8, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8', name: 'Avatar 8' },
  ];

  const handleConfirm = () => {
    if (selectedAvatar) {
      onSelect(selectedAvatar);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 border border-slate-700">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Escolha seu Avatar</h2>
          <p className="text-slate-400 text-sm">Selecione um avatar para personalizar seu perfil</p>
        </div>

        {/* Grid de Avatares */}
        <div className="grid grid-cols-4 gap-4 mb-6 max-h-96 overflow-y-auto">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => setSelectedAvatar(avatar)}
              className={`relative p-4 rounded-xl transition-all ${selectedAvatar?.id === avatar.id
                ? 'bg-cyan-500/20 border-2 border-cyan-500 scale-105'
                : 'bg-slate-700/50 border-2 border-slate-600 hover:border-slate-500 hover:scale-105'
                }`}
            >
              <img
                src={avatar.url}
                alt={avatar.name}
                className="w-full h-full object-cover rounded-lg"
              />
              {selectedAvatar?.id === avatar.id && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-6 h-6 text-cyan-500" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Botões */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-lg transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedAvatar}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CriarConta() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    numero: '',
    turma: '',
    escola: '',
    ano: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const navigate = useNavigate();

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações
    if (formData.password !== formData.confirmPassword) {
      showToast('As passwords não coincidem!', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showToast('A password deve ter pelo menos 6 caracteres!', 'error');
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        nome: formData.username,
        email: formData.email,
        password: formData.password,
        numero: formData.numero || null,
        turma: formData.turma || null,
        escola: formData.escola || null,
        ano: parseInt(formData.ano.replace(/[^\d]/g, '')) || null, // só números
        ano_letivo: '2025/2026', // ou pegar do form
        avatar_id: null // se não tiver avatar ainda
      };
      const response = await registerUser(dataToSend);

      showToast(response.message || 'Conta criada com sucesso!', 'success');

      // Abrir modal de avatar após 1 segundo
      setTimeout(() => {
        setShowAvatarModal(true);
      }, 1000);

    } catch (err) {
      console.error('Erro ao criar conta:', err);
      console.error('Detalhes do erro:', err.response?.data);

      const msg = err.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
      showToast(msg, 'error');
    } finally {
      console.log('Formulário submetido:', formData);
      setLoading(false);
    }
  };

  const handleAvatarSelect = (avatar) => {
    // Salvar avatar selecionado
    localStorage.setItem('user_avatar', JSON.stringify(avatar));
    setShowAvatarModal(false);

    // Redirecionar para dashboard
    setTimeout(() => {
      navigate('/Dashboard');
    }, 500);
  };

  const handleBackToLogin = () => {
    navigate('/');
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

      {/* Avatar Modal */}
      {showAvatarModal && (
        <AvatarModal
          onSelect={handleAvatarSelect}
          onClose={() => setShowAvatarModal(false)}
        />
      )}

      {/* Background Image */}
      <img src={Bg} alt="Background" className="fixed inset-0 w-full h-full object-cover z-0" />

      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/80 z-10"></div>

      <div className="min-h-screen flex relative z-20 py-8">
        {/* Left Side - Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Logo/Brand */}
            <div className="text-center mb-6">
              <img src={logo} alt="CodeQuestPOO RP Logo" className="mx-auto w-150 h-55 mb-4" />
            </div>

            {/* Register Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-700/50">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">Criar Conta</h2>
                <p className="text-slate-400 text-sm">
                  Preencha os dados abaixo para criar sua conta
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Nome de Utilizador
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="João Silva"
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:border-slate-600"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@exemplo.com"
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:border-slate-600"
                    />
                  </div>
                </div>

                {/* Grid para Número e Turma */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      Número
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        placeholder="12345"
                        required
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:border-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-medium mb-2">
                      Turma
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="turma"
                        value={formData.turma}
                        onChange={handleChange}
                        placeholder="A"
                        required
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:border-slate-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Escola */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Escola
                  </label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="escola"
                      value={formData.escola}
                      onChange={handleChange}
                      placeholder="Escola Secundária"
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:border-slate-600"
                    />
                  </div>
                </div>

                {/* Ano */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Ano
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="ano"
                      value={formData.ano}
                      onChange={handleChange}
                      placeholder="12º"
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:border-slate-600"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-11 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:border-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">
                    Confirmar Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repita a password"
                      required
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-11 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:border-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 flex items-center justify-center gap-2 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <User className="w-5 h-5" />
                  {loading ? 'Criando conta...' : 'Criar Conta'}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-800/50 text-slate-400">
                    Já tens conta?
                  </span>
                </div>
              </div>

              {/* Back to Login Button */}
              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Fazer Login
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