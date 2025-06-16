
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn, User, Lock, Shield, Eye, EyeOff, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    usuario: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(credentials);
    
    if (!result.success) {
      setError(result.error || 'Erro ao fazer login');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black p-4 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-32 h-32 bg-purple-500/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-32 right-20 w-36 h-36 bg-cyan-500/15 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        {/* Subtle radial gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-white/5 via-transparent to-transparent"></div>
      </div>
      
      {/* Main login card */}
      <Card className="w-full max-w-md backdrop-blur-2xl bg-slate-900/60 border-slate-700/30 shadow-2xl shadow-black/50 relative z-10 overflow-hidden">
        {/* Card glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-cyan-500/10 blur-xl"></div>
        
        <CardHeader className="text-center space-y-6 pb-8 relative z-10">
          {/* Enhanced logo */}
          <div className="mx-auto w-24 h-24 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center">
              <Shield className="w-12 h-12 text-white drop-shadow-lg" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-3">
              SGQ PRO
            </CardTitle>
            <p className="text-slate-300 text-base font-medium tracking-wide">
              Sistema de Gestão da Qualidade
            </p>
            <div className="w-32 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 mx-auto mt-4 rounded-full"></div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 px-8 pb-8 relative z-10">
          {error && (
            <Alert className="bg-red-900/40 border-red-600/50 text-red-200 backdrop-blur-sm">
              <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-slate-200 text-sm font-semibold tracking-wide flex items-center gap-2">
                <User className="w-4 h-4" />
                Usuário
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-sm group-focus-within:blur-md transition-all duration-300"></div>
                <Input
                  type="text"
                  placeholder="Digite seu usuário"
                  value={credentials.usuario}
                  onChange={(e) => setCredentials(prev => ({ ...prev, usuario: e.target.value }))}
                  className="relative h-12 bg-slate-800/60 border-slate-600/40 text-white placeholder:text-slate-400 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 backdrop-blur-sm"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-slate-200 text-sm font-semibold tracking-wide flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Senha
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur-sm group-focus-within:blur-md transition-all duration-300"></div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={credentials.senha}
                  onChange={(e) => setCredentials(prev => ({ ...prev, senha: e.target.value }))}
                  className="relative h-12 bg-slate-800/60 border-slate-600/40 text-white placeholder:text-slate-400 focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/30 transition-all duration-300 backdrop-blur-sm pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-blue-500/25 border border-slate-600/20 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Entrar
                </>
              )}
            </Button>
          </form>
          
          {/* Enhanced credentials card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800/40 to-slate-700/40 rounded-xl blur-sm"></div>
            <div className="relative bg-slate-800/60 backdrop-blur-sm p-6 rounded-xl border border-slate-700/40">
              <div className="text-center">
                <p className="font-semibold mb-3 text-slate-200 flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  Credenciais de Teste
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-slate-900/40 p-3 rounded-lg">
                    <span className="text-slate-400 text-sm">Usuário:</span> 
                    <span className="text-white font-mono font-semibold">admin.admin</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-900/40 p-3 rounded-lg">
                    <span className="text-slate-400 text-sm">Senha:</span> 
                    <span className="text-white font-mono font-semibold">admin123</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
