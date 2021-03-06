export interface locationDesignationModel {
  id: number;
  libelle: string;
  unite: string;
  idMateriel: number;
  tempsDebut: any;
  tempsFin: any;
  travailleLoc: number;
  quantite: number;
  fournisseurId: number;
  fournisseurNom: string;
  observation: string;
  brf: string;
  idFiche: number;
  idProjet: number;
}
