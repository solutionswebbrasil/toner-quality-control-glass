
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Search, 
  Edit, 
  Trash2, 
  Shield, 
  Crown, 
  User, 
  RefreshCw,
  AlertTriangle 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Profile {
  id: string;
  nome_completo: string;
  email: string;
  role: string;
  created_at: string;
}

export const ConsultaUsuarios: React.FC = () => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfiles();
  }, []);

  useEffect(() => {
    const filtered = profiles.filter(profile =>
      profile.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProfiles(filtered);
  }, [profiles, searchTerm]);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Carregando perfis de usuários...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar perfis:', error);
        setError('Erro ao carregar usuários: ' + error.message);
      } else {
        console.log(`Perfis carregados: ${data?.length || 0}`);
        setProfiles(data || []);
      }
    } catch (error) {
      console.error('Erro interno:', error);
      setError('Erro interno ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: Profile) => {
    toast({
      title: "Editar Usuário",
      description: `Funcionalidade de edição para ${user.nome_completo} será implementada.`,
    });
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário ${userEmail}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Erro ao deletar usuário:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir usuário",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso!",
      });
      
      loadProfiles();
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Erro interno",
        variant: "destructive"
      });
    }
  };

  const handleManagePermissions = (user: Profile) => {
    toast({
      title: "Gerenciar Permissões",
      description: `Gerenciamento de permissões para ${user.nome_completo} será implementado.`,
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <Crown className="h-3 w-3" />
            Admin
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <User className="h-3 w-3" />
            Usuário
          </Badge>
        );
    }
  };

  // Verificar permissão de acesso
  if (!hasPermission('Configurações', 'Usuários', 'visualizar')) {
    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Você não tem permissão para acessar a consulta de usuários.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Consulta de Usuários</h1>
          <Badge variant="outline">{profiles.length} usuários</Badge>
        </div>
        
        <Button
          variant="outline"
          onClick={loadProfiles}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Usuários</span>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'Nenhum usuário encontrado com o termo pesquisado' : 'Nenhum usuário encontrado'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">
                      {profile.nome_completo}
                    </TableCell>
                    <TableCell>{profile.email}</TableCell>
                    <TableCell>{getRoleBadge(profile.role)}</TableCell>
                    <TableCell>
                      {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {hasPermission('Configurações', 'Usuários', 'editar') && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditUser(profile)}
                              className="flex items-center gap-1"
                            >
                              <Edit className="h-4 w-4" />
                              Editar
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleManagePermissions(profile)}
                              className="flex items-center gap-1"
                            >
                              <Shield className="h-4 w-4" />
                              Permissões
                            </Button>
                            
                            {profile.role !== 'admin' && hasPermission('Configurações', 'Usuários', 'excluir') && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteUser(profile.id, profile.email)}
                                className="flex items-center gap-1"
                              >
                                <Trash2 className="h-4 w-4" />
                                Excluir
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
