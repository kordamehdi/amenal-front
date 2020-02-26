export interface ouvrierDesignationModel {
  id: number;
  idOuvrier: number;
  nom: string;
  prenom: string;
  cin: string;
  qualification: string;
  idFiche: number;
  tempsDebut: any;
  tempsFin: any;
  jour: number;
  travail: string;
  hsup: any;
  epi: boolean;
  valid: boolean;
}
