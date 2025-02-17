import {
    Grid, TableContainer, Paper, Table, TableCell, TableHead, TableRow,
    TableBody, Button, TablePagination, CircularProgress,
    Dialog, DialogActions, DialogContent, DialogTitle,
    TextField
} from "@mui/material";
import { personModel } from "../../app/models/persons";
// import RequirementRegister from "./RegisterRequirement";
import { useState, useEffect } from "react";
import api from "../../app/api/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { referralsModel } from "../../app/models/referralsModel";
// import UpdateRequirements from "./UpdatedRequirements";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface ReferralProps {
    referrals: referralsModel[];
    setReferrals: React.Dispatch<React.SetStateAction<referralsModel[]>>;
}

export default function ReferraltList({ referrals: referrals, setReferrals: setReferrals }: ReferralProps) {
    const [loading, setLoading] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedRefeerral, setSelectedReferral] = useState<referralsModel | null>(null);
    const [searchId, setSearchId] = useState<number | "">("");

    const handleSearch = async () => {
        if (!searchId) {
            const defaultResponse = await api.referrals.getAllReferrals();
            setReferrals(defaultResponse.data);
            return;
        }
        console.log(searchId);

        setLoading(true);
        try {
            const response = await api.referrals.getReferralsById(Number(searchId));
            if (response && response.data) {
                setReferrals(Array.isArray(response.data) ? response.data : [response.data]);
            } else {
                toast.error("No se encontraron remisiones con ese ID.");
            }

        } catch (error) {
            console.error("Error al obtener remisiones:", error);
            toast.error("Error al obtener remisiones.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddObservation = () => {
        setOpenAddDialog(true);
    };


    const handleEdit = async (id_remision: number) => {
        try {
            const response = await api.requirements.getRequirementById(id_remision);
            setSelectedReferral(response.data);
            setOpenEditDialog(true);
        } catch (error) {
            console.error("Error al cargar los datos de las remisiones:", error);
            toast.error("No se puede acceder a esta remision");
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Lista de Requisitos", 14, 10);

        autoTable(doc, {
            startY: 20,
            head: [["Codigo", "Fecha de Preparacion", "Fecha de Envio", "Correo", "Entidad Destinada", "Estado"]],
            body: referrals.map(ref => [
                ref.id_remision,
                new Date(ref.fecha_preparacion).toLocaleDateString(),
                new Date(ref.fecha_envio).toLocaleDateString(),
                ref.usuario_prepara,
                ref.entidad_destino,
                ref.estado || "N/A"
            ]),
        });

        doc.save("Remisiones.pdf");
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedReferrals = referrals.slice(startIndex, endIndex);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddObservation}
                >
                    Agregar Remisiones
                </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <TextField
                    fullWidth
                    label="Código de Remisión"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value === "" ? "" : Number(e.target.value))}
                    type="number"
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
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDownloadPDF}
                >
                    Descargar PDF
                </Button>
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
                                    Fecha de Preparacion
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Fecha de Envio
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Correo
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Entidad de Destino
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Estado
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Realizar Cambios
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedReferrals.map((referral) => (
                                <TableRow key={referral.id_remision}>
                                    <TableCell align="center">{referral.id_remision}</TableCell>
                                    <TableCell align="center">{new Date(referral.fecha_preparacion).toLocaleDateString()}</TableCell>
                                    <TableCell align="center">{new Date(referral.fecha_envio).toLocaleDateString()}</TableCell>
                                    <TableCell align="center">{referral.usuario_prepara}</TableCell>
                                    <TableCell align="center">{referral.entidad_destino}</TableCell>
                                    <TableCell align="center">{referral.estado}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            color="info"
                                            sx={{ margin: "5px" }}
                                            onClick={() => handleEdit(referral.id_remision)}
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
                count={referrals.length}
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
                <DialogTitle>Agregar Requerimiento</DialogTitle>
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
                    {/* <RequirementRegister identificationPerson={identification} person={personName} idPersona={selectedIdPersona ?? 0}  ></RequirementRegister> */}
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
                    {/* {selectedRequirement && (<UpdateRequirements requirementsData={selectedRequirement} />)} */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )

}