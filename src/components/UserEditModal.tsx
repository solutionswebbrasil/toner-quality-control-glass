
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import { Usuario } from '@/types/auth';
import { Save } from 'lucide-react';

interface UserEditModalProps {
  user: Usuario | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: '',
    usuario: '',
    senha: ''
  });

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        nome_completo: user.nome_completo,
        usuario: user.usuario,
        senha: ''
      });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    setLoading(true);

    try {
      const updateData: any = {
        nome_completo: formData.nome_completo,
        usuario: formData.usuario
      };

      // Só incluir senha se foi preenchida
      if (formData.senha.trim()) {
        updateData.senha = formData.senha;
      }

      await authService.updateUser(user.id, updateData);

      toast({
        title: "Sucesso!",
        description: "Dados do usuário atualizados com sucesso.",
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar dados do usuário.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Dados do Usuário</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome_completo">Nome Completo</Label>
            <Input
              id="nome_completo"
              value={formData.nome_completo}
              onChange={(e) => setFormData(prev => ({ ...prev, nome_completo: e.target.value }))}
              placeholder="Digite o nome completo"
              required
            />
          </div>

          <div>
            <Label htmlFor="usuario">Nome de Usuário</Label>
            <Input
              id="usuario"
              value={formData.usuario}
              onChange={(e) => setFormData(prev => ({ ...prev, usuario: e.target.value }))}
              placeholder="Digite o nome de usuário"
              required
            />
          </div>

          <div>
            <Label htmlFor="senha">Nova Senha (opcional)</Label>
            <Input
              id="senha"
              type="password"
              value={formData.senha}
              onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
              placeholder="Deixe em branco para manter a atual"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
