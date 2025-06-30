import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Loader2, LogIn, Eye, EyeOff, Shield, Sparkles } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { signIn, loading } = useAuth();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Atualizar posição do mouse para efeitos interativos
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('Tentativa de login:', loginData.email);
    const result = await signIn(loginData.email, loginData.password);
    
    if (result.error) {
      setError(result.error);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
    >
      {/* Fundo tecnológico interativo */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid dinâmico */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        
        {/* Círculos tecnológicos */}
        <div 
          className="absolute w-96 h-96 rounded-full border border-blue-400/20"
          style={{
            top: '10%',
            left: '20%',
            transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px) rotate(${mousePosition.x * 0.1}deg)`,
            transition: 'transform 0.4s ease-out'
          }}
        />
        <div 
          className="absolute w-72 h-72 rounded-full border border-cyan-400/15"
          style={{
            top: '60%',
            right: '15%',
            transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px) rotate(${mousePosition.x * -0.08}deg)`,
            transition: 'transform 0.5s ease-out'
          }}
        />
        <div 
          className="absolute w-64 h-64 rounded-full border border-purple-400/10"
          style={{
            bottom: '20%',
            left: '10%',
            transform: `translate(${mousePosition.x * 0.04}px, ${mousePosition.y * 0.04}px) rotate(${mousePosition.y * 0.1}deg)`,
            transition: 'transform 0.6s ease-out'
          }}
        />

        {/* Pontos flutuantes */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            style={{
              top: `${20 + (i * 7)}%`,
              left: `${10 + (i * 8)}%`,
              transform: `translate(${mousePosition.x * (0.02 + i * 0.001)}px, ${mousePosition.y * (0.02 + i * 0.001)}px)`,
              transition: `transform ${0.3 + i * 0.1}s ease-out`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}

        {/* Linhas de conexão */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <line 
            x1="20%" y1="30%" 
            x2="80%" y2="70%" 
            stroke="url(#lineGradient)" 
            strokeWidth="1"
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
              transition: 'transform 0.4s ease-out'
            }}
          />
          <line 
            x1="10%" y1="80%" 
            x2="70%" y2="20%" 
            stroke="url(#lineGradient)" 
            strokeWidth="1"
            style={{
              transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
              transition: 'transform 0.5s ease-out'
            }}
          />
        </svg>

        {/* Efeito de brilho seguindo o mouse */}
        <div 
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)`,
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease-out',
            pointerEvents: 'none'
          }}
        />
      </div>
      
      <Card className="w-full max-w-md backdrop-blur-xl bg-black/40 border-white/10 shadow-2xl shadow-black/20 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-blue-500/5 pointer-events-none" />
        
        <CardHeader className="text-center space-y-6 pb-8 relative z-10">
          <div className="mx-auto w-20 h-20 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-3xl shadow-xl shadow-blue-500/30 flex items-center justify-center transform rotate-3">
              <Shield className="w-10 h-10 text-white drop-shadow-sm" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          
          <div>
            <CardTitle className="text-3xl font-light text-white mb-2 tracking-wide">
              SGQ PRO
            </CardTitle>
            <p className="text-slate-300 text-sm font-medium">
              Sistema de Gestão da Qualidade
            </p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 mx-auto mt-4 rounded-full" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 px-8 pb-8 relative z-10">
          {error && (
            <Alert className="bg-red-900/20 border-red-500/30 text-red-300">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-white">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="Digite seu email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="login-password" className="text-white">Senha</Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
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
        </CardContent>
      </Card>
    </div>
  );
};
