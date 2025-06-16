import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Recycle } from 'lucide-react';
import { Toner, Retornado } from '@/types';
import { tonerService, retornadoService, filialService } from '@/services/dataService';
import { toast } from '@/hooks/use-toast';
import { TonerSelector } from './retornado/TonerSelector';
import { RetornadoFormFields } from './retornado/RetornadoFormFields';
import { RetornadoInfoDisplay } from './retornado/RetornadoInfoDisplay';
import type { Filial } from '@/types/filial';

interface RetornadoFormProps {
  onSuccess?: () => void;
}

export const RetornadoForm: React.FC<RetornadoFormProps> = ({ onSuccess }) => {
  const [toners, setToners] = useState<Toner[]>([]);
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [formData, setFormData] = useState({
    id_modelo: '',
    id_cliente: '',
    peso: '',
    destino_final: '',
    filial: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedToner, setSelectedToner] = useState<Toner | null>(null);
  const [destinoSelecionado, setDestinoSelecionado] = useState(false);

  useEffect(() => {
    loadToners();
    loadFiliais();
  }, []);

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

  const calculateValorRecuperado = () => {
    if (!selectedToner || !formData.peso || formData.destino_final !== 'Estoque') {
      return undefined;
    }
    
    const pesoAtual = parseFloat(formData.peso);
    const gramaturaRestante = Math.max(0, pesoAtual - selectedToner.peso_vazio);
    const percentualGramatura = (gramaturaRestante / selectedToner.gramatura) * 100;
    const folhasRestantes = (percentualGramatura / 100) * selectedToner.capacidade_folhas;
    const valorRecuperado = folhasRestantes * selectedToner.valor_por_folha;
    
    return valorRecuperado;
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
      const valorRecuperado = calculateValorRecuperado();

      const retornado: Omit<Retornado, 'id' | 'modelo'> = {
        id_modelo: parseInt(formData.id_modelo),
        id_cliente: parseInt(formData.id_cliente),
        peso: parseFloat(formData.peso),
        destino_final: formData.destino_final,
        filial: formData.filial,
        valor_recuperado: valorRecuperado,
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
        filial: filiais.length > 0 ? filiais[0].nome : ''
      });
      setSelectedToner(null);
      setDestinoSelecionado(false);

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
  };

  const handleDestinoChange = (destino: string) => {
    handleInputChange('destino_final', destino);
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
            <TonerSelector
              toners={toners}
              selectedTonerId={formData.id_modelo}
              onTonerChange={(tonerId) => handleInputChange('id_modelo', tonerId)}
            />

            <RetornadoFormFields
              idCliente={formData.id_cliente}
              peso={formData.peso}
              filial={formData.filial}
              filiais={filiais}
              onFieldChange={handleInputChange}
            />
          </div>

          <RetornadoInfoDisplay
            selectedToner={selectedToner}
            peso={formData.peso}
            destinoFinal={formData.destino_final}
            onDestinoChange={handleDestinoChange}
          />

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
