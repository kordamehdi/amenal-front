export interface activiteDesignationModel {
  id: number;
  lot: string;
  lotId: number;
  sousLotDesignationPresentations: sousLotDesignationModel[];
}
export interface lotAssoModel {
  id: number;
  lot: string;
  sousLots: sousLotAssoModel[];
}
export interface sousLotAssoModel {
  id: number;
  designation: string;
  unite: string;
  qtCml: number;
  lastPrct: number;
}
export interface sousLotDesignationModel {
  id: number;
  designation: string;
  unite: string;
  quantite: string;
  qtCml: number;
  lastAvc: number;
  slotid: number;
  avancement: number;
  entreeDesignationPresentations: entreeDesignationModel[];
  entreeDesignationNonAssoPresentations: EntreeDesignationNonAssoModel[];
}
export interface entreeDesignationModel {
  id: number;
  unite: string;
  entreeNom: string;
  idEntree: number;
  type: string;
  quantite: number;
  isRecomander: boolean;
}

export interface entreeDesignationCommandModel {
  type: string;
  quantite: number;
  entreeId: number;
}

export interface EntreeDesignationNonAssoModel {
  id: number;
  unite: string;
  entreeNom: string;
  type: string;
  quantite: number;
  isRecomander: boolean;
}
