
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';

interface Permission {
  id: string;
  role: string;
  modulo: string;
  submenu: string;
  pode_visualizar: boolean;
  pode_editar: boolean;
  pode_excluir: boolean;
}

interface PermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onError: (message: string) => void;
}

export const PermissionsDialog: React.FC<PermissionsDialogProps> = ({
  open,
  onOpenChange,
  onError
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState('user');

  useEffect(() => {
    if (open) {
      loadPermissions();
    }
  }, [open]);

  const loadPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('modulo', { ascending: true });

      if (error) {
        console.error('Erro ao carregar permissões:', error);
      } else {
        setPermissions(data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
    }
  };

  const updatePermission = async (permissionId: string, field: keyof Permission, value: boolean) => {
    try {
      const { error } = await supabase
        .from('permissions')
        .update({ [field]: value })
        .eq('id', permissionId);

      if (error) {
        onError('Erro ao atualizar permissão');
        console.error('Erro:', error);
        return;
      }

      setPermissions(prev => prev.map(p => 
        p.id === permissionId ? { ...p, [field]: value } : p
      ));
    } catch (error) {
      onError('Erro interno');
      console.error('Erro:', error);
    }
  };

  const rolePermissions = permissions.filter(p => p.role === selectedRole);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Permissões</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="role-select">Selecionar Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Usuário</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="max-h-96 overflow-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 text-left">Módulo</th>
                  <th className="border border-gray-300 p-2 text-left">Submenu</th>
                  <th className="border border-gray-300 p-2 text-center">Ver</th>
                  <th className="border border-gray-300 p-2 text-center">Editar</th>
                  <th className="border border-gray-300 p-2 text-center">Excluir</th>
                </tr>
              </thead>
              <tbody>
                {rolePermissions.map((permission) => (
                  <tr key={permission.id}>
                    <td className="border border-gray-300 p-2">{permission.modulo}</td>
                    <td className="border border-gray-300 p-2">{permission.submenu}</td>
                    <td className="border border-gray-300 p-2 text-center">
                      <Switch
                        checked={permission.pode_visualizar}
                        onCheckedChange={(checked) => 
                          updatePermission(permission.id, 'pode_visualizar', checked)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <Switch
                        checked={permission.pode_editar}
                        onCheckedChange={(checked) => 
                          updatePermission(permission.id, 'pode_editar', checked)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <Switch
                        checked={permission.pode_excluir}
                        onCheckedChange={(checked) => 
                          updatePermission(permission.id, 'pode_excluir', checked)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
