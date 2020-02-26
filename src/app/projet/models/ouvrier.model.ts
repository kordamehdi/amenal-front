export interface OuvrierModel {
  id: number;
  cin: string;
  nom: string;
  prenom: String;
  qualification: String;
  dateNaissance: Date;
  dateRecrutement: Date;
  J_TRV: number;
  tele: string;
  appreciation: string;
  idProjets: [];
}
