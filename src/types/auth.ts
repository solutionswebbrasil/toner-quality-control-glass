
export interface Usuario {
  id: string;
  nome_completo: string;
  usuario: string;
  senha: string;
  criado_em: string;
}

export interface Permissao {
  id: string;
  usuario_id: string;
  modulo: string;
  submenu: string;
  pode_ver: boolean;
  pode_editar: boolean;
  pode_excluir: boolean;
  pode_cadastrar: boolean;
  pode_baixar: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  usuario: Usuario | null;
  permissoes: Permissao[];
}

export interface LoginCredentials {
  usuario: string;
  senha: string;
}
