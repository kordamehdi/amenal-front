export interface lotModel {
  id: number;
  designation: string;
  avancement: number;
  sousLots: sousLotModel[];
}
export interface sousLotModel {
  id: number;
  designation: string;
  avancement: number;
  unite: string;
  entrees: entreeModel[];
}
export interface entreeModel {
  id: number;
  type: string;
  unite: string;
  entreeNom: string;
  idEntree: number;
  quantiteEstimer: number;
}
