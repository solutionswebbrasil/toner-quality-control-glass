
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, Database, Mail, Shield, Bell, Palette } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const ConfiguracoesSistema: React.FC = () => {
  const [configuracoes, setConfiguracoes] = useState({
    sistema: {
      nome_aplicacao: 'SGQ Pro',
      versao: '1.0.0',
      manutencao: false,
      backup_automatico: true,
      log_detalhado: false
    },
    email: {
      servidor_smtp: '',
      porta: 587,
      usuario: '',
      senha: '',
      ssl_ativo: true,
      remetente_padrao: ''
    },
    seguranca: {
      sessao_timeout: 30,
      tentativas_login: 5,
      senha_complexa: true,
      autenticacao_dupla: false
    },
    notificacoes: {
      email_novos_registros: true,
      email_prazo_vencimento: true,
      email_nao_conformidades: true,
      frequencia_relatorios: 'semanal'
    },
    interface: {
      tema_escuro: false,
      cores_personalizadas: false,
      cor_primaria: '#3b82f6',
      cor_secundaria: '#10b981'
    }
  });

  const [salvando, setSalvando] = useState(false);

  const handleInputChange = (categoria: string, campo: string, valor: any) => {
    setConfiguracoes(prev => ({
      ...prev,
      [categoria]: {
        ...prev[categoria as keyof typeof prev],
        [campo]: valor
      }
    }));
  };

  const salvarConfiguracoes = async () => {
    setSalvando(true);
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configurações salvas",
        description: "As configurações do sistema foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setSalvando(false);
    }
  };

  const testarConexaoEmail = async () => {
    try {
      toast({
        title: "Testando conexão...",
        description: "Verificando configurações de email.",
      });
      
      // Simular teste
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Conexão bem-sucedida",
        description: "As configurações de email estão funcionando corretamente.",
      });
    } catch (error) {
      toast({
        title: "Falha na conexão",
        description: "Não foi possível conectar com o servidor de email.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings className="h-8 w-8 text-slate-600 dark:text-slate-400" />
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
            Configurações do Sistema
          </h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={salvarConfiguracoes}
            disabled={salvando}
            className="flex items-center space-x-2"
          >
            {salvando ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sistema" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="sistema" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Sistema</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="interface" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>Interface</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sistema" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome_aplicacao">Nome da Aplicação</Label>
                  <Input
                    id="nome_aplicacao"
                    value={configuracoes.sistema.nome_aplicacao}
                    onChange={(e) => handleInputChange('sistema', 'nome_aplicacao', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="versao">Versão</Label>
                  <Input
                    id="versao"
                    value={configuracoes.sistema.versao}
                    onChange={(e) => handleInputChange('sistema', 'versao', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="manutencao">Modo Manutenção</Label>
                  <Switch
                    id="manutencao"
                    checked={configuracoes.sistema.manutencao}
                    onCheckedChange={(checked) => handleInputChange('sistema', 'manutencao', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="backup_automatico">Backup Automático</Label>
                  <Switch
                    id="backup_automatico"
                    checked={configuracoes.sistema.backup_automatico}
                    onCheckedChange={(checked) => handleInputChange('sistema', 'backup_automatico', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="log_detalhado">Log Detalhado</Label>
                  <Switch
                    id="log_detalhado"
                    checked={configuracoes.sistema.log_detalhado}
                    onCheckedChange={(checked) => handleInputChange('sistema', 'log_detalhado', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="servidor_smtp">Servidor SMTP</Label>
                  <Input
                    id="servidor_smtp"
                    placeholder="smtp.gmail.com"
                    value={configuracoes.email.servidor_smtp}
                    onChange={(e) => handleInputChange('email', 'servidor_smtp', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="porta">Porta</Label>
                  <Input
                    id="porta"
                    type="number"
                    value={configuracoes.email.porta}
                    onChange={(e) => handleInputChange('email', 'porta', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="usuario">Usuário</Label>
                  <Input
                    id="usuario"
                    type="email"
                    value={configuracoes.email.usuario}
                    onChange={(e) => handleInputChange('email', 'usuario', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={configuracoes.email.senha}
                    onChange={(e) => handleInputChange('email', 'senha', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="remetente_padrao">Remetente Padrão</Label>
                <Input
                  id="remetente_padrao"
                  type="email"
                  value={configuracoes.email.remetente_padrao}
                  onChange={(e) => handleInputChange('email', 'remetente_padrao', e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="ssl_ativo">SSL Ativo</Label>
                <Switch
                  id="ssl_ativo"
                  checked={configuracoes.email.ssl_ativo}
                  onCheckedChange={(checked) => handleInputChange('email', 'ssl_ativo', checked)}
                />
              </div>

              <Button onClick={testarConexaoEmail} variant="outline">
                Testar Conexão Email
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessao_timeout">Timeout da Sessão (minutos)</Label>
                  <Input
                    id="sessao_timeout"
                    type="number"
                    value={configuracoes.seguranca.sessao_timeout}
                    onChange={(e) => handleInputChange('seguranca', 'sessao_timeout', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="tentativas_login">Máx. Tentativas de Login</Label>
                  <Input
                    id="tentativas_login"
                    type="number"
                    value={configuracoes.seguranca.tentativas_login}
                    onChange={(e) => handleInputChange('seguranca', 'tentativas_login', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="senha_complexa">Exigir Senha Complexa</Label>
                  <Switch
                    id="senha_complexa"
                    checked={configuracoes.seguranca.senha_complexa}
                    onCheckedChange={(checked) => handleInputChange('seguranca', 'senha_complexa', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="autenticacao_dupla">Autenticação em Duas Etapas</Label>
                  <Switch
                    id="autenticacao_dupla"
                    checked={configuracoes.seguranca.autenticacao_dupla}
                    onCheckedChange={(checked) => handleInputChange('seguranca', 'autenticacao_dupla', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email_novos_registros">Email para Novos Registros</Label>
                  <Switch
                    id="email_novos_registros"
                    checked={configuracoes.notificacoes.email_novos_registros}
                    onCheckedChange={(checked) => handleInputChange('notificacoes', 'email_novos_registros', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="email_prazo_vencimento">Email para Prazos Vencendo</Label>
                  <Switch
                    id="email_prazo_vencimento"
                    checked={configuracoes.notificacoes.email_prazo_vencimento}
                    onCheckedChange={(checked) => handleInputChange('notificacoes', 'email_prazo_vencimento', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="email_nao_conformidades">Email para Não Conformidades</Label>
                  <Switch
                    id="email_nao_conformidades"
                    checked={configuracoes.notificacoes.email_nao_conformidades}
                    onCheckedChange={(checked) => handleInputChange('notificacoes', 'email_nao_conformidades', checked)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="frequencia_relatorios">Frequência dos Relatórios</Label>
                <select
                  id="frequencia_relatorios"
                  value={configuracoes.notificacoes.frequencia_relatorios}
                  onChange={(e) => handleInputChange('notificacoes', 'frequencia_relatorios', e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="diario">Diário</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensal">Mensal</option>
                  <option value="nunca">Nunca</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interface" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Interface</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tema_escuro">Tema Escuro</Label>
                  <Switch
                    id="tema_escuro"
                    checked={configuracoes.interface.tema_escuro}
                    onCheckedChange={(checked) => handleInputChange('interface', 'tema_escuro', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="cores_personalizadas">Cores Personalizadas</Label>
                  <Switch
                    id="cores_personalizadas"
                    checked={configuracoes.interface.cores_personalizadas}
                    onCheckedChange={(checked) => handleInputChange('interface', 'cores_personalizadas', checked)}
                  />
                </div>
              </div>

              {configuracoes.interface.cores_personalizadas && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cor_primaria">Cor Primária</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="cor_primaria"
                        type="color"
                        value={configuracoes.interface.cor_primaria}
                        onChange={(e) => handleInputChange('interface', 'cor_primaria', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={configuracoes.interface.cor_primaria}
                        onChange={(e) => handleInputChange('interface', 'cor_primaria', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cor_secundaria">Cor Secundária</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="cor_secundaria"
                        type="color"
                        value={configuracoes.interface.cor_secundaria}
                        onChange={(e) => handleInputChange('interface', 'cor_secundaria', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={configuracoes.interface.cor_secundaria}
                        onChange={(e) => handleInputChange('interface', 'cor_secundaria', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
