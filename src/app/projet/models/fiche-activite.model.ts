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
  rls: number;
  lastPrct: number;
}
export interface sousLotDesignationModel {
  id: number;
  designation: string;
  unite: string;
  quantite: string;
  rls: number;
  lastAvc: number;
  slotid: number;
  avancement: number;
  entreeDesignationPresentations: entreeDesignationModel[];
  entreeDesignationNonAssoPresentations: EntreeDesignationNonAssoModel[];
}
export interface entreeDesignationModel {
  id: number;
  entreeId: number;
  chargeId: number;
  unite: string;
  entreeNom: string;
  type: string;
  quantite: number;
  isRecomander: boolean;
}

export interface entreeDesignationCommandModel {
  id: number;
  entreeId: number;
  chargeId: number;
  type: string;
  quantite: number;
  rls: number;
}

export interface EntreeDesignationNonAssoModel {
  entreeId: number;
  chargeId: number;
  unite: string;
  rls: number;
  entreeNom: string;
  type: string;
  quantite: number;
  isRecomander: boolean;
}
