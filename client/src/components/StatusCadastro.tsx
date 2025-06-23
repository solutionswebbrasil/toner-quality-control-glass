
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save } from 'lucide-react';


interface StatusConfig {
  id: number;
  modulo: string;
  status_nome: string;
  cor: string;
  ativo: boolean;
  ordem: number;
}

interface ResultadoConfig {
  id: number;
  modulo: string;
  resultado_nome: string;
  ativo: boolean;
  ordem: number;
}

export const StatusCadastro: React.FC = () => {
  const { toast } = useToast();
  const [statusConfigs, setStatusConfigs] = useState<StatusConfig[]>([]);
  const [resultadoConfigs, setResultadoConfigs] = useState<ResultadoConfig[]>([]);
  const [selectedModulo, setSelectedModulo] = useState<string>('Garantias');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isResultadoModalOpen, setIsResultadoModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<StatusConfig | null>(null);
  const [editingResultado, setEditingResultado] = useState<ResultadoConfig | null>(null);
  const [formData, setFormData] = useState({
    status_nome: '',
    cor: '#6B7280',
    resultado_nome: ''
  });

  const modulos = ['Garantias', 'Retornados', 'Auditorias', 'Não Conformidades'];

  useEffect(() => {
    loadConfiguracoes();
  }, [selectedModulo]);

  const loadConfiguracoes = async () => {
    try {
      const [statusResponse, resultadoResponse] = await Promise.all([
        supabase
          .from('status_configuracoes')
          .select('*')
          .eq('modulo', selectedModulo)
          .order('ordem'),
        supabase
          .from('resultados_configuracoes')
          .select('*')
          .eq('modulo', selectedModulo)
          .order('ordem')
      ]);

      if (statusResponse.error) throw statusResponse.error;
      if (resultadoResponse.error) throw resultadoResponse.error;

      setStatusConfigs(statusResponse.data || []);
      setResultadoConfigs(resultadoResponse.data || []);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações.",
        variant: "destructive",
      });
    }
  };

  const handleSaveStatus = async () => {
    try {
      const data = {
        modulo: selectedModulo,
        status_nome: formData.status_nome,
        cor: formData.cor,
        ordem: editingStatus ? editingStatus.ordem : statusConfigs.length + 1,
        ativo: true
      };

      if (editingStatus) {
        const { error } = await supabase
          .from('status_configuracoes')
          .update(data)
          .eq('id', editingStatus.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('status_configuracoes')
          .insert(data);
        if (error) throw error;
      }

      toast({
        title: "Sucesso!",
        description: `Status ${editingStatus ? 'atualizado' : 'criado'} com sucesso.`,
      });

      setIsStatusModalOpen(false);
      setEditingStatus(null);
      setFormData({ status_nome: '', cor: '#6B7280', resultado_nome: '' });
      loadConfiguracoes();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar status.",
        variant: "destructive",
      });
    }
  };

  const handleSaveResultado = async () => {
    try {
      const data = {
        modulo: selectedModulo,
        resultado_nome: formData.resultado_nome,
        ordem: editingResultado ? editingResultado.ordem : resultadoConfigs.length + 1,
        ativo: true
      };

      if (editingResultado) {
        const { error } = await supabase
          .from('resultados_configuracoes')
          .update(data)
          .eq('id', editingResultado.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('resultados_configuracoes')
          .insert(data);
        if (error) throw error;
      }

      toast({
        title: "Sucesso!",
        description: `Resultado ${editingResultado ? 'atualizado' : 'criado'} com sucesso.`,
      });

      setIsResultadoModalOpen(false);
      setEditingResultado(null);
      setFormData({ status_nome: '', cor: '#6B7280', resultado_nome: '' });
      loadConfiguracoes();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar resultado.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStatus = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este status?')) return;

    try {
      const { error } = await supabase
        .from('status_configuracoes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Status excluído com sucesso.",
      });

      loadConfiguracoes();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteResultado = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este resultado?')) return;

    try {
      const { error } = await supabase
        .from('resultados_configuracoes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Resultado excluído com sucesso.",
      });

      loadConfiguracoes();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir resultado.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Cadastro de Status</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Módulo</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedModulo} onValueChange={setSelectedModulo}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {modulos.map((modulo) => (
                <SelectItem key={modulo} value={modulo}>
                  {modulo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Status Configuration */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Status - {selectedModulo}</CardTitle>
          <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setFormData({ status_nome: '', cor: '#6B7280', resultado_nome: '' })}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Status
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingStatus ? 'Editar' : 'Novo'} Status</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status_nome">Nome do Status</Label>
                  <Input
                    id="status_nome"
                    value={formData.status_nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, status_nome: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="cor">Cor</Label>
                  <Input
                    id="cor"
                    type="color"
                    value={formData.cor}
                    onChange={(e) => setFormData(prev => ({ ...prev, cor: e.target.value }))}
                  />
                </div>
                <Button onClick={handleSaveStatus} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cor</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statusConfigs.map((status) => (
                <TableRow key={status.id}>
                  <TableCell>{status.status_nome}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: status.cor }}
                      />
                      {status.cor}
                    </div>
                  </TableCell>
                  <TableCell>{status.ordem}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingStatus(status);
                          setFormData({ 
                            status_nome: status.status_nome, 
                            cor: status.cor, 
                            resultado_nome: '' 
                          });
                          setIsStatusModalOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteStatus(status.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Resultados Configuration */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Resultados - {selectedModulo}</CardTitle>
          <Dialog open={isResultadoModalOpen} onOpenChange={setIsResultadoModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setFormData({ status_nome: '', cor: '#6B7280', resultado_nome: '' })}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Resultado
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingResultado ? 'Editar' : 'Novo'} Resultado</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="resultado_nome">Nome do Resultado</Label>
                  <Input
                    id="resultado_nome"
                    value={formData.resultado_nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, resultado_nome: e.target.value }))}
                  />
                </div>
                <Button onClick={handleSaveResultado} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resultadoConfigs.map((resultado) => (
                <TableRow key={resultado.id}>
                  <TableCell>{resultado.resultado_nome}</TableCell>
                  <TableCell>{resultado.ordem}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingResultado(resultado);
                          setFormData({ 
                            status_nome: '', 
                            cor: '#6B7280', 
                            resultado_nome: resultado.resultado_nome 
                          });
                          setIsResultadoModalOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteResultado(resultado.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
