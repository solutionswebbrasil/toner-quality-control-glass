
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Users } from 'lucide-react';

const UserPermissions: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState('user');
  const [message, setMessage] = useState('');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Gerenciar Permissões</h1>
      </div>

      {message && (
        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Configurar Permissões por Role
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="role-select" className="block text-sm font-medium mb-2">Selecionar Role</label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Usuário</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Sistema de permissões será implementado futuramente.</p>
            <Button onClick={() => setMessage('Funcionalidade em desenvolvimento!')}>
              Configurar Permissões
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPermissions;
