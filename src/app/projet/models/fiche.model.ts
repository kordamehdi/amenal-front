import { ouvrierDesignationModel } from "./ouvrierDesignation.model";

export interface FicheModel {
  id: number;
  count: number;
  date: any;
  isValidated: boolean;
  ouvrierDesignations: ouvrierDesignationModel[];
}
