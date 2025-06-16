
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn, User, Lock, Shield } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    usuario: '',
    senha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gray-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      <Card className="w-full max-w-md backdrop-blur-xl bg-gray-900/40 border-gray-700/50 shadow-2xl shadow-black/50 relative z-10">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-600 via-gray-800 to-black rounded-full flex items-center justify-center shadow-lg shadow-black/50">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-white mb-2">
              SGQ PRO
            </CardTitle>
            <p className="text-gray-300 text-sm font-medium">
              Sistema de Gestão da Qualidade
            </p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-gray-600 to-gray-400 mx-auto mt-3"></div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 px-8 pb-8">
          {error && (
            <Alert className="bg-red-900/30 border-red-700/50 text-red-200">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-gray-200 text-sm font-medium tracking-wide">Usuário</label>
              <div className="relative group">
                <User className="absolute left-4 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-white transition-colors" />
                <Input
                  type="text"
                  placeholder="Digite seu usuário"
                  value={credentials.usuario}
                  onChange={(e) => setCredentials(prev => ({ ...prev, usuario: e.target.value }))}
                  className="pl-12 h-12 bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all duration-200"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-gray-200 text-sm font-medium tracking-wide">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-white transition-colors" />
                <Input
                  type="password"
                  placeholder="Digite sua senha"
                  value={credentials.senha}
                  onChange={(e) => setCredentials(prev => ({ ...prev, senha: e.target.value }))}
                  className="pl-12 h-12 bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all duration-200"
                  required
                />
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-black/30 border border-gray-600/30"
            >
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
          
          <div className="text-center text-xs text-gray-400 bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
            <p className="font-medium mb-2 text-gray-300">Credenciais de Teste:</p>
            <div className="space-y-1">
              <p><span className="text-gray-500">Usuário:</span> <span className="text-white font-mono">admin.admin</span></p>
              <p><span className="text-gray-500">Senha:</span> <span className="text-white font-mono">admin123</span></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
