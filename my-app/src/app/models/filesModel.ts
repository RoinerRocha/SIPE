export  interface filesModel {
    codigo: number;
    id_persona: number;
    identificacion: string;
    tipo_expediente: string;
    estado: string;
    fecha_creacion: Date;
    fecha_emitido: Date;
    fecha_enviado_entidad: Date;
    ubicacion: string;
    etiqueta: string;
    entidad: string;
    observaciones: string;
    remitente: string;
    asignadoa: string;
}