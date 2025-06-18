
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

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

  const createUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.nome_completo) {
      onError('Preencha todos os campos obrigatórios');
      return;
    }

    if (newUser.password.length < 6) {
      onError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      console.log('Criando usuário:', newUser.email);
      
      const { data, error } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            nome_completo: newUser.nome_completo,
            role: newUser.role
          }
        }
      });

      if (error) {
        console.error('Erro ao criar usuário:', error);
        onError('Erro ao criar usuário: ' + error.message);
        return;
      }

      if (data.user) {
        console.log('Usuário criado:', data.user.email);
        
        setTimeout(async () => {
          try {
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', data.user!.id)
              .single();

            if (!existingProfile) {
              console.log('Criando profile manualmente...');
              await supabase
                .from('profiles')
                .insert({
                  id: data.user!.id,
                  email: newUser.email,
                  nome_completo: newUser.nome_completo,
                  role: newUser.role
                });
            }

            await onRefresh();
          } catch (syncError) {
            console.error('Erro na sincronização manual:', syncError);
          }
        }, 2000);

        onSuccess('Usuário criado com sucesso! O usuário receberá um email de confirmação.');
        setNewUser({ email: '', password: '', nome_completo: '', role: 'user' });
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Erro interno ao criar usuário:', error);
      onError('Erro interno ao criar usuário');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
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
            <Button onClick={createUser}>Criar Usuário</Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
