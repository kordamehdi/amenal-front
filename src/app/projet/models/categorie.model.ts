import { articleModel } from "./article.model";
export interface categorieModel {
  id: number;
  categorie: string;
  isAssoWithProjet: boolean;
  articles: articleModel[];
  show: boolean;
}
