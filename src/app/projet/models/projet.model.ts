import { OuvrierModel } from "./ouvrier.model";
export interface ProjetModel {
  id: number;
  intitule: string;
  abreveation: string;
  debut: Date;
  fin: Date;
  description: string;
  fichierTypes: string[];
  ouvriers: OuvrierModel[];
}
