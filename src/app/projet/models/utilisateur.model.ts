export interface UtilisateurModel {
  id: number;
  username: string;
  password: string;
  isRoot: boolean;
  roles: RoleByProjetModel[];
}

export interface RoleByProjetModel {
  id: number;
  projet: string;
  role: string;
}

export interface UtilisateurWithRoleCommandeModel {
  username: string;
  pid: number;
  role: string;
}
