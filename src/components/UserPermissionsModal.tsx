
import React, { useState, useEffect } from 'react';
import { Usuario, Permissao } from '@/types/auth';
import { authService } from '@/services/authService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, Shield } from 'lucide-react';

interface UserPermissionsModalProps {
  user: Usuario;
  isOpen: boolean;
  onClose: () => void;
}

const MODULOS_SUBMENUS = [
  { modulo: 'Retornados', submenus: ['Registro', 'Consulta', 'Gráficos'] },
  { modulo: 'Garantias', submenus: ['Fornecedores Cadastro', 'Fornecedores Consulta', 'Registro', 'Consulta', 'Gráficos Gerais', 'Garantias Toners', 'Toners Consulta', 'Toners Gráficos'] },
  { modulo: 'Auditorias', submenus: ['Registro', 'Consulta'] },
  { modulo: 'Não Conformidades', submenus: ['Registro', 'Consulta', 'Gráficos'] },
  { modulo: 'IT/POP', submenus: ['Título Cadastro', 'Título Consulta', 'Registro', 'Registros Consulta', 'Visualizar'] },
  { modulo: 'BPMN', submenus: ['Título Cadastro', 'Título Consulta', 'Registro', 'Registros Consulta', 'Visualizar'] },
  { modulo: 'Certificados', submenus: ['Registro', 'Consulta'] },
  { modulo: 'Configurações', submenus: ['Filiais Cadastro', 'Filiais Consulta', 'Retornado', 'Usuários'] }
];

export const UserPermissionsModal: React.FC<UserPermissionsModalProps> = ({
  user,
  isOpen,
  onClose
}) => {
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      loadPermissoes();
    }
  }, [isOpen, user]);

  const loadPermissoes = async () => {
    try {
      setLoading(true);
      const data = await authService.getPermissoesByUsuario(user.id);
      setPermissoes(data);
    } catch (error) {
      setError('Erro ao carregar permissões');
    } finally {
      setLoading(false);
    }
  };

  const getPermissao = (modulo: string, submenu: string) => {
    return permissoes.find(p => p.modulo === modulo && p.submenu === submenu);
  };

  const updatePermissao = (modulo: string, submenu: string, acao: keyof Omit<Permissao, 'id' | 'usuario_id' | 'modulo' | 'submenu'>, value: boolean) => {
    setPermissoes(prev => {
      const existing = prev.find(p => p.modulo === modulo && p.submenu === submenu);
      
      if (existing) {
        return prev.map(p => 
          p.modulo === modulo && p.submenu === submenu 
            ? { ...p, [acao]: value }
            : p
        );
      } else {
        const newPermission: Permissao = {
          id: `temp-${Date.now()}`,
          usuario_id: user.id,
          modulo,
          submenu,
          pode_ver: acao === 'pode_ver' ? value : false,
          pode_editar: acao === 'pode_editar' ? value : false,
          pode_excluir: acao === 'pode_excluir' ? value : false,
          pode_cadastrar: acao === 'pode_cadastrar' ? value : false,
          pode_baixar: acao === 'pode_baixar' ? value : false,
        };
        return [...prev, newPermission];
      }
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await authService.updateUserPermissions(user.id, permissoes);
      onClose();
    } catch (error) {
      setError('Erro ao salvar permissões');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permissões de {user.nome_completo}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="p-6 text-center">Carregando permissões...</div>
        ) : (
          <div className="space-y-6">
            {MODULOS_SUBMENUS.map(({ modulo, submenus }) => (
              <div key={modulo} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4 text-blue-600">{modulo}</h3>
                
                <div className="space-y-3">
                  {submenus.map((submenu) => {
                    const permissao = getPermissao(modulo, submenu);
                    
                    return (
                      <div key={submenu} className="border-l-2 border-gray-200 pl-4">
                        <h4 className="font-medium mb-2">{submenu}</h4>
                        <div className="grid grid-cols-5 gap-4">
                          {(['pode_ver', 'pode_editar', 'pode_excluir', 'pode_cadastrar', 'pode_baixar'] as const).map((acao) => (
                            <div key={acao} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${modulo}-${submenu}-${acao}`}
                                checked={permissao?.[acao] || false}
                                onCheckedChange={(checked) => 
                                  updatePermissao(modulo, submenu, acao, checked as boolean)
                                }
                              />
                              <label 
                                htmlFor={`${modulo}-${submenu}-${acao}`}
                                className="text-sm font-medium"
                              >
                                {acao.replace('pode_', '').charAt(0).toUpperCase() + acao.replace('pode_', '').slice(1)}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {saving ? 'Salvando...' : 'Salvar Permissões'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
