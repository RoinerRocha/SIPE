"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFiles = exports.getFilesByCode = exports.getFilesByIdPerson = exports.getHistoryFiles = exports.getFilesByPerson = exports.updateFiles = void 0;
const sequelize_1 = require("sequelize");
const SqlServer_1 = __importDefault(require("../database/SqlServer"));
const updateFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { codigo } = req.params;
    const { tipo_expediente, estado, fecha_creacion, fecha_emitido, fecha_enviado_entidad, ubicacion, etiqueta, entidad, observaciones, remitente, asignadoa, } = req.body;
    try {
        yield SqlServer_1.default.query(`EXEC sp_gestion_expediente @tipo = 'U',
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
                                @asignadoa = :asignadoa`, {
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
            type: sequelize_1.QueryTypes.UPDATE
        });
        res.status(200).json({ message: "Expediente actualizado exitosamente" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateFiles = updateFiles;
const getFilesByPerson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { identificacion } = req.params;
    try {
        const contactos = yield SqlServer_1.default.query(`EXEC sp_gestion_expediente @tipo = 'Q', @identificacion = :identificacion, @codigo = NULL, @id_persona = NULL, @tipo_expediente = NULL`, {
            replacements: { identificacion },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (!contactos.length) {
            res.status(404).json({ message: "No se encontraron expedientes para esta persona" });
            return;
        }
        res.status(200).json({ data: contactos });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getFilesByPerson = getFilesByPerson;
const getHistoryFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { codigo } = req.params;
    try {
        const miembro = yield SqlServer_1.default.query(`EXEC sp_gestion_expediente @tipo = 'B', @codigo = :codigo, @id_persona = NULL, @identificacion = NULL, @tipo_expediente = NULL`, {
            replacements: { codigo },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (!miembro.length) {
            res.status(404).json({ message: "Expediente no encontrado" });
            return;
        }
        // Devuelve todos los resultados en lugar del primero
        res.status(200).json({ data: miembro });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getHistoryFiles = getHistoryFiles;
const getFilesByIdPerson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_persona } = req.params;
    try {
        const miembro = yield SqlServer_1.default.query(`EXEC sp_gestion_expediente @tipo = 'P', @id_persona = :id_persona, @codigo = NULL, @identificacion = NULL`, {
            replacements: { id_persona },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (!miembro.length) {
            res.status(404).json({ message: "Expediente no encontrado" });
            return;
        }
        // Devuelve todos los resultados en lugar del primero
        res.status(200).json({ data: miembro });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getFilesByIdPerson = getFilesByIdPerson;
const getFilesByCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { codigo } = req.params;
    try {
        const miembro = yield SqlServer_1.default.query(`EXEC sp_gestion_expediente @tipo = 'S', @codigo = :codigo, @id_persona = NULL, @identificacion = NULL, @tipo_expediente = NULL`, {
            replacements: { codigo },
            type: sequelize_1.QueryTypes.SELECT
        });
        if (!miembro.length) {
            res.status(404).json({ message: "Expediente no encontrado" });
            return;
        }
        res.status(200).json({ data: miembro[0] });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getFilesByCode = getFilesByCode;
const getAllFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield SqlServer_1.default.query("EXEC sp_gestion_expediente @tipo = 'A', @codigo = NULL, @id_persona = NULL, @identificacion = NULL, @tipo_expediente = NULL", // Agregamos @id_persona
        {
            type: sequelize_1.QueryTypes.SELECT, // Tipo de operación SELECT
        });
        res.status(200).json({ message: "Listado de expedientes exitoso", data: files });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllFiles = getAllFiles;
