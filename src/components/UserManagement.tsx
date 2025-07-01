
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Settings } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [message, setMessage] = useState('');

  const mockUsers = [
    {
      id: '1',
      nome_completo: 'Administrador do Sistema',
      email: 'admin@sistema.com',
      role: 'admin',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      nome_completo: 'Usuário Teste',
      email: 'usuario@teste.com',
      role: 'user',
      created_at: new Date().toISOString()
    }
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">Admin</Badge>;
      default:
        return <Badge variant="secondary">Usuário</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
          <Badge variant="outline">{mockUsers.length} usuários</Badge>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setMessage('Funcionalidade em desenvolvimento!')}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Configurações
          </Button>

          <Button
            onClick={() => setMessage('Redirecionando para cadastro de usuário...')}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Criar Usuário
          </Button>
        </div>
      </div>

      {message && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">{message}</p>
        </div>
      )}

      <div className="grid gap-4">
        {mockUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{user.nome_completo}</h3>
                    {getRoleBadge(user.role)}
                  </div>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500">
                    Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMessage(`Editando usuário: ${user.nome_completo}`)}
                  >
                    Editar
                  </Button>
                  
                  {user.role !== 'admin' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setMessage(`Excluindo usuário: ${user.nome_completo}`)}
                    >
                      Excluir
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
