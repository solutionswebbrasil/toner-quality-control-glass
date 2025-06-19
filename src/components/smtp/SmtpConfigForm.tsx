
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, AlertTriangle, CheckCircle } from 'lucide-react';
import { smtpConfigService } from '@/services/smtpConfigService';
import { SmtpConfig } from '@/types/smtpConfig';

export const SmtpConfigForm: React.FC = () => {
  const [formData, setFormData] = useState({
    servidor_tipo: 'Gmail' as 'Gmail' | 'Outlook' | 'Personalizado',
    host_smtp: 'smtp.gmail.com',
    porta_smtp: 587,
    email_remetente: '',
    senha_email: '',
    nome_remetente: '',
    usar_tls: true
  });

  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const config = await smtpConfigService.getConfig();
      if (config) {
        setFormData({
          servidor_tipo: config.servidor_tipo,
          host_smtp: config.host_smtp,
          porta_smtp: config.porta_smtp,
          email_remetente: config.email_remetente,
          senha_email: '', // Não carregar senha por segurança
          nome_remetente: config.nome_remetente,
          usar_tls: config.usar_tls
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    }
  };

  const handleServidorChange = (value: 'Gmail' | 'Outlook' | 'Personalizado') => {
    setFormData(prev => {
      const newData = { ...prev, servidor_tipo: value };
      
      if (value === 'Gmail') {
        newData.host_smtp = 'smtp.gmail.com';
        newData.porta_smtp = 587;
        newData.usar_tls = true;
      } else if (value === 'Outlook') {
        newData.host_smtp = 'smtp.office365.com';
        newData.porta_smtp = 587;
        newData.usar_tls = true;
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await smtpConfigService.saveConfig(formData);
      setMessage({ type: 'success', text: 'Configurações SMTP salvas com sucesso!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao salvar configurações SMTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      setMessage({ type: 'error', text: 'Digite um e-mail para teste' });
      return;
    }

    setTesting(true);
    setMessage(null);

    try {
      const success = await smtpConfigService.testEmail(formData, testEmail);
      if (success) {
        setMessage({ type: 'success', text: 'E-mail de teste enviado com sucesso!' });
      } else {
        setMessage({ type: 'error', text: 'Falha ao enviar e-mail de teste' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao testar envio de e-mail' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Configurações de SMTP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="servidor_tipo">Servidor SMTP</Label>
                <Select value={formData.servidor_tipo} onValueChange={handleServidorChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gmail">Gmail</SelectItem>
                    <SelectItem value="Outlook">Outlook</SelectItem>
                    <SelectItem value="Personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="porta_smtp">Porta SMTP</Label>
                <Input
                  id="porta_smtp"
                  type="number"
                  value={formData.porta_smtp}
                  onChange={(e) => setFormData(prev => ({ ...prev, porta_smtp: parseInt(e.target.value) }))}
                />
              </div>

              {formData.servidor_tipo === 'Personalizado' && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="host_smtp">Host SMTP</Label>
                  <Input
                    id="host_smtp"
                    value={formData.host_smtp}
                    onChange={(e) => setFormData(prev => ({ ...prev, host_smtp: e.target.value }))}
                    placeholder="Ex: smtp.seudominio.com"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email_remetente">E-mail do remetente</Label>
                <Input
                  id="email_remetente"
                  type="email"
                  value={formData.email_remetente}
                  onChange={(e) => setFormData(prev => ({ ...prev, email_remetente: e.target.value }))}
                  placeholder="seu-email@gmail.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha_email">Senha do e-mail</Label>
                <Input
                  id="senha_email"
                  type="password"
                  value={formData.senha_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, senha_email: e.target.value }))}
                  placeholder="Digite a senha ou token de app"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nome_remetente">Nome do remetente</Label>
                <Input
                  id="nome_remetente"
                  value={formData.nome_remetente}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome_remetente: e.target.value }))}
                  placeholder="Sistema SGQ Pro"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="usar_tls"
                  checked={formData.usar_tls}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, usar_tls: !!checked }))}
                />
                <Label htmlFor="usar_tls">Usar TLS/SSL</Label>
              </div>
            </div>

            {message && (
              <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
                {message.type === 'error' ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Configurações
              </Button>

              <div className="flex gap-2 flex-1">
                <Input
                  placeholder="E-mail para teste"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  type="email"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleTestEmail}
                  disabled={testing}
                >
                  {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Testar Envio
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
