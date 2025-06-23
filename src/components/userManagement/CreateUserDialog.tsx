
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
      
      // Criar usuário no Supabase Auth
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
        
        // Tratar erros específicos
        if (error.message.includes('User already registered')) {
          onError('Este email já está cadastrado no sistema');
        } else if (error.message.includes('Invalid email')) {
          onError('Email inválido');
        } else {
          onError('Erro ao criar usuário: ' + error.message);
        }
        return;
      }

      if (data.user) {
        console.log('Usuário criado no Auth:', data.user.email);
        console.log('ID do usuário:', data.user.id);
        
        // Aguardar um momento para o trigger funcionar (se existir)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verificar se o profile foi criado automaticamente
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (!existingProfile) {
          console.log('Profile não encontrado, criando manualmente...');
          
          // Criar profile diretamente na tabela
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: newUser.email,
              nome_completo: newUser.nome_completo,
              role: newUser.role
            });

          if (profileError) {
            console.error('Erro ao criar profile:', profileError);
            onError('Usuário criado, mas houve erro ao criar o perfil: ' + profileError.message);
            return;
          } else {
            console.log('Profile criado manualmente com sucesso');
          }
        } else {
          console.log('Profile já existe:', existingProfile);
        }

        onSuccess(`Usuário ${newUser.email} criado com sucesso!`);
        
        // Limpar formulário
        setNewUser({ email: '', password: '', nome_completo: '', role: 'user' });
        onOpenChange(false);
        
        // Atualizar lista após um pequeno delay
        setTimeout(() => {
          onRefresh();
        }, 1500);
      }
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
          <div className="flex gap-2">
            <Button onClick={createUser} disabled={creating}>
              {creating ? 'Criando...' : 'Criar Usuário'}
            </Button>
            <Button variant="outline" onClick={handleClose} disabled={creating}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
