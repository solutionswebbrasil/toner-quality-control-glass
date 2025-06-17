
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Users, Crown, User, Trash2, AlertTriangle } from 'lucide-react';

interface Profile {
  id: string;
  nome_completo: string;
  email: string;
  role: string;
  created_at: string;
}

export const UserManagementNew: React.FC = () => {
  const { profile, hasPermission } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Verificar se o usuário tem permissão para gerenciar usuários
  if (!hasPermission('Configurações', 'Usuários', 'visualizar')) {
    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Você não tem permissão para acessar o gerenciamento de usuários.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError('Erro ao carregar usuários');
        console.error('Erro:', error);
      } else {
        setProfiles(data || []);
      }
    } catch (error) {
      setError('Erro interno');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário ${userEmail}?`)) {
      return;
    }

    try {
      // Primeiro deletar o perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        setError('Erro ao excluir perfil do usuário');
        console.error('Erro:', profileError);
        return;
      }

      // Recarregar lista
      loadProfiles();
    } catch (error) {
      setError('Erro interno');
      console.error('Erro:', error);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Crown className="h-3 w-3" />
            Admin
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <User className="h-3 w-3" />
            Usuário
          </Badge>
        );
    }
  };

  if (loading) {
    return <div className="p-6">Carregando usuários...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
        </div>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Alert className="bg-blue-50 border-blue-200 text-blue-700">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Como criar usuários:</strong><br />
          1. Novos usuários devem se cadastrar usando a tela de login<br />
          2. Use o email "admin@sgqpro.com" para criar contas de administrador automaticamente<br />
          3. Outros emails criarão contas de usuário comum
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        {profiles.map((userProfile) => (
          <Card key={userProfile.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{userProfile.nome_completo}</h3>
                    {getRoleBadge(userProfile.role)}
                  </div>
                  <p className="text-sm text-gray-600">{userProfile.email}</p>
                  <p className="text-xs text-gray-500">
                    Criado em: {new Date(userProfile.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {userProfile.role !== 'admin' && profile?.role === 'admin' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteUser(userProfile.id, userProfile.email)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {profiles.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhum usuário encontrado</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
