import { MaterielModel } from "./materiel.model";
export interface FournisseurModel {
  id: number;
  fournisseurNom: string;
  materiel: MaterielModel;
  materiels: MaterielModel[];
  isAssoWithProjet: Boolean;
}
