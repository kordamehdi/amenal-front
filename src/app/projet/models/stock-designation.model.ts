export interface stockModel {
  categorie: string;
  stockable: boolean;
  stockDesignations: StockDesignationModel[];
}
export interface StockDesignationModel {
  designation: string;
  articleId: number;
  unite: string;
  quantite: number;
  stockable: boolean;
}
