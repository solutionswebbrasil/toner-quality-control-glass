
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Download, Search, Image } from 'lucide-react';
import { registroBpmnService } from '@/services/registroBpmnService';
import { tituloBpmnService } from '@/services/tituloBpmnService';
import type { RegistroBpmn, TituloBpmn } from '@/types';

export const ConsultaRegistrosBpmn: React.FC = () => {
  const [registros, setRegistros] = useState<RegistroBpmn[]>([]);
  const [titulos, setTitulos] = useState<TituloBpmn[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    titulo_id: '',
    data_inicio: '',
    data_fim: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [registrosData, titulosData] = await Promise.all([
        registroBpmnService.getAll(),
        tituloBpmnService.getAll()
      ]);
      
      setRegistros(registrosData);
      setTitulos(titulosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const registrosFiltrados = registros.filter(registro => {
    const matchTitulo = !filtros.titulo_id || registro.titulo_id.toString() === filtros.titulo_id;
    const matchDataInicio = !filtros.data_inicio || new Date(registro.data_registro) >= new Date(filtros.data_inicio);
    const matchDataFim = !filtros.data_fim || new Date(registro.data_registro) <= new Date(filtros.data_fim);
    
    return matchTitulo && matchDataInicio && matchDataFim;
  });

  const getTituloNome = (tituloId: number) => {
    const titulo = titulos.find(t => t.id === tituloId);
    return titulo?.titulo || 'Título não encontrado';
  };

  const visualizarArquivo = (url: string) => {
    window.open(url, '_blank');
  };

  const downloadArquivo = (url: string, nomeArquivo: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    link.click();
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando registros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Image className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Consulta de Registros BPMN</h1>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros de Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="titulo-filter">Título</Label>
              <Select 
                value={filtros.titulo_id} 
                onValueChange={(value) => setFiltros({...filtros, titulo_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os títulos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os títulos</SelectItem>
                  {titulos.map((titulo) => (
                    <SelectItem key={titulo.id} value={titulo.id!.toString()}>
                      {titulo.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="data-inicio">Data Início</Label>
              <Input
                id="data-inicio"
                type="date"
                value={filtros.data_inicio}
                onChange={(e) => setFiltros({...filtros, data_inicio: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="data-fim">Data Fim</Label>
              <Input
                id="data-fim"
                type="date"
                value={filtros.data_fim}
                onChange={(e) => setFiltros({...filtros, data_fim: e.target.value})}
              />
            </div>

            <div className="flex items-end">
              <Button 
                onClick={() => setFiltros({ titulo_id: '', data_inicio: '', data_fim: '' })}
                variant="outline"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Registros */}
      <div className="grid gap-4">
        {registrosFiltrados.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhum registro encontrado</p>
            </CardContent>
          </Card>
        ) : (
          registrosFiltrados.map((registro) => (
            <Card key={registro.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">
                        {getTituloNome(registro.titulo_id)}
                      </h3>
                      <Badge variant="secondary">
                        Versão {registro.versao}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Data de Registro: {new Date(registro.data_registro).toLocaleDateString('pt-BR')}</p>
                      {registro.registrado_por && (
                        <p>Registrado por: {registro.registrado_por}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {registro.arquivo_png && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => visualizarArquivo(registro.arquivo_png!)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          Visualizar
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadArquivo(
                            registro.arquivo_png!, 
                            `BPMN_${getTituloNome(registro.titulo_id)}_v${registro.versao}.png`
                          )}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
