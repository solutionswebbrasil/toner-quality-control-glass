
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface Profile {
  id: string;
  nome_completo: string;
  email: string;
  role: string;
  created_at: string;
}

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Profile | null;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onRefresh: () => void;
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({
  open,
  onOpenChange,
  user,
  onSuccess,
  onError,
  onRefresh
}) => {
  const [editingUser, setEditingUser] = useState<Profile | null>(null);

  useEffect(() => {
    if (user) {
      setEditingUser({ ...user });
    }
  }, [user]);

  const updateUser = async () => {
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nome_completo: editingUser.nome_completo,
          email: editingUser.email,
          role: editingUser.role
        })
        .eq('id', editingUser.id);

      if (error) {
        onError('Erro ao atualizar usuário');
        console.error('Erro:', error);
        return;
      }

      onSuccess('Usuário atualizado com sucesso!');
      onOpenChange(false);
      setEditingUser(null);
      onRefresh();
    } catch (error) {
      onError('Erro interno');
      console.error('Erro:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        {editingUser && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome Completo</Label>
              <Input
                id="edit-name"
                value={editingUser.nome_completo}
                onChange={(e) => setEditingUser(prev => prev ? { ...prev, nome_completo: e.target.value } : null)}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)}
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Role</Label>
              <Select 
                value={editingUser.role} 
                onValueChange={(value) => setEditingUser(prev => prev ? { ...prev, role: value } : null)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={updateUser}>Salvar</Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
