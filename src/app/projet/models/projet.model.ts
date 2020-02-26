import { OuvrierModel } from "./ouvrier.model";
export interface ProjetModel {
  id: number;
  titre: String;
  fichierTypes: String[];
  ouvriers: OuvrierModel[];
}
