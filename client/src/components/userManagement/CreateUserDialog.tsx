import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onRefresh: () => void;
}

export const CreateUserDialog: React.FC<CreateUserDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  onError,
  onRefresh
}) => {
  const [newUser, setNewUser] = useState({ email: '', password: '', nome_completo: '', role: 'user' });
  const [creating, setCreating] = useState(false);

  const createUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.nome_completo) {
      onError('Preencha todos os campos obrigatórios');
      return;
    }

    if (newUser.password.length < 6) {
      onError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setCreating(true);

    try {
      console.log('Criando usuário:', newUser.email);
      
      // Simular criação de usuário (implementar com backend real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSuccess('Usuário criado com sucesso!');
      onRefresh();
      handleClose();
    } catch (error) {
      console.error('Erro interno ao criar usuário:', error);
      onError('Erro interno ao criar usuário');
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    if (!creating) {
      setNewUser({ email: '', password: '', nome_completo: '', role: 'user' });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={newUser.nome_completo}
              onChange={(e) => setNewUser(prev => ({ ...prev, nome_completo: e.target.value }))}
              placeholder="Digite o nome completo"
              disabled={creating}
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Digite o email"
              disabled={creating}
            />
          </div>
          <div>
            <Label htmlFor="password">Senha *</Label>
            <Input
              id="password"
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Mínimo 6 caracteres"
              disabled={creating}
            />
          </div>
          <div>
            <Label htmlFor="role">Função</Label>
            <Select 
              value={newUser.role} 
              onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}
              disabled={creating}
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
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClose} disabled={creating}>
              Cancelar
            </Button>
            <Button onClick={createUser} disabled={creating}>
              {creating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Criando...
                </div>
              ) : (
                'Criar Usuário'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};