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
  tempsDiff: string;
  jour: number;
  hsup: any;
  epi: boolean;
  jourValid: boolean;
  hsupValid: boolean;
  valid: boolean;
}
