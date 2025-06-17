import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Wrench, Search, Filter, Calendar, User, Building2, AlertCircle } from 'lucide-react';
import { garantiaTonerService, GarantiaToner } from '@/services/garantiaTonerService';
import { toast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export const GarantiaTonerConsulta: React.FC = () => {
  const { theme } = useTheme();
  const [garantias, setGarantias] = useState<GarantiaToner[]>([]);
  const [filteredGarantias, setFilteredGarantias] = useState<GarantiaToner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketFilter, setTicketFilter] = useState('');
  const [nsFilter, setNsFilter] = useState('');
  const [loteFilter, setLoteFilter] = useState('');
  const [filialFilter, setFilialFilter] = useState('');
  const [modeloFilter, setModeloFilter] = useState('');
  const [fornecedorFilter, setFornecedorFilter] = useState('');

  useEffect(() => {
    loadGarantias();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [garantias, searchTerm, ticketFilter, nsFilter, loteFilter, filialFilter, modeloFilter, fornecedorFilter]);

  const loadGarantias = async () => {
    try {
      const data = await garantiaTonerService.getAll();
      // Filtrar apenas garantias concluídas
      const garantiasConcluidas = data.filter(g => g.status === 'Concluído');
      setGarantias(garantiasConcluidas);
    } catch (error) {
      console.error('Erro ao carregar garantias de toners:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar garantias de toners.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = garantias;

    if (searchTerm) {
      filtered = filtered.filter(garantia =>
        garantia.ticket_numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garantia.modelo_toner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garantia.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garantia.filial_origem.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (ticketFilter) {
      filtered = filtered.filter(garantia => 
        garantia.ticket_numero.toLowerCase().includes(ticketFilter.toLowerCase())
      );
    }

    if (nsFilter) {
      filtered = filtered.filter(garantia => 
        garantia.ns && garantia.ns.toLowerCase().includes(nsFilter.toLowerCase())
      );
    }

    if (loteFilter) {
      filtered = filtered.filter(garantia => 
        garantia.lote && garantia.lote.toLowerCase().includes(loteFilter.toLowerCase())
      );
    }

    if (filialFilter) {
      filtered = filtered.filter(garantia => 
        garantia.filial_origem.toLowerCase().includes(filialFilter.toLowerCase())
      );
    }

    if (modeloFilter) {
      filtered = filtered.filter(garantia => 
        garantia.modelo_toner.toLowerCase().includes(modeloFilter.toLowerCase())
      );
    }

    if (fornecedorFilter) {
      filtered = filtered.filter(garantia => 
        garantia.fornecedor.toLowerCase().includes(fornecedorFilter.toLowerCase())
      );
    }

    setFilteredGarantias(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTicketFilter('');
    setNsFilter('');
    setLoteFilter('');
    setFilialFilter('');
    setModeloFilter('');
    setFornecedorFilter('');
  };

  const getCardClasses = () => {
    if (theme === 'dark-plus') {
      return "dark-plus-card";
    }
    return "bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50";
  };

  const getTextClasses = () => {
    if (theme === 'dark-plus') {
      return "dark-plus-text";
    }
    return "";
  };

  const getInputClasses = () => {
    if (theme === 'dark-plus') {
      return "dark-plus-input";
    }
    return "bg-white/50 dark:bg-slate-800/50 backdrop-blur";
  };

  const getButtonClasses = () => {
    if (theme === 'dark-plus') {
      return "dark-plus-button";
    }
    return "";
  };

  if (loading) {
    return (
      <Card className={cn(getCardClasses())}>
        <CardContent className="p-6">
          <div className={cn("text-center", getTextClasses())}>Carregando garantias de toners...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(getCardClasses())}>
      <CardHeader>
        <CardTitle className={cn("flex items-center gap-2", theme === 'dark-plus' && "dark-plus-title")}>
          <Wrench className="w-5 h-5" />
          Garantias de Toners Concluídas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className={cn("absolute left-3 top-3 h-4 w-4", theme === 'dark-plus' ? "text-gray-400" : "text-gray-400")} />
              <Input
                placeholder="Busca geral..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn("pl-10", getInputClasses())}
              />
            </div>
            
            <Input
              placeholder="Filtrar por ticket"
              value={ticketFilter}
              onChange={(e) => setTicketFilter(e.target.value)}
              className={cn(getInputClasses())}
            />

            <Input
              placeholder="Filtrar por número de série"
              value={nsFilter}
              onChange={(e) => setNsFilter(e.target.value)}
              className={cn(getInputClasses())}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Filtrar por lote"
              value={loteFilter}
              onChange={(e) => setLoteFilter(e.target.value)}
              className={cn(getInputClasses())}
            />

            <Input
              placeholder="Filtrar por filial"
              value={filialFilter}
              onChange={(e) => setFilialFilter(e.target.value)}
              className={cn(getInputClasses())}
            />

            <Input
              placeholder="Filtrar por modelo"
              value={modeloFilter}
              onChange={(e) => setModeloFilter(e.target.value)}
              className={cn(getInputClasses())}
            />

            <Input
              placeholder="Filtrar por fornecedor"
              value={fornecedorFilter}
              onChange={(e) => setFornecedorFilter(e.target.value)}
              className={cn(getInputClasses())}
            />
          </div>

          <Button onClick={clearFilters} variant="outline" className={cn("flex items-center gap-2", getButtonClasses())}>
            <Filter className="w-4 h-4" />
            Limpar Filtros
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
          <div className={cn("p-4 rounded-lg", theme === 'dark-plus' ? "dark-plus-card" : "bg-gray-50 dark:bg-gray-900/20")}>
            <div className={cn("text-sm font-medium", theme === 'dark-plus' ? "dark-plus-secondary-text" : "text-gray-800 dark:text-gray-200")}>Total Concluídas</div>
            <div className={cn("text-2xl font-bold", getTextClasses())}>
              {garantias.length}
            </div>
          </div>
        </div>

        {/* Tabela */}
        {filteredGarantias.length === 0 ? (
          <div className={cn("text-center py-8", theme === 'dark-plus' ? "dark-plus-secondary-text" : "text-gray-500")}>
            {garantias.length === 0 
              ? "Nenhuma garantia de toner concluída." 
              : "Nenhuma garantia encontrada com os filtros aplicados."
            }
          </div>
        ) : (
          <div className={cn("border rounded-lg overflow-hidden", theme === 'dark-plus' && "dark-plus-border")}>
            <Table className={cn(theme === 'dark-plus' && "dark-plus-table")}>
              <TableHeader>
                <TableRow className={cn(theme === 'dark-plus' && "dark-plus-table-row")}>
                  <TableHead className={cn(theme === 'dark-plus' && "dark-plus-text")}>Ticket</TableHead>
                  <TableHead className={cn(theme === 'dark-plus' && "dark-plus-text")}>Modelo Toner</TableHead>
                  <TableHead className={cn(theme === 'dark-plus' && "dark-plus-text")}>NS</TableHead>
                  <TableHead className={cn(theme === 'dark-plus' && "dark-plus-text")}>Lote</TableHead>
                  <TableHead className={cn(theme === 'dark-plus' && "dark-plus-text")}>Filial</TableHead>
                  <TableHead className={cn(theme === 'dark-plus' && "dark-plus-text")}>Fornecedor</TableHead>
                  <TableHead className={cn(theme === 'dark-plus' && "dark-plus-text")}>Data Envio</TableHead>
                  <TableHead className={cn(theme === 'dark-plus' && "dark-plus-text")}>Responsável</TableHead>
                  <TableHead className={cn(theme === 'dark-plus' && "dark-plus-text")}>Defeito</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGarantias.map((garantia) => (
                  <TableRow key={garantia.id} className={cn(theme === 'dark-plus' && "dark-plus-table-row hover:dark-plus-table-row:hover")}>
                    <TableCell className={cn("font-medium", getTextClasses())}>{garantia.ticket_numero}</TableCell>
                    <TableCell className={cn(getTextClasses())}>{garantia.modelo_toner}</TableCell>
                    <TableCell className={cn(getTextClasses())}>{garantia.ns || 'N/A'}</TableCell>
                    <TableCell className={cn(getTextClasses())}>{garantia.lote || 'N/A'}</TableCell>
                    <TableCell>
                      <div className={cn("flex items-center gap-1", getTextClasses())}>
                        <Building2 className="w-3 h-3" />
                        {garantia.filial_origem}
                      </div>
                    </TableCell>
                    <TableCell className={cn(getTextClasses())}>{garantia.fornecedor}</TableCell>
                    <TableCell>
                      <div className={cn("flex items-center gap-1", getTextClasses())}>
                        <Calendar className="w-3 h-3" />
                        {new Date(garantia.data_envio).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={cn("flex items-center gap-1", getTextClasses())}>
                        <User className="w-3 h-3" />
                        {garantia.responsavel_envio}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={cn("max-w-xs truncate", getTextClasses())} title={garantia.defeito}>
                        {garantia.defeito}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className={cn("mt-4 text-sm", theme === 'dark-plus' ? "dark-plus-secondary-text" : "text-gray-500")}>
          Mostrando {filteredGarantias.length} de {garantias.length} garantias concluídas
        </div>
      </CardContent>
    </Card>
  );
};
