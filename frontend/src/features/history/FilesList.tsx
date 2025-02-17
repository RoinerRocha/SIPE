import {
    Grid, TableContainer, Paper, Table, TableCell, TableHead, TableRow,
    TableBody, Button, TablePagination, CircularProgress,
    Dialog, DialogActions, DialogContent, DialogTitle,
    TextField
} from "@mui/material";

import { filesModel } from "../../app/models/filesModel";
import { useState, useEffect } from "react";
import api from "../../app/api/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import UpdateFiles from "./UpdatedFiles";


interface FilesProps {
    files: filesModel[];
    setFiles: React.Dispatch<React.SetStateAction<filesModel[]>>;
}

export default function FilesList({ files, setFiles }: FilesProps) {
    const [loading, setLoading] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState<filesModel | null>(null);
    const [identification, setIdentification] = useState("");
    const [selectedIdPersona, setSelectedIdPersona] = useState<number | null>(null);
    const [personName, setPersonName] = useState("");

    const handleSearch = async () => {
        if (!identification) {
            const defaultResponse = await api.history.getAllFiles();
            setFiles(defaultResponse.data);
            setPersonName("");
            return;
        }

        setLoading(true);
        try {
            const response = await api.history.getFilesByPerson(identification);
            if (response && Array.isArray(response.data)) {
                setFiles(response.data);
                const personResponse = await api.persons.getPersonByIdentification(identification);
                const fullName = `${personResponse.data.nombre || ""} ${personResponse.data.primer_apellido || ""} ${personResponse.data.segundo_apellido || ""}`.trim();
                setPersonName(fullName);
            } else {
                console.error("La respuesta de la API no es un array de pagos:", response);
                toast.error("No se encontraron expedientes con esa identificación.");
                setPersonName("");
            }
        } catch (error) {
            console.error("Error al obtener pagos:", error);
            toast.error("Error al obtener pagos.");
            setPersonName("");
        } finally {
            setLoading(false);
        }
    };

    const handleAddObservation = () => {
        const foundObservation = files.find(obs => obs.identificacion === identification);
        if (foundObservation) {
            setSelectedIdPersona(foundObservation.id_persona);
        } else {
            setSelectedIdPersona(null);
            toast.warning("No se encontró un ID de persona para este expediente.");
            return;
        }
        setOpenAddDialog(true);
    };

    const handleEdit = async (codigo: number) => {
        try {
            const response = await api.history.getFilesByCode(codigo);
            setSelectedFile(response.data);
            setOpenEditDialog(true);
        } catch (error) {
            console.error("Error al cargar los datos de los pagos:", error);
            toast.error("No se puede acceder a este expediente");
        }
    };


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedFiles = files.slice(startIndex, endIndex);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    fullWidth
                    label="Número de Identificación"
                    value={identification}
                    onChange={(e) => setIdentification(e.target.value)}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    fullWidth
                    disabled={loading}
                >
                    {loading ? "Buscando..." : "Buscar"}
                </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    fullWidth
                    label="Nombre de la persona"
                    value={personName}
                    InputProps={{ readOnly: true }}
                />
            </Grid>
            <TableContainer component={Paper}>
                {loading ? (
                    <CircularProgress sx={{ margin: "20px auto", display: "block" }} />
                ) : (
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Codigo
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    ID de la persona
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Tipo de expediente
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Estado
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Fecha de creacion
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Fecha de emision
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Fecha Envio Entidad
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Ubicacion
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Etiqueta
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Entidad
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Observaciones
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Remitente
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Asignado(a)
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Realizar Cambios
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedFiles.map((files) => (
                                <TableRow key={files.codigo}>
                                    <TableCell align="center">{files.codigo}</TableCell>
                                    <TableCell align="center">{files.id_persona}</TableCell>
                                    <TableCell align="center">{files.tipo_expediente}</TableCell>
                                    <TableCell align="center">{files.estado}</TableCell>
                                    <TableCell align="center">{new Date(files.fecha_creacion).toLocaleDateString()}</TableCell>
                                    <TableCell align="center">{new Date(files.fecha_emitido).toLocaleDateString()}</TableCell>
                                    <TableCell align="center">{new Date(files.fecha_enviado_entidad).toLocaleDateString()}</TableCell>
                                    <TableCell align="center">{files.ubicacion}</TableCell>
                                    <TableCell align="center">{files.etiqueta}</TableCell>
                                    <TableCell align="center">{files.entidad}</TableCell>
                                    <TableCell align="center">{files.observaciones}</TableCell>
                                    <TableCell align="center">{files.remitente}</TableCell>
                                    <TableCell align="center">{files.asignadoa}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            color="info"
                                            sx={{ margin: "5px" }}
                                            onClick={() => handleEdit(files.codigo)}
                                        >
                                            Editar Expediente
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={files.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 5))}
            />
            <Dialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                maxWidth="lg" // Ajusta el tamaño máximo del diálogo. Opciones: 'xs', 'sm', 'md', 'lg', 'xl'.
                fullWidth
            >
                <DialogTitle>Editar Expediente</DialogTitle>
                <DialogContent
                    sx={{
                        display: 'flex', // Por ejemplo, para organizar los elementos internos.
                        flexDirection: 'column', // Organiza los hijos en una columna.
                        gap: 2, // Espaciado entre elementos.
                        height: '1200px',
                        width: '1200px', // Ajusta la altura según necesites.
                        overflowY: 'auto', // Asegura que el contenido sea desplazable si excede el tamaño.
                    }}>
                    {selectedFile && (<UpdateFiles FilesData={selectedFile} />)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}