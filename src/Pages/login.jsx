import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import logo from '../Assets/logo.png';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { username, password });
  };

  const handleCreateAccount = () => {
    console.log('Redirect to create account');
    // Aqui você pode adicionar a navegação para a página de registro
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <img src={logo} alt="CodeQuestPOO RP Logo" className="mx-auto w-150 h-55 mb-4" />
          </div>

          {/* Login Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-4xl shadow-2xl p-10 border border-slate-700/50">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 animate-bounce">Bem-vindo de Volta</h2>
              <p className="text-slate-400 text-sm">
                Entre com suas credenciais para aceder sua conta
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Input */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Utilizador
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="João Silva"
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
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3.5 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 flex items-center justify-center gap-2 mt-6"
              >
                <Lock className="w-5 h-5" />
                Entrar
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

      {/* Right Side - Image Area (Placeholder) */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
        <div className="w-full h-full flex items-center justify-center">
          {/* Aqui você pode adicionar suas imagens */}
          <div className="text-slate-600 text-center">
            <p className="text-2xl mb-4">Espaço para imagem</p>
            <p className="text-sm">Adicione sua imagem aqui</p>
          </div>
        </div>
      </div>
    </div>
  );
}