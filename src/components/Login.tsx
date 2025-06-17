
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn, User, Lock, Shield, Eye, EyeOff, Sparkles, Info } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-50 p-4 relative overflow-hidden">
      {/* macOS-style background elements */}
      <div className="absolute inset-0">
        {/* Subtle gradient orbs */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-80 h-80 bg-purple-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-32 right-20 w-64 h-64 bg-cyan-300/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        {/* Subtle mesh gradient */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e2e8f0' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>
      
      {/* Main login card with macOS styling */}
      <Card className="w-full max-w-md backdrop-blur-xl bg-white/80 border-white/20 shadow-2xl shadow-black/10 relative z-10 overflow-hidden">
        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-blue-50/30 pointer-events-none"></div>
        
        <CardHeader className="text-center space-y-6 pb-8 relative z-10">
          {/* macOS-style app icon */}
          <div className="mx-auto w-20 h-20 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-3xl shadow-xl shadow-blue-500/30 flex items-center justify-center transform rotate-3">
              <Shield className="w-10 h-10 text-white drop-shadow-sm" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          
          <div>
            <CardTitle className="text-3xl font-light text-slate-800 mb-2 tracking-wide">
              SGQ PRO
            </CardTitle>
            <p className="text-slate-500 text-sm font-medium">
              Sistema de Gestão da Qualidade
            </p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 mx-auto mt-4 rounded-full"></div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 px-8 pb-8 relative z-10">
          {/* Security notice */}
          <Alert className="bg-blue-50 border-blue-200 text-blue-700">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Credenciais de Administrador:</strong><br />
              Email: admin@admin.com<br />
              Senha: Pandora@1989
            </AlertDescription>
          </Alert>

          {error && (
            <Alert className="bg-red-50 border-red-200 text-red-700 backdrop-blur-sm">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-slate-700 text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" />
                Email
              </label>
              <div className="relative group">
                <Input
                  type="email"
                  placeholder="Digite seu email"
                  value={credentials.usuario}
                  onChange={(e) => setCredentials(prev => ({ ...prev, usuario: e.target.value }))}
                  className="h-12 bg-white/70 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 backdrop-blur-sm rounded-xl"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-slate-700 text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500" />
                Senha
              </label>
              <div className="relative group">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={credentials.senha}
                  onChange={(e) => setCredentials(prev => ({ ...prev, senha: e.target.value }))}
                  className="h-12 bg-white/70 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 backdrop-blur-sm rounded-xl pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-blue-500/25 border-0 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
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
        </CardContent>
      </Card>
    </div>
  );
};
