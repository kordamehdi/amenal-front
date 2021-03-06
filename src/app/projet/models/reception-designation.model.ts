export interface ReceptionCategorieModel {
  id: number;
  categorie: string;
  receptionDesignation: ReceptionDesignationModel[];
}

export interface ReceptionDesignationModel {
  id: number;
  idArticle: number;
  idFournisseur: number;
  designation: string;
  unite: string;
  quantite: number;
  fournisseurNom: string;
  brf: string;
  observation: string;
  idFiche: number;
  catId: number;
}
