import { articleModel } from "./article.model";
import { categorieModel } from "./categorie.model";
export interface fournisseurArticleModel {
  id: number;
  fournisseurNom: string;
  isAssoWithProjet: Boolean;
  article: articleModel;
  categories: categorieModel[];
}
