export interface besionModel {
  id: number;
  type: string;
  unite: string;
  besoin: string;
}

export interface besoinDesignationModel {
  BesoinId: number;
  BesoinType: string;
  designation: string;
  unite: string;
  quantite: number;
  dateDemande: any;
  datePrevu: any;
  retard: number;
  satisfaction: boolean;
  observation: string;
  valid: boolean;
  idFiche: number;
}
