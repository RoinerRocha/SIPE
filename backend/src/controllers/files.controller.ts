import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import sequelize from "../database/SqlServer";

export const updateFiles = async (req: Request, res: Response): Promise<void> => {
    const { codigo } = req.params;
    const {
        tipo_expediente,
        estado,
        fecha_creacion,
        fecha_emitido,
        fecha_enviado_entidad,
        ubicacion,
        etiqueta,
        entidad,
        observaciones,
        remitente,
        asignadoa,
    } = req.body;

    try {
        await sequelize.query(
            `EXEC sp_gestion_expediente @tipo = 'U',
                                @id_persona = NULL,
                                @identificacion = NULL,
                                @tipo_expediente = :tipo_expediente,
                                @codigo = :codigo,
                                @estado = :estado,
                                @fecha_creacion = :fecha_creacion,
                                @fecha_emitido = :fecha_emitido,
                                @fecha_enviado_entidad = :fecha_enviado_entidad,
                                @ubicacion = :ubicacion,
                                @etiqueta = :etiqueta,
                                @entidad = :entidad,
                                @observaciones = :observaciones,
                                @remitente = :remitente,
                                @asignadoa = :asignadoa`,
            {
                replacements: {
                    codigo,
                    tipo_expediente,
                    estado,
                    fecha_creacion,
                    fecha_emitido,
                    fecha_enviado_entidad,
                    ubicacion,
                    etiqueta,
                    entidad,
                    observaciones,
                    remitente,
                    asignadoa
                },
                type: QueryTypes.UPDATE
            }
        );

        res.status(200).json({ message: "Expediente actualizado exitosamente" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getFilesByPerson = async (req: Request, res: Response): Promise<void> => {
    const { identificacion } = req.params;

    try {
        const contactos = await sequelize.query(
            `EXEC sp_gestion_expediente @tipo = 'Q', @identificacion = :identificacion, @codigo = NULL, @id_persona = NULL, @tipo_expediente = NULL`,
            {
                replacements: { identificacion },
                type: QueryTypes.SELECT,
            }
        );

        if (!contactos.length) {
            res.status(404).json({ message: "No se encontraron expedientes para esta persona" });
            return;
        }

        res.status(200).json({ data: contactos });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const getHistoryFiles = async (req: Request, res: Response): Promise<void> => {
    const { codigo } = req.params;

    try {
        const miembro = await sequelize.query(
            `EXEC sp_gestion_expediente @tipo = 'B', @codigo = :codigo, @id_persona = NULL, @identificacion = NULL, @tipo_expediente = NULL`,
            {
                replacements: { codigo },
                type: QueryTypes.SELECT
            }
        );

        if (!miembro.length) {
            res.status(404).json({ message: "Expediente no encontrado" });
            return;
        }

        // Devuelve todos los resultados en lugar del primero
        res.status(200).json({ data: miembro });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getFilesByIdPerson = async (req: Request, res: Response): Promise<void> => {
    const { id_persona } = req.params;

    try {
        const miembro = await sequelize.query(
            `EXEC sp_gestion_expediente @tipo = 'P', @id_persona = :id_persona, @codigo = NULL, @identificacion = NULL`,
            {
                replacements: { id_persona },
                type: QueryTypes.SELECT
            }
        );

        if (!miembro.length) {
            res.status(404).json({ message: "Expediente no encontrado" });
            return;
        }

        // Devuelve todos los resultados en lugar del primero
        res.status(200).json({ data: miembro });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export const getFilesByCode = async (req: Request, res: Response): Promise<void> => {
    const { codigo } = req.params;

    try {
        const miembro = await sequelize.query(
            `EXEC sp_gestion_expediente @tipo = 'S', @codigo = :codigo, @id_persona = NULL, @identificacion = NULL, @tipo_expediente = NULL`,
            {
                replacements: { codigo },
                type: QueryTypes.SELECT
            }
        );

        if (!miembro.length) {
            res.status(404).json({ message: "Expediente no encontrado" });
            return;
        }

        res.status(200).json({ data: miembro[0] });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllFiles = async (req: Request, res: Response): Promise<void> => {
    try {
        const files = await sequelize.query(
            "EXEC sp_gestion_expediente @tipo = 'A', @codigo = NULL, @id_persona = NULL, @identificacion = NULL, @tipo_expediente = NULL", // Agregamos @id_persona
            {
                type: QueryTypes.SELECT, // Tipo de operación SELECT
            }
        );

        res.status(200).json({ message: "Listado de expedientes exitoso", data: files });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};