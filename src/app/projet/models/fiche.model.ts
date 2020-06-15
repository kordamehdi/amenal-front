import { ReceptionCategorieModel } from "./reception-designation.model";
import { categorieModel } from "./categorie.model";
import { ouvrierDesignationModel } from "./ouvrierDesignation.model";
import { stockModel } from "./stock-designation.model";
import { livraisonCategorieModel } from "./livraison-designation.model";

export interface FicheModel {
  id: number;
  type: string;
  count: number;
  date: any;
  isValidated: boolean;
  categories: ReceptionCategorieModel[];
  designations: any;
  stockDesignations: stockModel[];
  categorieLivraisons: livraisonCategorieModel[];
}
