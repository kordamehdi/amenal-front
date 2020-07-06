export interface lotModel {
  id: number;
  designation: string;
  isAsso: boolean;
  sousLots: sousLotModel[];
}
export interface sousLotModel {
  id: number;
  designation: string;
  isAsso: boolean;
  unite: string;
  entrees: entreeModel[];
}
export interface entreeModel {
  id: number;
  type: string;
  unite: string;
  entreeNom: string;
  idEntree: number;
  bdg: number;
}
export interface entreeNonAssoModel {
  id: number;
  type: string;
  unite: string;
  entreeNom: string;
}
