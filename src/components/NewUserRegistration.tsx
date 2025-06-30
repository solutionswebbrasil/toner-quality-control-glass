
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, AlertTriangle } from 'lucide-react';

const NewUserRegistration: React.FC = () => {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    nome_completo: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Verificar se é admin
  if (profile?.role !== 'admin') {
    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Você não tem permissão para acessar esta página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.nome_completo.trim()) {
      setMessage('Nome completo é obrigatório');
      return false;
    }
    if (!formData.email.trim()) {
      setMessage('Email é obrigatório');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setMessage('Senha deve ter pelo menos 6 caracteres');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMessage('Email deve ter um formato válido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      console.log('Criando usuário:', formData.email);

      // Criar usuário usando Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            nome_completo: formData.nome_completo,
            role: formData.role
          }
        }
      });

      if (error) {
        console.error('Erro ao criar usuário:', error);
        setMessage(`Erro ao criar usuário: ${error.message}`);
        return;
      }

      if (data.user) {
        console.log('Usuário criado com sucesso:', data.user.email);
        
        // Tentar criar o profile manualmente após um delay
        setTimeout(async () => {
          try {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: data.user!.id,
                email: formData.email,
                nome_completo: formData.nome_completo,
                role: formData.role
              });

            if (profileError) {
              console.log('Profile pode já existir ou será criado automaticamente:', profileError);
            }
          } catch (profileErr) {
            console.log('Erro ao criar profile manualmente:', profileErr);
          }
        }, 2000);

        setMessage('Usuário criado com sucesso! O usuário receberá um email de confirmação.');
        
        // Limpar formulário
        setFormData({
          nome_completo: '',
          email: '',
          password: '',
          role: 'user'
        });
      }
    } catch (error) {
      console.error('Erro interno:', error);
      setMessage('Erro interno ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <UserPlus className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Cadastrar Novo Usuário</h1>
      </div>

      {message && (
        <Alert className={message.includes('Erro') ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Informações do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome_completo">Nome Completo *</Label>
              <Input
                id="nome_completo"
                type="text"
                value={formData.nome_completo}
                onChange={(e) => handleInputChange('nome_completo', e.target.value)}
                placeholder="Digite o nome completo"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Digite o email"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div>
              <Label htmlFor="role">Tipo de Usuário</Label>
              <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar Usuário'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewUserRegistration;
