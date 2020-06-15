export interface OuvrierModel {
  id: number;
  cin: string;
  nom: string;
  prenom: string;
  qualification: String;
  dateNaissance: Date;
  dateRecrutement: Date;
  J_TRV: number;
  tele: string;
  appreciation: string;
  idProjets: [];
}
