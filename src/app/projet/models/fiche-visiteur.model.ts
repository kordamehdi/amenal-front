export interface visiteurModel {
  id: number;
  nom: string;
  organisme: string;
  isAsso: boolean;
}
export interface VisiteurDesignationModel {
  id: number;
  nom: string;
  organisme: string;
  objet: string;
  depart: any;
  arivee: any;
  visiteurId: number;
  idFiche: number;
}
