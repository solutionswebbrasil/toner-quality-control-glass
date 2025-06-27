
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { signIn, loading } = useAuth();
  const [loginData, setLoginData] = useState({ usuario: '', senha: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('Tentativa de login:', loginData.usuario);
    const result = await signIn(loginData.usuario, loginData.senha);
    
    if (result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 classic-reset">
      <div className="classic-login">
        <h1>Sistema de Gestão da Qualidade</h1>
        
        {error && (
          <div style={{ 
            background: '#f8d7da', 
            border: '1px solid #f5c6cb', 
            color: '#721c24', 
            padding: '8px 12px', 
            marginBottom: '15px',
            fontSize: '12px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '12px' }}>
            <Label htmlFor="login-usuario" style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600' }}>
              Usuário
            </Label>
            <Input
              id="login-usuario"
              type="text"
              value={loginData.usuario}
              onChange={(e) => setLoginData(prev => ({ ...prev, usuario: e.target.value }))}
              className="classic-input w-full"
              style={{ width: '100%' }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <Label htmlFor="login-senha" style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '600' }}>
              Senha
            </Label>
            <div style={{ position: 'relative' }}>
              <Input
                id="login-senha"
                type={showPassword ? "text" : "password"}
                value={loginData.senha}
                onChange={(e) => setLoginData(prev => ({ ...prev, senha: e.target.value }))}
                className="classic-input w-full"
                style={{ width: '100%', paddingRight: '30px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                  fontSize: '14px'
                }}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={!loginData.usuario || !loginData.senha || loading}
            className="classic-btn-primary w-full"
            style={{ width: '100%', padding: '6px 12px' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={14} style={{ marginRight: '6px' }} />
                Entrando...
              </span>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
        
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          background: '#f8f9fa', 
          border: '1px solid #dee2e6',
          fontSize: '11px'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '6px' }}>Credenciais de acesso:</div>
          <div style={{ marginBottom: '2px' }}>
            <strong>Usuário:</strong> admin.admin
          </div>
          <div>
            <strong>Senha:</strong> admin123
          </div>
        </div>
      </div>
    </div>
  );
};
