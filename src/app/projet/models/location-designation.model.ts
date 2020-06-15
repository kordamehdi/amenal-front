export interface locationDesignationModel {
  id: number;
  libelle: string;
  idMateriel: number;
  tempsDebut: any;
  tempsFin: any;
  travailleLoc: number;
  quantite: number;
  fournisseurId: number;
  fournisseurNom: string;
  observation: string;
  idFiche: number;
  idProjet: number;
}
