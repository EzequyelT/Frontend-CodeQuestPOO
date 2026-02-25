import React, { useState } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle,
  X,
  Mail,
  GraduationCap,
  School,
  Calendar,
  Hash,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import logo from '../Assets/logo.png';
import Bg from '../Assets/Login/BgLogin.jpg';
import HeroSection from '../Assets/Login/HeroCreateAccount.png';
import AvatarModal from '../Components/Modal/AvatarModal';
import { useNavigate } from "react-router-dom";
import { registerUser } from '../Services/alunos/alunoService';

// Componente Toast Melhorado
const Toast = ({ message, type, onClose }) => {
  const isSuccess = type === 'success';
  return (
    <div className="fixed top-4 right-4 z-50 animate-toast-slide">
      <div className={`flex items-center gap-4 min-w-[320px] max-w-md px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border ${isSuccess
        ? 'bg-gradient-to-r from-emerald-500/95 to-emerald-600/95 border-emerald-400/60'
        : 'bg-gradient-to-r from-red-500/95 to-red-600/95 border-red-400/60'
      }`}>
        <div className="flex-shrink-0">
          {isSuccess ? (
            <CheckCircle className="w-6 h-6 text-white animate-pulse" />
          ) : (
            <AlertCircle className="w-6 h-6 text-white animate-bounce" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-white/70 hover:text-white transition-colors hover:rotate-90 duration-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Componente Input Reutilizável - VERSÃO MODERNA
const InputField = ({ label, icon: Icon, type = 'text', name, value, onChange, placeholder, required = true }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="block text-slate-300 text-xs font-semibold bg-gradient-to-r from-slate-200 to-slate-300 bg-clip-text text-transparent uppercase tracking-wider">
        {label}
      </label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 transition-all duration-300 group-focus-within:text-cyan-400 group-focus-within:scale-110" />}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 text-sm ${Icon ? 'pl-11' : ''} bg-gradient-to-br from-slate-900/60 to-slate-800/40 border rounded-xl text-white placeholder-slate-500/70 transition-all duration-300
            ${focused
              ? 'border-cyan-400/80 ring-2 ring-cyan-400/30 bg-slate-900/80 shadow-lg shadow-cyan-400/20 scale-[1.02]'
              : 'border-slate-700/50 hover:border-slate-600/70 hover:bg-slate-900/70'
            }
            focus:outline-none`}
        />
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
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Mostrar Toast
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

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Avançar para próximo step se não estiver no 3
    if (step !== 3) {
      setStep(step + 1);
      return;
    }

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
        ano: parseInt(formData.ano.replace(/[^\d]/g, '')) || null,
        ano_letivo: '2025/2026',
        avatar_id: null
      };

      const response = await registerUser(dataToSend);
      showToast(response.message || 'Conta criada com sucesso!', 'success');

      // Abrir modal de avatar
      setTimeout(() => setShowAvatarModal(true), 1000);

    } catch (err) {
      console.error('Erro ao criar conta:', err);
      const msg = err.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Selecionar avatar
  const handleAvatarSelect = (avatar) => {
    localStorage.setItem('user_avatar', JSON.stringify(avatar));
    setShowAvatarModal(false);

    setTimeout(() => {
      navigate('/Dashboard');
    }, 500);
  };

  // Voltar para login
  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <>
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Avatar Modal */}
      {showAvatarModal && (
        <AvatarModal
          onSelect={handleAvatarSelect}
          onClose={() => setShowAvatarModal(false)}
        />
      )}

      {/* Background */}
     <img src={Bg} alt="Background" className="fixed inset-0 bg-gradient-to-br from-black/300 via-slate-900/60 to-black/300 z-10" />
      <div className="fixed inset-0 bg-black/80 z-10"></div>

      <div className="min-h-screen flex relative z-20">
        {/* Left - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-6">
          <div className="w-full max-w-md">
            {/* Logo - Reduzido */}
            <div className="text-center mb-4 animate-fade-in">
              <img src={logo} alt="CodeQuestPOO RP Logo" className=" w-150 h-40 mb-2 object-contain" />
            </div>

            {/* Card Principal */}
            <div className={`backdrop-blur-2xl rounded-3xl shadow-2xl border animate-fade-in-up transition-all duration-500 overflow-hidden ${
              step === 1
                ? 'bg-gradient-to-br from-slate-800/60 via-slate-800/50 to-slate-900/60 p-6 border-slate-700/40'
                : step === 2
                ? 'bg-gradient-to-br from-slate-800/60 via-slate-800/50 to-slate-900/60 p-6 border-slate-700/40 ring-1 ring-slate-700/30'
                : 'bg-gradient-to-br from-slate-800/60 via-slate-800/50 to-slate-900/60 p-6 border-slate-700/40 ring-1 ring-slate-700/30'
            }`}>
              
              {/* Header - Mais Compacto */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Criar Conta
                  </h2>
                  <span className="text-xs font-bold px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 rounded-full text-cyan-300">
                    {step}/3
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {step === 1
                    ? 'Entre com suas credenciais'
                    : step === 2
                    ? 'Informações da escola'
                    : 'Revise os dados'
                  }
                </p>
              </div>

              {/* Progress Indicator - Moderno */}
              <div className="flex items-center justify-between mb-6 px-1">
                {[1, 2, 3].map((number) => (
                  <div key={number} className="flex-1 flex items-center group">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 relative
                      ${step >= number
                        ? 'bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/60 scale-110'
                        : 'bg-gradient-to-br from-slate-700/60 to-slate-800/60 text-slate-400'
                      }`}>
                      {step > number ? (
                        <CheckCircle className="w-5.5 h-5.5" />
                      ) : (
                        number
                      )}
                    </div>
                    {number < 3 && (
                      <div className={`flex-1 h-1.5 mx-2 rounded-full transition-all duration-500 ${
                        step > number
                          ? 'bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 shadow-md shadow-cyan-500/40'
                          : 'bg-slate-700/40'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Step 1 - Credenciais */}
                <div className={`transition-all duration-300 ${step === 1 ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 absolute pointer-events-none'}`}>
                  <div className="space-y-3">
                    <InputField
                      label="Nome de Utilizador"
                      icon={User}
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="João Silva"
                      required
                    />

                    <InputField
                      label="Email"
                      icon={Mail}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      required
                    />

                    <div className="space-y-1.5">
                      <label className="block text-slate-300 text-xs font-semibold bg-gradient-to-r from-slate-200 to-slate-300 bg-clip-text text-transparent uppercase tracking-wider">
                        Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 transition-all duration-300 group-focus-within:text-cyan-400 group-focus-within:scale-110" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          placeholder="Mínimo 6 caracteres"
                          className="w-full px-4 py-2.5 text-sm pl-11 pr-12 bg-gradient-to-br from-slate-900/60 to-slate-800/40 border border-slate-700/50 rounded-xl text-white placeholder-slate-500/70 transition-all duration-300 focus:outline-none hover:border-slate-600/70 hover:bg-slate-900/70 focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-400/30 focus:bg-slate-900/80 focus:shadow-lg focus:shadow-cyan-400/20 focus:scale-[1.02]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
                        >
                          {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-slate-300 text-xs font-semibold bg-gradient-to-r from-slate-200 to-slate-300 bg-clip-text text-transparent uppercase tracking-wider">
                        Confirmar Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 transition-all duration-300 group-focus-within:text-cyan-400 group-focus-within:scale-110" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          placeholder="Repita sua password"
                          className="w-full px-4 py-2.5 text-sm pl-11 pr-12 bg-gradient-to-br from-slate-900/60 to-slate-800/40 border border-slate-700/50 rounded-xl text-white placeholder-slate-500/70 transition-all duration-300 focus:outline-none hover:border-slate-600/70 hover:bg-slate-900/70 focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-400/30 focus:bg-slate-900/80 focus:shadow-lg focus:shadow-cyan-400/20 focus:scale-[1.02]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 - Dados Escolares */}
                <div className={`transition-all duration-300 ${step === 2 ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 absolute pointer-events-none'}`}>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <InputField
                        label="Número"
                        icon={Hash}
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        placeholder="12345"
                        required
                      />

                      <InputField
                        label="Turma"
                        icon={GraduationCap}
                        name="turma"
                        value={formData.turma}
                        onChange={handleChange}
                        placeholder="A"
                        required
                      />
                    </div>

                    <InputField
                      label="Escola"
                      icon={School}
                      name="escola"
                      value={formData.escola}
                      onChange={handleChange}
                      placeholder="Escola Secundária..."
                      required
                    />

                    <InputField
                      label="Ano"
                      icon={Calendar}
                      name="ano"
                      value={formData.ano}
                      onChange={handleChange}
                      placeholder="12º"
                      required
                    />
                  </div>
                </div>

                {/* Step 3 - Review */}
                <div className={`transition-all duration-300 ${step === 3 ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 absolute pointer-events-none'}`}>
                  <div className="space-y-3 bg-gradient-to-br from-slate-900/50 to-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4.5 h-4.5 text-emerald-400" />
                      <h3 className="text-white font-bold text-sm">Revise seus dados</h3>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center py-2.5 px-3.5 bg-gradient-to-r from-slate-800/40 to-slate-800/20 rounded-xl border border-slate-700/40 hover:border-slate-600/50 transition-all">
                        <span className="text-slate-400 font-medium">Nome</span>
                        <span className="text-cyan-300 font-bold">{formData.username || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2.5 px-3.5 bg-gradient-to-r from-slate-800/40 to-slate-800/20 rounded-xl border border-slate-700/40 hover:border-slate-600/50 transition-all">
                        <span className="text-slate-400 font-medium">Email</span>
                        <span className="text-cyan-300 font-bold break-all text-right">{formData.email || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2.5 px-3.5 bg-gradient-to-r from-slate-800/40 to-slate-800/20 rounded-xl border border-slate-700/40 hover:border-slate-600/50 transition-all">
                        <span className="text-slate-400 font-medium">Turma</span>
                        <span className="text-cyan-300 font-bold">{formData.turma || '-'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2.5 px-3.5 bg-gradient-to-r from-slate-800/40 to-slate-800/20 rounded-xl border border-slate-700/40 hover:border-slate-600/50 transition-all">
                        <span className="text-slate-400 font-medium">Escola</span>
                        <span className="text-cyan-300 font-bold text-right">{formData.escola || '-'}</span>
                      </div>
                    </div>

                    <div className="mt-2.5 p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl">
                      <p className="text-blue-300 text-xs leading-relaxed flex items-start gap-2">
                        <span className="mt-0.5 flex-shrink-0">ℹ️</span>
                        <span>Após confirmar, será exibido um modal para escolher seu avatar</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2.5 mt-6 pt-4 border-t border-slate-700/30">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="flex-1 px-4 py-2.5 text-sm rounded-xl text-slate-300 font-bold bg-gradient-to-br from-slate-700/50 to-slate-800/40 hover:from-slate-700/70 hover:to-slate-800/60 border border-slate-600/40 hover:border-slate-600/60 transition-all duration-300 hover:text-white hover:shadow-lg hover:shadow-slate-700/30"
                    >
                      ← Voltar
                    </button>
                  )}
                  {step < 3 && (
                    <button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="flex-1 px-4 py-2.5 text-sm rounded-xl text-white font-bold bg-gradient-to-r from-cyan-500 via-cyan-500 to-cyan-600 hover:from-cyan-600 hover:via-cyan-600 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-cyan-500/40 hover:shadow-cyan-500/60 hover:shadow-xl flex items-center justify-center gap-2 group hover:scale-[1.02]"
                    >
                      Próximo <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  )}
                  {step === 3 && (
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2.5 text-sm rounded-xl text-white font-bold bg-gradient-to-r from-emerald-500 via-emerald-500 to-emerald-600 hover:from-emerald-600 hover:via-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-emerald-500/40 hover:shadow-emerald-500/60 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-[1.02]"
                    >
                      {loading ? 'Criando...' : 'Finalizar'}
                      {!loading && <CheckCircle className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700/30"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-slate-800/60 text-slate-400 font-semibold">Já tens conta?</span>
                  </div>
                </div>

                {/* Back to Login */}
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full px-4 py-2.5 text-sm rounded-xl text-slate-300 font-bold bg-gradient-to-br from-slate-700/50 to-slate-800/40 hover:from-slate-700/70 hover:to-slate-800/60 border border-slate-600/40 hover:border-slate-600/60 transition-all duration-300 hover:text-white flex items-center justify-center gap-2 group hover:shadow-lg hover:shadow-slate-700/30 hover:scale-[1.02]"
                >
                  <Lock className="w-4 h-4 transition-transform group-hover:scale-110" />
                  Fazer Login
                </button>
              </form>
            </div>

            {/* Footer */}
            <p className="text-center text-slate-500 text-xs mt-4 font-medium">
              Ao criar conta, você concorda com os <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors font-semibold">Termos de Serviço</span>
            </p>
          </div>
        </div>

        {/* Right - Hero */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-6 relative">
          <div className="relative z-10 flex items-center justify-center animate-fade-in-right">
            {/* Shapes */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-[3rem] rotate-12 -z-10 blur-3xl animate-pulse-slow"></div>
              <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-[2.5rem] -rotate-12 translate-x-12 translate-y-8 -z-20 blur-2xl"></div>
              <div className="absolute w-40 h-40 bg-cyan-400/40 rounded-2xl rotate-45 -left-16 -top-16 -z-10 blur-lg"></div>
              <div className="absolute w-32 h-32 bg-blue-400/40 rounded-xl -rotate-45 -right-12 -bottom-12 -z-10 blur-lg"></div>
            </div>

            <img
              src={HeroSection}
              alt="Hero Section"
              className="relative w-auto h-auto max-h-[600px] object-contain rounded-3xl shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes toast-slide {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .animate-toast-slide { animation: toast-slide 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-fade-in-right { animation: fade-in-right 0.8s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </>
  );
}