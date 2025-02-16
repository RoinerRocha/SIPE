import {
    Grid, TableContainer, Paper, Table, TableCell, TableHead, TableRow,
    TableBody, Button, TablePagination, CircularProgress,
    Dialog, DialogActions, DialogContent, DialogTitle,
    TextField
} from "@mui/material";

import { personModel } from "../../app/models/persons";
import { useState, useEffect } from "react";
import api from "../../app/api/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { requirementsModel } from "../../app/models/requirementsModel";

interface RequirementProps {
    requirements: requirementsModel[];
    setRequirements: React.Dispatch<React.SetStateAction<requirementsModel[]>>;
}

export default function RequirementList({ requirements: requirements, setRequirements: setRequirements }: RequirementProps) {
    const [loading, setLoading] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedRequirement, setSelectedRequirement] = useState<requirementsModel | null>(null);
    const [identification, setIdentification] = useState("");
    const [selectedIdPersona, setSelectedIdPersona] = useState<number | null>(null);
    const [personName, setPersonName] = useState("");

    const handleSearch = async () => {
        if (!identification) {
            const defaultResponse = await api.requirements.getAllRequirements();
            setRequirements(defaultResponse.data);
            setPersonName("");
            return;
        }

        setLoading(true);
        try {
            const response = await api.requirements.getRequirementByIdentification(identification);
            if (response && Array.isArray(response.data)) {
                setRequirements(response.data);
                const personResponse = await api.persons.getPersonByIdentification(identification);
                const fullName = `${personResponse.data.nombre || ""} ${personResponse.data.primer_apellido || ""} ${personResponse.data.segundo_apellido || ""}`.trim();
                setPersonName(fullName);
            } else {
                console.error("La respuesta de la API no es un array de requerimientos:", response);
                toast.error("No se encontraron requerimientos con esa identificación.");
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

    const handleAddObservation = async () => {
        // Primero intentamos encontrar el pago en los pagos existentes
        const foundObservation = requirements.find(obs => obs.identificacion === identification);

        if (foundObservation) {
            // Si encontramos el pago, tomamos el id_persona asociado
            setSelectedIdPersona(foundObservation.id_persona);
        } else {
            // Si no encontramos el pago, hacemos una consulta para obtener el id_persona
            try {
                const personResponse = await api.persons.getPersonByIdentification(identification);
                if (personResponse.data) {
                    setSelectedIdPersona(personResponse.data.id_persona);
                    setPersonName(`${personResponse.data.nombre || ""} ${personResponse.data.primer_apellido || ""} ${personResponse.data.segundo_apellido || ""}`); // Asignamos el nombre completo // Establecemos el id_persona
                } else {
                    toast.warning("No se encontró persona con esa identificación.");
                    return; // Si no se encuentra la persona, no abrimos el diálogo
                }
            } catch (error) {
                console.error("Error al obtener persona:", error);
                toast.error("Error al obtener información de la persona.");
                return; // Si hay un error en la consulta, no abrimos el diálogo
            }
        }

        // Abrimos el diálogo para agregar el pago
        setOpenAddDialog(true);
    };

    const handleEdit = async (id_requisito: number) => {
        try {
            const response = await api.requirements.getRequirementById(id_requisito);
            setSelectedRequirement(response.data);
            setOpenEditDialog(true);
        } catch (error) {
            console.error("Error al cargar los datos de los requerimientos:", error);
            toast.error("No se puede acceder a este pago inactiva");
        }
    };


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedRequirements = requirements.slice(startIndex, endIndex);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddObservation}
                >
                    Agregar Pagos
                </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
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
                                    ID de la persona
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Tipo de requisito
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Estado
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Fecha de Vigencia
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Fecha de vencimiento
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Observaciones
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Realizar Cambios
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedRequirements.map((requirement) => (
                                <TableRow key={requirement.id_requisito}>
                                    <TableCell align="center">{requirement.id_persona}</TableCell>
                                    <TableCell align="center">{requirement.tipo_requisito}</TableCell>
                                    <TableCell align="center">{requirement.estado}</TableCell>
                                    <TableCell align="center">{new Date(requirement.fecha_vigencia).toLocaleDateString()}</TableCell>
                                    <TableCell align="center">{new Date(requirement.fecha_vecimiento).toLocaleDateString()}</TableCell>
                                    <TableCell align="center">{requirement.observaciones}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            color="info"
                                            sx={{ margin: "5px" }}
                                            onClick={() => handleEdit(requirement.id_requisito)}
                                        >
                                            Editar
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
                count={requirements.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
            />
            <Dialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                maxWidth="lg" // Ajusta el tamaño máximo del diálogo. Opciones: 'xs', 'sm', 'md', 'lg', 'xl'.
                fullWidth
            >
                <DialogTitle>Agregar Pagos</DialogTitle>
                <DialogContent
                    sx={{
                        display: 'flex', // Por ejemplo, para organizar los elementos internos.
                        flexDirection: 'column', // Organiza los hijos en una columna.
                        gap: 2, // Espaciado entre elementos.
                        height: '1200px',
                        width: '1200px', // Ajusta la altura según necesites.
                        overflowY: 'auto', // Asegura que el contenido sea desplazable si excede el tamaño.
                    }}
                >
                    {/* <PaymentRegister identificationPerson={identification} person={personName} idPersona={selectedIdPersona ?? 0}  ></PaymentRegister> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                maxWidth="lg" // Ajusta el tamaño máximo del diálogo. Opciones: 'xs', 'sm', 'md', 'lg', 'xl'.
                fullWidth
            >
                <DialogTitle>Editar Direccion</DialogTitle>
                <DialogContent
                    sx={{
                        display: 'flex', // Por ejemplo, para organizar los elementos internos.
                        flexDirection: 'column', // Organiza los hijos en una columna.
                        gap: 2, // Espaciado entre elementos.
                        height: '1200px',
                        width: '1200px', // Ajusta la altura según necesites.
                        overflowY: 'auto', // Asegura que el contenido sea desplazable si excede el tamaño.
                    }}>
                    {/* {selectedPayment && (<UpdatePayment PaymentsData={selectedPayment} />)} */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
};