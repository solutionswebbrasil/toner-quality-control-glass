import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Recycle, Info, AlertTriangle, Search } from 'lucide-react';
import { Toner, Retornado } from '@/types';
import { tonerService, retornadoService, filialService } from '@/services/dataService';
import { toast } from '@/hooks/use-toast';
import { useRegrasRetornado } from '@/hooks/useRegrasRetornado';
import type { Filial } from '@/types/filial';

interface RetornadoFormProps {
  onSuccess?: () => void;
}

const destinosFinais = [
  'Descarte',
  'Estoque',
  'Estoque Semi Novo',
  'Uso Interno'
];

export const RetornadoForm: React.FC<RetornadoFormProps> = ({ onSuccess }) => {
  const [toners, setToners] = useState<Toner[]>([]);
  const [filteredToners, setFilteredToners] = useState<Toner[]>([]);
  const [searchToner, setSearchToner] = useState('');
  const [showTonerSearch, setShowTonerSearch] = useState(false);
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [formData, setFormData] = useState({
    id_modelo: '',
    id_cliente: '',
    peso: '',
    destino_final: '',
    filial: '',
    valor_recuperado: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedToner, setSelectedToner] = useState<Toner | null>(null);
  const [destinoSelecionado, setDestinoSelecionado] = useState(false);
  const { obterDestinoSugerido, obterOrientacoes } = useRegrasRetornado();

  useEffect(() => {
    loadToners();
    loadFiliais();
  }, []);

  // Filtrar toners baseado na busca
  useEffect(() => {
    if (searchToner.trim() === '') {
      setFilteredToners(toners);
    } else {
      const filtered = toners.filter(toner => 
        toner.modelo.toLowerCase().includes(searchToner.toLowerCase()) ||
        toner.cor.toLowerCase().includes(searchToner.toLowerCase())
      );
      setFilteredToners(filtered);
    }
  }, [searchToner, toners]);

  // Atualizar toner selecionado quando o modelo mudar
  useEffect(() => {
    if (formData.id_modelo) {
      const toner = toners.find(t => t.id?.toString() === formData.id_modelo);
      setSelectedToner(toner || null);
      // Reset destino quando mudar o toner
      setFormData(prev => ({ ...prev, destino_final: '' }));
      setDestinoSelecionado(false);
    } else {
      setSelectedToner(null);
      setDestinoSelecionado(false);
    }
  }, [formData.id_modelo, toners]);

  // Reset destino quando peso mudar
  useEffect(() => {
    if (formData.peso) {
      setFormData(prev => ({ ...prev, destino_final: '' }));
      setDestinoSelecionado(false);
    }
  }, [formData.peso]);

  const loadToners = async () => {
    try {
      const data = await tonerService.getAll();
      setToners(data);
      setFilteredToners(data);
    } catch (error) {
      console.error('Erro ao carregar toners:', error);
    }
  };

  const loadFiliais = async () => {
    try {
      const data = await filialService.getAll();
      setFiliais(data);
      if (data.length > 0 && !formData.filial) {
        setFormData(prev => ({ ...prev, filial: data[0].nome }));
      }
    } catch (error) {
      console.error('Erro ao carregar filiais:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!destinoSelecionado) {
      toast({
        title: "Destino Necessário",
        description: "Por favor, selecione o destino final antes de registrar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const retornado: Omit<Retornado, 'id' | 'modelo'> = {
        id_modelo: parseInt(formData.id_modelo),
        id_cliente: parseInt(formData.id_cliente),
        peso: parseFloat(formData.peso),
        destino_final: formData.destino_final,
        filial: formData.filial,
        valor_recuperado: formData.valor_recuperado ? parseFloat(formData.valor_recuperado) : undefined,
        data_registro: new Date().toISOString()
      };

      await retornadoService.create(retornado);
      
      toast({
        title: "Sucesso!",
        description: "Retornado registrado com sucesso.",
      });

      // Reset form
      setFormData({
        id_modelo: '',
        id_cliente: '',
        peso: '',
        destino_final: '',
        filial: filiais.length > 0 ? filiais[0].nome : '',
        valor_recuperado: ''
      });
      setSelectedToner(null);
      setDestinoSelecionado(false);
      setSearchToner('');
      setShowTonerSearch(false);

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao registrar retornado.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'destino_final' && value) {
      setDestinoSelecionado(true);
    }
    if (field === 'id_modelo') {
      setShowTonerSearch(false);
      setSearchToner('');
    }
  };

  const calculateGramaturaRestante = () => {
    if (!selectedToner || !formData.peso) return 0;
    const pesoAtual = parseFloat(formData.peso);
    // Gramatura restante = peso atual - peso vazio
    return Math.max(0, pesoAtual - selectedToner.peso_vazio);
  };

  const calculatePercentualGramaturaRestante = () => {
    if (!selectedToner) return '0';
    const gramaturaRestante = calculateGramaturaRestante();
    // Percentual de gramatura restante baseado na gramatura total do toner
    return ((gramaturaRestante / selectedToner.gramatura) * 100).toFixed(1);
  };

  const getDestinoSugeridoInfo = () => {
    if (!selectedToner || !formData.peso) return null;
    const percentualGramaturaRestante = parseFloat(calculatePercentualGramaturaRestante());
    return obterDestinoSugerido(percentualGramaturaRestante);
  };

  const getOrientacoesAtual = () => {
    const destinoSugerido = getDestinoSugeridoInfo();
    return destinoSugerido ? destinoSugerido.orientacoes : '';
  };

  const isFormValid = () => {
    return formData.id_modelo && 
           formData.id_cliente && 
           formData.peso && 
           formData.filial && 
           destinoSelecionado;
  };

  return (
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Recycle className="w-5 h-5" />
          Registro de Retornados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id_modelo">Modelo do Toner *</Label>
              {!showTonerSearch ? (
                <div className="flex gap-2">
                  <Select value={formData.id_modelo} onValueChange={(value) => handleInputChange('id_modelo', value)}>
                    <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 backdrop-blur flex-1">
                      <SelectValue placeholder="Selecione o modelo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-lg max-h-60">
                      {toners.map((toner) => (
                        <SelectItem key={toner.id} value={toner.id!.toString()}>
                          {toner.modelo} - {toner.cor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowTonerSearch(true)}
                    className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite para buscar modelo ou cor..."
                      value={searchToner}
                      onChange={(e) => setSearchToner(e.target.value)}
                      className="bg-white/50 dark:bg-slate-800/50 backdrop-blur flex-1"
                      autoFocus
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowTonerSearch(false);
                        setSearchToner('');
                      }}
                      className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
                    >
                      Cancelar
                    </Button>
                  </div>
                  <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md bg-white/50 dark:bg-slate-800/50 backdrop-blur">
                    {filteredToners.length > 0 ? (
                      filteredToners.map((toner) => (
                        <div
                          key={toner.id}
                          className="p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          onClick={() => {
                            handleInputChange('id_modelo', toner.id!.toString());
                            setShowTonerSearch(false);
                            setSearchToner('');
                          }}
                        >
                          <div className="font-medium">{toner.modelo}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{toner.cor}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                        Nenhum toner encontrado
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="id_cliente">ID do Cliente *</Label>
              <Input
                id="id_cliente"
                type="number"
                placeholder="123456"
                value={formData.id_cliente}
                onChange={(e) => handleInputChange('id_cliente', e.target.value)}
                required
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="peso">Peso Atual (g) *</Label>
              <Input
                id="peso"
                type="number"
                step="0.01"
                placeholder="125.5"
                value={formData.peso}
                onChange={(e) => handleInputChange('peso', e.target.value)}
                required
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filial">Filial *</Label>
              <Select value={formData.filial} onValueChange={(value) => handleInputChange('filial', value)}>
                <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 backdrop-blur">
                  <SelectValue placeholder="Selecione a filial" />
                </SelectTrigger>
                <SelectContent>
                  {filiais.map((filial) => (
                    <SelectItem key={filial.id} value={filial.nome}>
                      {filial.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor_recuperado">Valor Recuperado (R$)</Label>
              <Input
                id="valor_recuperado"
                type="number"
                step="0.01"
                placeholder="25.50"
                value={formData.valor_recuperado}
                onChange={(e) => handleInputChange('valor_recuperado', e.target.value)}
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>
          </div>

          {selectedToner && formData.peso && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">Informações Calculadas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <Label>Peso Vazio</Label>
                  <div className="font-medium">{selectedToner.peso_vazio}g</div>
                </div>
                <div>
                  <Label>Peso Atual</Label>
                  <div className="font-medium">{formData.peso}g</div>
                </div>
                <div>
                  <Label>Gramatura Restante</Label>
                  <div className="font-medium text-blue-600 dark:text-blue-400">
                    {calculateGramaturaRestante().toFixed(2)}g
                  </div>
                </div>
                <div>
                  <Label>% Gramatura Restante</Label>
                  <div className="font-medium text-green-600 dark:text-green-400">
                    {calculatePercentualGramaturaRestante()}%
                  </div>
                </div>
              </div>

              {getDestinoSugeridoInfo() && (
                <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-800 dark:text-blue-200">
                      Destino Sugerido: {getDestinoSugeridoInfo()?.destino}
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Baseado em {calculatePercentualGramaturaRestante()}% de gramatura restante
                  </p>
                </div>
              )}

              {getOrientacoesAtual() && (
                <div className="bg-amber-50 dark:bg-amber-950/50 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-amber-800 dark:text-amber-200">
                      Orientações
                    </span>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {getOrientacoesAtual()}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="destino_final">Destino Final *</Label>
                <Select value={formData.destino_final} onValueChange={(value) => handleInputChange('destino_final', value)}>
                  <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 backdrop-blur">
                    <SelectValue placeholder="Selecione o destino final" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinosFinais.map((destino) => (
                      <SelectItem key={destino} value={destino}>
                        {destino}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isSubmitting || !isFormValid()}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Salvando...' : 'Registrar Retornado'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
