import { MaterielModel } from "./materiel.model";
export interface FournisseurModel {
  id: number;
  materiel: MaterielModel;
  fournisseurNom: string;
  materiels: MaterielModel[];
  matIndicator: string;
  isAssoWithProjet: Boolean;
}
