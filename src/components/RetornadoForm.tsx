import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from "@/components/ui/use-toast"
import { Search } from 'lucide-react';
import { retornadoService } from '@/services/retornadoService';
import { tonerService } from '@/services/tonerService';
import { Toner } from '@/types';

interface FormState {
  id_cliente: string;
  peso: string;
  destino_final: string;
  filial: string;
}

export const RetornadoForm: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    id_cliente: '',
    peso: '',
    destino_final: '',
    filial: '',
  });
  const [toners, setToners] = useState<Toner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Toner[]>([]);
  const [selectedToner, setSelectedToner] = useState<Toner | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadToners();
  }, []);

  const loadToners = async () => {
    try {
      const tonersData = await tonerService.getAll();
      setToners(tonersData);
    } catch (error) {
      console.error('Erro ao carregar toners:', error);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term) {
      const results = toners.filter(toner =>
        toner.modelo.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectToner = (toner: Toner) => {
    setSelectedToner(toner);
    setSearchTerm(toner.modelo);
    setSearchResults([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const valorRecuperado = selectedToner ? (selectedToner.valor_por_folha * parseFloat(formData.peso)).toFixed(2) : '0.00';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedToner) return;
    
    setLoading(true);

    try {
      const retornadoData = {
        id_modelo: selectedToner.id!,
        id_cliente: parseInt(formData.id_cliente),
        peso: parseFloat(formData.peso),
        destino_final: formData.destino_final,
        filial: formData.filial,
        valor_recuperado: valorRecuperado,
      };

      await retornadoService.create(retornadoData);
      toast({
        title: "Sucesso",
        description: "Retornado cadastrado com sucesso!",
      });
      
      // Reset form
      setFormData({
        id_cliente: '',
        peso: '',
        destino_final: '',
        filial: '',
      });
      setSelectedToner(null);
      
    } catch (error) {
      console.error('Erro ao cadastrar retornado:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar retornado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Cadastrar Retornado</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="modelo">Modelo do Toner</Label>
              <div className="relative">
                <Input
                  type="text"
                  id="modelo"
                  placeholder="Digite o modelo do toner"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                {searchTerm && (
                  <div className="absolute z-10 bg-white border rounded shadow-md mt-1 w-full">
                    {searchResults.length > 0 ? (
                      searchResults.map(toner => (
                        <div
                          key={toner.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelectToner(toner)}
                        >
                          {toner.modelo}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">Nenhum modelo encontrado.</div>
                    )}
                  </div>
                )}
                {selectedToner && (
                  <div className="mt-2">
                    <p>Modelo selecionado: {selectedToner.modelo}</p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="id_cliente">ID do Cliente</Label>
              <Input
                type="number"
                id="id_cliente"
                name="id_cliente"
                value={formData.id_cliente}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                type="number"
                id="peso"
                name="peso"
                value={formData.peso}
                onChange={handleInputChange}
                required
                placeholder="Peso em KG"
              />
            </div>
            <div>
              <Label htmlFor="destino_final">Destino Final</Label>
              <Select name="destino_final" onValueChange={(value) => setFormData(prev => ({ ...prev, destino_final: value }))} defaultValue={formData.destino_final}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o destino" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Descarte">Descarte</SelectItem>
                  <SelectItem value="Garantia">Garantia</SelectItem>
                  <SelectItem value="Estoque">Estoque</SelectItem>
                  <SelectItem value="Uso Interno">Uso Interno</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filial">Filial</Label>
              <Input
                type="text"
                id="filial"
                name="filial"
                value={formData.filial}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label>Valor a ser recuperado: R$ {valorRecuperado}</Label>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
