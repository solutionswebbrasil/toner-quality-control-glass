
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { tituloItPopService, TituloItPop } from '@/services/tituloItPopService';
import { Trash2, Edit } from 'lucide-react';

interface ConsultaTitulosItPopProps {
  onSuccess: () => void;
}

export const ConsultaTitulosItPop: React.FC<ConsultaTitulosItPopProps> = ({ onSuccess }) => {
  const [titulos, setTitulos] = useState<TituloItPop[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTitulo, setEditingTitulo] = useState<TituloItPop | null>(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const loadTitulos = async () => {
    try {
      const data = await tituloItPopService.getAll();
      setTitulos(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar títulos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTitulos();
  }, []);

  const handleEdit = (titulo: TituloItPop) => {
    setEditingTitulo(titulo);
    setEditTitulo(titulo.titulo);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingTitulo || !editTitulo.trim()) return;

    try {
      await tituloItPopService.update(editingTitulo.id, { titulo: editTitulo.trim() });
      toast({
        title: "Sucesso",
        description: "Título atualizado com sucesso!"
      });
      setIsEditDialogOpen(false);
      setEditingTitulo(null);
      setEditTitulo('');
      loadTitulos();
      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar título.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este título?')) {
      try {
        await tituloItPopService.delete(id);
        toast({
          title: "Sucesso",
          description: "Título excluído com sucesso!"
        });
        loadTitulos();
        onSuccess();
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir título.",
          variant: "destructive"
        });
      }
    }
  };

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Consulta de Títulos POP/IT</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Data Cadastro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {titulos.map((titulo) => (
                <TableRow key={titulo.id}>
                  <TableCell>{titulo.id}</TableCell>
                  <TableCell>{titulo.titulo}</TableCell>
                  <TableCell>{new Date(titulo.data_cadastro).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(titulo)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(titulo.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Título</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-titulo">Título</Label>
                  <Input
                    id="edit-titulo"
                    value={editTitulo}
                    onChange={(e) => setEditTitulo(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveEdit}>
                    Salvar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};
