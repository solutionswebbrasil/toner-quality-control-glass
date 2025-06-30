
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface NaoConformidadeFiltersProps {
  dataInicio: string;
  setDataInicio: (value: string) => void;
  dataFim: string;
  setDataFim: (value: string) => void;
  unidadeSelecionada: string;
  setUnidadeSelecionada: (value: string) => void;
  setorSelecionado: string;
  setSetorSelecionado: (value: string) => void;
  tipoSelecionado: string;
  setTipoSelecionado: (value: string) => void;
  classificacaoSelecionada: string;
  setClassificacaoSelecionada: (value: string) => void;
  statusSelecionado: string;
  setStatusSelecionado: (value: string) => void;
  clearFilters: () => void;
  resultCount: number;
}

export const NaoConformidadeFilters: React.FC<NaoConformidadeFiltersProps> = ({
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
  unidadeSelecionada,
  setUnidadeSelecionada,
  setorSelecionado,
  setSetorSelecionado,
  tipoSelecionado,
  setTipoSelecionado,
  classificacaoSelecionada,
  setClassificacaoSelecionada,
  statusSelecionado,
  setStatusSelecionado,
  clearFilters,
  resultCount
}) => {
  return (
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Filtros de Busca</CardTitle>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {resultCount} resultados encontrados
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="dataInicio">Data Início</Label>
            <Input
              id="dataInicio"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="dataFim">Data Fim</Label>
            <Input
              id="dataFim"
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>

          <div>
            <Label>Unidade</Label>
            <Select value={unidadeSelecionada} onValueChange={setUnidadeSelecionada}>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas</SelectItem>
                <SelectItem value="Matriz">Matriz</SelectItem>
                <SelectItem value="Filial 01">Filial 01</SelectItem>
                <SelectItem value="Filial 02">Filial 02</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Setor</Label>
            <Select value={setorSelecionado} onValueChange={setSetorSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Produção">Produção</SelectItem>
                <SelectItem value="Qualidade">Qualidade</SelectItem>
                <SelectItem value="TI">TI</SelectItem>
                <SelectItem value="Vendas">Vendas</SelectItem>
                <SelectItem value="Administrativo">Administrativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tipo</Label>
            <Select value={tipoSelecionado} onValueChange={setTipoSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Produto">Produto</SelectItem>
                <SelectItem value="Processo">Processo</SelectItem>
                <SelectItem value="Serviço">Serviço</SelectItem>
                <SelectItem value="Sistema">Sistema</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Classificação</Label>
            <Select value={classificacaoSelecionada} onValueChange={setClassificacaoSelecionada}>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas</SelectItem>
                <SelectItem value="Leve">Leve</SelectItem>
                <SelectItem value="Moderada">Moderada</SelectItem>
                <SelectItem value="Grave">Grave</SelectItem>
                <SelectItem value="Crítica">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status</Label>
            <Select value={statusSelecionado} onValueChange={setStatusSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Aberta">Aberta</SelectItem>
                <SelectItem value="Em andamento">Em andamento</SelectItem>
                <SelectItem value="Corrigida">Corrigida</SelectItem>
                <SelectItem value="Recusada">Recusada</SelectItem>
                <SelectItem value="Reaberta">Reaberta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={clearFilters} variant="outline" className="w-full">
              Limpar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
