export interface visiteurModel {
  id: number;
  nom: string;
  organisme: string;
  permanent: boolean;
  isAsso: boolean;
}
export interface VisiteurDesignationModel {
  id: number;
  nom: string;
  organisme: string;
  objet: string;
  debut: any;
  debut_sys: any;
  fin: any;
  fin_sys: any;
  visiteurId: number;
  idFiche: number;
}
