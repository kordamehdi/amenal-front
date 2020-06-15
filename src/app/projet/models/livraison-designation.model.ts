export interface livraisonCategorieModel {
  id: number;
  categorie: string;
  livraisonDesignationPresentations: LivraisonDesignationModel[];
}

export interface LivraisonDesignationModel {
  id: number;
  designation: string;
  articleId: number;
  unite: string;
  destinationNom: string;
  destinationId: number;
  quantite: number;
  observation: string;
  valid: boolean;
}
