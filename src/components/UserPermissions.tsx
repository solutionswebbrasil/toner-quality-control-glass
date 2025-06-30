
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Users, AlertTriangle } from 'lucide-react';

interface Permission {
  id: string;
  role: string;
  modulo: string;
  submenu: string;
  pode_visualizar: boolean;
  pode_editar: boolean;
  pode_excluir: boolean;
}

const UserPermissions: React.FC = () => {
  const { profile } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState('user');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    loadPermissions();
  }, [selectedRole]);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .eq('role', selectedRole)
        .order('modulo', { ascending: true });

      if (error) {
        console.error('Erro ao carregar permissões:', error);
        setMessage('Erro ao carregar permissões');
      } else {
        setPermissions(data || []);
      }
    } catch (error) {
      console.error('Erro:', error);
      setMessage('Erro interno');
    } finally {
      setLoading(false);
    }
  };

  const updatePermission = async (permissionId: string, field: keyof Permission, value: boolean) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('permissions')
        .update({ [field]: value })
        .eq('id', permissionId);

      if (error) {
        console.error('Erro ao atualizar permissão:', error);
        setMessage('Erro ao atualizar permissão');
      } else {
        setPermissions(prev => prev.map(p => 
          p.id === permissionId ? { ...p, [field]: value } : p
        ));
        setMessage('Permissão atualizada com sucesso!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Erro:', error);
      setMessage('Erro interno');
    } finally {
      setSaving(false);
    }
  };

  const createDefaultPermissions = async () => {
    try {
      setSaving(true);
      
      // Módulos e submenus padrão
      const defaultModules = [
        { modulo: 'Retornados', submenu: 'Registro' },
        { modulo: 'Retornados', submenu: 'Consulta' },
        { modulo: 'Retornados', submenu: 'Gráficos' },
        { modulo: 'Fornecedores', submenu: 'Cadastro' },
        { modulo: 'Fornecedores', submenu: 'Consulta' },
        { modulo: 'Garantias', submenu: 'Registro' },
        { modulo: 'Garantias', submenu: 'Consulta' },
        { modulo: 'Garantias', submenu: 'Gráficos Gerais' },
        { modulo: 'Garantias', submenu: 'Garantias Toners' },
        { modulo: 'Toners', submenu: 'Cadastro' },
        { modulo: 'Toners', submenu: 'Consulta' },
        { modulo: 'Auditorias', submenu: 'Registro' },
        { modulo: 'Auditorias', submenu: 'Consulta' },
        { modulo: 'Não Conformidades', submenu: 'Registro' },
        { modulo: 'Não Conformidades', submenu: 'Consulta' },
        { modulo: 'Não Conformidades', submenu: 'Gráficos' },
        { modulo: 'IT/POP', submenu: 'Título Cadastro' },
        { modulo: 'IT/POP', submenu: 'Título Consulta' },
        { modulo: 'IT/POP', submenu: 'Registro' },
        { modulo: 'IT/POP', submenu: 'Registros Consulta' },
        { modulo: 'IT/POP', submenu: 'Visualizar' },
        { modulo: 'BPMN', submenu: 'Título Cadastro' },
        { modulo: 'BPMN', submenu: 'Título Consulta' },
        { modulo: 'BPMN', submenu: 'Registro' },
        { modulo: 'BPMN', submenu: 'Registros Consulta' },
        { modulo: 'BPMN', submenu: 'Visualizar' },
        { modulo: 'Certificados', submenu: 'Registro' },
        { modulo: 'Certificados', submenu: 'Consulta' },
        { modulo: 'Configurações', submenu: 'Filiais Cadastro' },
        { modulo: 'Configurações', submenu: 'Filiais Consulta' },
        { modulo: 'Configurações', submenu: 'Retornado' },
        { modulo: 'Configurações', submenu: 'Cadastro de Status' },
        { modulo: 'Configurações', submenu: 'APIs de Integrações' },
        { modulo: 'Configurações', submenu: 'Usuários' },
        { modulo: 'Configurações', submenu: 'Permissões' }
      ];

      for (const module of defaultModules) {
        const { error } = await supabase
          .from('permissions')
          .upsert({
            role: selectedRole,
            modulo: module.modulo,
            submenu: module.submenu,
            pode_visualizar: selectedRole === 'admin',
            pode_editar: selectedRole === 'admin',
            pode_excluir: selectedRole === 'admin'
          }, {
            onConflict: 'role,modulo,submenu'
          });

        if (error) {
          console.error('Erro ao criar permissão padrão:', error);
        }
      }

      await loadPermissions();
      setMessage('Permissões padrão criadas com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erro:', error);
      setMessage('Erro ao criar permissões padrão');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Gerenciar Permissões</h1>
      </div>

      {message && (
        <Alert className={message.includes('Erro') ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
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
            <Label htmlFor="role-select">Selecionar Role</Label>
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

          {permissions.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Nenhuma permissão encontrada para este role.</p>
              <Button onClick={createDefaultPermissions} disabled={saving}>
                {saving ? 'Criando...' : 'Criar Permissões Padrão'}
              </Button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2">Carregando permissões...</p>
            </div>
          ) : permissions.length > 0 && (
            <div className="overflow-auto max-h-96">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-3 text-left font-medium">Módulo</th>
                    <th className="border border-gray-300 p-3 text-left font-medium">Submenu</th>
                    <th className="border border-gray-300 p-3 text-center font-medium">Visualizar</th>
                    <th className="border border-gray-300 p-3 text-center font-medium">Editar</th>
                    <th className="border border-gray-300 p-3 text-center font-medium">Excluir</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((permission) => (
                    <tr key={permission.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-3">{permission.modulo}</td>
                      <td className="border border-gray-300 p-3">{permission.submenu}</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Switch
                          checked={permission.pode_visualizar}
                          onCheckedChange={(checked) => 
                            updatePermission(permission.id, 'pode_visualizar', checked)
                          }
                          disabled={saving}
                        />
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Switch
                          checked={permission.pode_editar}
                          onCheckedChange={(checked) => 
                            updatePermission(permission.id, 'pode_editar', checked)
                          }
                          disabled={saving}
                        />
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <Switch
                          checked={permission.pode_excluir}
                          onCheckedChange={(checked) => 
                            updatePermission(permission.id, 'pode_excluir', checked)
                          }
                          disabled={saving}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPermissions;
