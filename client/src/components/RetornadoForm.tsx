import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Recycle } from 'lucide-react';
import { Toner, Retornado } from '@/types';
import { tonerService, retornadoService, filialService } from '@/services/dataService';
import { garantiaTonerService } from '@/services/garantiaTonerService';
import { toast } from '@/hooks/use-toast';
import { TonerSelector } from './retornado/TonerSelector';
import { RetornadoFormFields } from './retornado/RetornadoFormFields';
import { RetornadoInfoDisplay } from './retornado/RetornadoInfoDisplay';
import { GarantiaTonerModal, GarantiaTonerData } from './retornado/GarantiaTonerModal';
import { supabase } from '@/integrations/supabase/client';
import type { Filial } from '@/types/filial';

interface RetornadoFormProps {
  onSuccess?: () => void;
}

export const RetornadoForm: React.FC<RetornadoFormProps> = ({ onSuccess }) => {
  const [toners, setToners] = useState<Toner[]>([]);
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [formData, setFormData] = useState({
    id_modelo: '',
    id_cliente: 1, // Changed to number with default value
    peso: '',
    destino_final: '',
    filial: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedToner, setSelectedToner] = useState<Toner | null>(null);
  const [destinoSelecionado, setDestinoSelecionado] = useState(false);
  const [isGarantiaModalOpen, setIsGarantiaModalOpen] = useState(false);

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

  const handleGarantiaConfirm = async (garantiaData: GarantiaTonerData) => {
    try {
      if (!selectedToner) return;

      const garantiaToner = {
        modelo_toner: selectedToner.modelo,
        filial_origem: formData.filial,
        fornecedor: garantiaData.fornecedor,
        defeito: garantiaData.defeito,
        responsavel_envio: garantiaData.responsavel_envio,
        status: 'Pendente' as const,
        data_envio: new Date().toISOString()
      };

      const result = await garantiaTonerService.create(garantiaToner);
      
      toast({
        title: "Garantia Registrada!",
        description: `Ticket ${result.ticket_numero} criado com sucesso. O toner foi enviado para o módulo de garantias.`,
      });

      // Reset form
      setFormData({
        id_modelo: '',
        id_cliente: 1,
        peso: '',
        destino_final: '',
        filial: filiais.length > 0 ? filiais[0].nome : ''
      });
      setSelectedToner(null);
      setDestinoSelecionado(false);
      setIsGarantiaModalOpen(false);

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao registrar garantia do toner.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.destino_final === 'Garantia') {
      if (!destinoSelecionado) {
        toast({
          title: "Destino Necessário",
          description: "Por favor, selecione o destino final antes de prosseguir.",
          variant: "destructive"
        });
        return;
      }
      
      setIsGarantiaModalOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado.",
          variant: "destructive"
        });
        return;
      }

      const valorRecuperado = calculateValorRecuperado();

      const retornado: Omit<Retornado, 'id'> = {
        id_modelo: parseInt(formData.id_modelo),
        id_cliente: formData.id_cliente, // Keep as number
        peso: parseFloat(formData.peso),
        destino_final: formData.destino_final,
        filial: formData.filial,
        valor_recuperado: valorRecuperado || 0,
        user_id: user.id,
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
        id_cliente: 1,
        peso: '',
        destino_final: '',
        filial: filiais.length > 0 ? filiais[0].nome : ''
      });
      setSelectedToner(null);
      setDestinoSelecionado(false);

      onSuccess?.();
    } catch (error) {
      console.error('Erro ao registrar retornado:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar retornado.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="classic-section">
        <CardHeader className="classic-section-header">
          <CardTitle className="flex items-center gap-2">
            <Recycle className="w-5 h-5" />
            Registro de Retornado
          </CardTitle>
        </CardHeader>
        <CardContent className="classic-section-content">
          <form onSubmit={handleSubmit} className="space-y-6">
            <TonerSelector
              toners={toners}
              value={formData.id_modelo}
              onValueChange={(value: string) => setFormData(prev => ({ ...prev, id_modelo: value }))}
            />

            <RetornadoFormFields
              peso={formData.peso}
              destino_final={formData.destino_final}
              filial={formData.filial}
              filiais={filiais}
              selectedToner={selectedToner}
              destinoSelecionado={destinoSelecionado}
              onPesoChange={(peso: string) => setFormData(prev => ({ ...prev, peso }))}
              onDestinoChange={(destino: string) => setFormData(prev => ({ ...prev, destino_final: destino }))}
              onFilialChange={(filial: string) => setFormData(prev => ({ ...prev, filial }))}
              onDestinoSelecionado={setDestinoSelecionado}
            />

            {selectedToner && formData.peso && (
              <RetornadoInfoDisplay
                selectedToner={selectedToner}
                peso={formData.peso}
                destinoFinal={formData.destino_final}
                onDestinoChange={(destino: string) => setFormData(prev => ({ ...prev, destino_final: destino }))}
              />
            )}

            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.id_modelo || !formData.peso || !formData.destino_final}
              className="classic-btn-primary w-full"
            >
              {isSubmitting ? 'Salvando...' : 'Registrar Retornado'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <GarantiaTonerModal
        isOpen={isGarantiaModalOpen}
        onClose={() => setIsGarantiaModalOpen(false)}
        onConfirm={handleGarantiaConfirm}
        selectedToner={selectedToner}
        filial={formData.filial}
      />
    </div>
  );
};
