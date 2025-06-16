
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Wrench, Search, Filter, Calendar as CalendarIcon, User, Building2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { garantiaTonerService, GarantiaToner } from '@/services/garantiaTonerService';
import { toast } from '@/hooks/use-toast';

export const GarantiaTonerConsulta: React.FC = () => {
  const [garantias, setGarantias] = useState<GarantiaToner[]>([]);
  const [filteredGarantias, setFilteredGarantias] = useState<GarantiaToner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [fornecedorFilter, setFornecedorFilter] = useState<string>('');
  const [filialFilter, setFilialFilter] = useState<string>('');
  const [dataInicio, setDataInicio] = useState<Date | undefined>();
  const [dataFim, setDataFim] = useState<Date | undefined>();

  useEffect(() => {
    loadGarantias();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [garantias, searchTerm, statusFilter, fornecedorFilter, filialFilter, dataInicio, dataFim]);

  const loadGarantias = async () => {
    try {
      const data = await garantiaTonerService.getAll();
      setGarantias(data);
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

    // Filtro por texto
    if (searchTerm) {
      filtered = filtered.filter(garantia =>
        garantia.ticket_numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garantia.modelo_toner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garantia.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garantia.filial_origem.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (statusFilter) {
      filtered = filtered.filter(garantia => garantia.status === statusFilter);
    }

    // Filtro por fornecedor
    if (fornecedorFilter) {
      filtered = filtered.filter(garantia => 
        garantia.fornecedor.toLowerCase().includes(fornecedorFilter.toLowerCase())
      );
    }

    // Filtro por filial
    if (filialFilter) {
      filtered = filtered.filter(garantia => 
        garantia.filial_origem.toLowerCase().includes(filialFilter.toLowerCase())
      );
    }

    // Filtro por período
    if (dataInicio) {
      filtered = filtered.filter(garantia => {
        const dataRegistro = new Date(garantia.data_registro);
        return dataRegistro >= dataInicio;
      });
    }

    if (dataFim) {
      filtered = filtered.filter(garantia => {
        const dataRegistro = new Date(garantia.data_registro);
        return dataRegistro <= dataFim;
      });
    }

    setFilteredGarantias(filtered);
  };

  const getStatusColor = (status: GarantiaToner['status']) => {
    switch (status) {
      case 'Pendente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Em Análise': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Aprovada': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Recusada': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Concluída': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setFornecedorFilter('');
    setFilialFilter('');
    setDataInicio(undefined);
    setDataFim(undefined);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando garantias de toners...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          Consulta de Garantias de Toners
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por ticket, modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white/50 dark:bg-slate-800/50 backdrop-blur">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Em Análise">Em Análise</SelectItem>
                <SelectItem value="Aprovada">Aprovada</SelectItem>
                <SelectItem value="Recusada">Recusada</SelectItem>
                <SelectItem value="Concluída">Concluída</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Fornecedor"
              value={fornecedorFilter}
              onChange={(e) => setFornecedorFilter(e.target.value)}
              className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
            />

            <Input
              placeholder="Filial"
              value={filialFilter}
              onChange={(e) => setFilialFilter(e.target.value)}
              className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
            />

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal bg-white/50 dark:bg-slate-800/50 backdrop-blur",
                    !dataInicio && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataInicio ? format(dataInicio, "dd/MM/yyyy") : "Data início"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dataInicio}
                  onSelect={setDataInicio}
                  locale={ptBR}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal bg-white/50 dark:bg-slate-800/50 backdrop-blur",
                    !dataFim && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataFim ? format(dataFim, "dd/MM/yyyy") : "Data fim"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dataFim}
                  onSelect={setDataFim}
                  locale={ptBR}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button onClick={clearFilters} variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Limpar Filtros
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">Pendentes</div>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
              {garantias.filter(g => g.status === 'Pendente').length}
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-blue-800 dark:text-blue-200 text-sm font-medium">Em Análise</div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {garantias.filter(g => g.status === 'Em Análise').length}
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-green-800 dark:text-green-200 text-sm font-medium">Aprovadas</div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {garantias.filter(g => g.status === 'Aprovada').length}
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="text-red-800 dark:text-red-200 text-sm font-medium">Recusadas</div>
            <div className="text-2xl font-bold text-red-900 dark:text-red-100">
              {garantias.filter(g => g.status === 'Recusada').length}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
            <div className="text-gray-800 dark:text-gray-200 text-sm font-medium">Concluídas</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {garantias.filter(g => g.status === 'Concluída').length}
            </div>
          </div>
        </div>

        {/* Tabela */}
        {filteredGarantias.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {garantias.length === 0 
              ? "Nenhuma garantia de toner registrada." 
              : "Nenhuma garantia encontrada com os filtros aplicados."
            }
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Modelo Toner</TableHead>
                  <TableHead>Filial</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Registro</TableHead>
                  <TableHead>Data Envio</TableHead>
                  <TableHead>Responsável</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGarantias.map((garantia) => (
                  <TableRow key={garantia.id}>
                    <TableCell className="font-medium">{garantia.ticket_numero}</TableCell>
                    <TableCell>{garantia.modelo_toner}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {garantia.filial_origem}
                      </div>
                    </TableCell>
                    <TableCell>{garantia.fornecedor}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(garantia.status)} border-0`}>
                        {garantia.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        {new Date(garantia.data_registro).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        {new Date(garantia.data_envio).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {garantia.responsavel_envio}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-500">
          Mostrando {filteredGarantias.length} de {garantias.length} garantias
        </div>
      </CardContent>
    </Card>
  );
};
