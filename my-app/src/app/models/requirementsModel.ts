export interface requirementsModel {
    id_requisito: number;
    id_persona: number;
    tipo_requisito: number;
    estado: string;
    fecha_vigencia: Date;
    fecha_vecimiento: Date;
    observaciones: string;
    identificacion?: string;
  }