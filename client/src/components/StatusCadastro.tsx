
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, Settings, Trash2, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StatusConfig {
  id: number;
  status_nome: string;
  modulo: string;
  cor: string;
  ordem: number;
  ativo: boolean;
}

const MODULOS_DISPONIVEIS = [
  'Garantias',
  'Não Conformidades',
  'Auditorias',
  'Retornados'
];

export const StatusCadastro: React.FC = () => {
  const [statusConfigs, setStatusConfigs] = useState<StatusConfig[]>([]);
  const [novoStatus, setNovoStatus] = useState({
    status_nome: '',
    modulo: '',
    cor: '#6B7280'
  });
  const [editandoStatus, setEditandoStatus] = useState<StatusConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarStatusConfigs();
  }, []);

  const carregarStatusConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('status_configuracoes')
        .select('*')
        .order('modulo', { ascending: true })
        .order('ordem', { ascending: true });

      if (error) {
        console.error('Erro ao carregar status:', error);
        return;
      }

      setStatusConfigs(data || []);
    } catch (error) {
      console.error('Erro ao carregar status:', error);
    } finally {
      setLoading(false);
    }
  };

  const criarStatus = async () => {
    if (!novoStatus.status_nome || !novoStatus.modulo) {
      toast({
        title: 'Erro',
        description: 'Preencha nome e módulo do status.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('status_configuracoes')
        .insert([{
          status_nome: novoStatus.status_nome,
          modulo: novoStatus.modulo,
          cor: novoStatus.cor,
          ordem: statusConfigs.filter(s => s.modulo === novoStatus.modulo).length + 1
        }]);

      if (error) {
        console.error('Erro ao criar status:', error);
        return;
      }

      toast({
        title: 'Sucesso',
        description: 'Status criado com sucesso!',
      });

      setNovoStatus({ status_nome: '', modulo: '', cor: '#6B7280' });
      carregarStatusConfigs();
    } catch (error) {
      console.error('Erro ao criar status:', error);
    }
  };

  const atualizarStatus = async () => {
    if (!editandoStatus) return;

    try {
      const { error } = await supabase
        .from('status_configuracoes')
        .update({
          status_nome: editandoStatus.status_nome,
          cor: editandoStatus.cor
        })
        .eq('id', editandoStatus.id);

      if (error) {
        console.error('Erro ao atualizar status:', error);
        return;
      }

      toast({
        title: 'Sucesso',
        description: 'Status atualizado com sucesso!',
      });

      setEditandoStatus(null);
      carregarStatusConfigs();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const excluirStatus = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este status?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('status_configuracoes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir status:', error);
        return;
      }

      toast({
        title: 'Sucesso',
        description: 'Status excluído com sucesso!',
      });

      carregarStatusConfigs();
    } catch (error) {
      console.error('Erro ao excluir status:', error);
    }
  };

  const alternarAtivo = async (id: number, ativo: boolean) => {
    try {
      const { error } = await supabase
        .from('status_configuracoes')
        .update({ ativo: !ativo })
        .eq('id', id);

      if (error) {
        console.error('Erro ao alterar status:', error);
        return;
      }

      carregarStatusConfigs();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Configuração de Status</h1>
      </div>

      {/* Formulário para criar novo status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editandoStatus ? 'Editar Status' : 'Criar Novo Status'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="status_nome">Nome do Status</Label>
              <Input
                id="status_nome"
                value={editandoStatus ? editandoStatus.status_nome : novoStatus.status_nome}
                onChange={(e) => {
                  if (editandoStatus) {
                    setEditandoStatus({ ...editandoStatus, status_nome: e.target.value });
                  } else {
                    setNovoStatus({ ...novoStatus, status_nome: e.target.value });
                  }
                }}
                placeholder="Ex: Em Andamento"
              />
            </div>

            {!editandoStatus && (
              <div>
                <Label htmlFor="modulo">Módulo</Label>
                <Select
                  value={novoStatus.modulo}
                  onValueChange={(value) => setNovoStatus({ ...novoStatus, modulo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o módulo" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODULOS_DISPONIVEIS.map((modulo) => (
                      <SelectItem key={modulo} value={modulo}>
                        {modulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="cor">Cor</Label>
              <Input
                id="cor"
                type="color"
                value={editandoStatus ? editandoStatus.cor : novoStatus.cor}
                onChange={(e) => {
                  if (editandoStatus) {
                    setEditandoStatus({ ...editandoStatus, cor: e.target.value });
                  } else {
                    setNovoStatus({ ...novoStatus, cor: e.target.value });
                  }
                }}
              />
            </div>

            <div className="flex items-end">
              {editandoStatus ? (
                <div className="flex gap-2">
                  <Button onClick={atualizarStatus}>
                    Salvar
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditandoStatus(null)}
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button onClick={criarStatus}>
                  Criar Status
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de status por módulo */}
      {MODULOS_DISPONIVEIS.map((modulo) => {
        const statusDoModulo = statusConfigs.filter(s => s.modulo === modulo);
        
        if (statusDoModulo.length === 0) return null;

        return (
          <Card key={modulo}>
            <CardHeader>
              <CardTitle>{modulo}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statusDoModulo.map((status) => (
                  <div key={status.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge 
                        style={{ backgroundColor: status.cor }}
                        className="text-white"
                      >
                        {status.status_nome}
                      </Badge>
                      {!status.ativo && (
                        <span className="text-sm text-gray-500">(Inativo)</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditandoStatus(status)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant={status.ativo ? "outline" : "secondary"}
                        onClick={() => alternarAtivo(status.id, status.ativo)}
                      >
                        {status.ativo ? 'Desativar' : 'Ativar'}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => excluirStatus(status.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
