import {
    Grid, TableContainer, Paper, Table, TableCell, TableHead, TableRow,
    TableBody, Button, TablePagination, CircularProgress,
    Dialog, DialogActions, DialogContent, DialogTitle,
    TextField
} from "@mui/material";
import { personModel } from "../../app/models/persons";
import ReferralRegister from "./RegisterReferral";
import { useState, useEffect } from "react";
import api from "../../app/api/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { referralsModel } from "../../app/models/referralsModel";
import { referralDetailsModel } from "../../app/models/referralDetailsModel";
import UpdatedReferral from "./UpdateReferral";
import DetailsRegister from "./RegisterDetails";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface ReferralProps {
    referrals: referralsModel[];
    setReferrals: React.Dispatch<React.SetStateAction<referralsModel[]>>;
}

export default function ReferraltList({ referrals: referrals, setReferrals: setReferrals }: ReferralProps) {
    const [loading, setLoading] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [idRemisionSeleccionado, setIdRemisionSeleccionado] = useState<number | null>(null);
    const [openAddDetailsDialog, setOpenAddDetailsDialog] = useState(false);
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
            const response = await api.referrals.getReferralsById(id_remision);
            setSelectedReferral(response.data);
            setOpenEditDialog(true);
        } catch (error) {
            console.error("Error al cargar los datos de las remisiones:", error);
            toast.error("No se puede acceder a esta remision");
        }
    };

    const handleAddDetailsDialog = (id_remision: number) => {
        setIdRemisionSeleccionado(id_remision);
        setOpenAddDetailsDialog(true);
    };

    const handleDownloadPDF = async (id_remision: number) => {
        const referralToDownload = referrals.find(ref => ref.id_remision === id_remision);

        if (!referralToDownload) {
            toast.error("No se encontró la remisión para descargar.");
            return;
        }

        try {
            // Obtener los detalles de la remisión
            const response = await api.referralsDetails.getReferralDetailByIdRemision(id_remision);
            const referralDetails: referralDetailsModel[] = response.data;

            const doc = new jsPDF();

            // Encabezado del PDF
            doc.setFontSize(16);
            doc.text("Detalle de la Remisión", 14, 10);

            // Tabla con los datos principales de la remisión
            autoTable(doc, {
                startY: 20,
                head: [["Código", "Fecha de Preparación", "Fecha de Envío", "Correo", "Entidad Destinada", "Estado"]],
                body: [
                    [
                        referralToDownload.id_remision,
                        new Date(referralToDownload.fecha_preparacion).toLocaleDateString(),
                        new Date(referralToDownload.fecha_envio).toLocaleDateString(),
                        referralToDownload.usuario_prepara,
                        referralToDownload.entidad_destino,
                        referralToDownload.estado || "N/A"
                    ]
                ],
            });

            // Obtener la posición de la última tabla agregada
            let lastTable = (doc as any).lastAutoTable;
            let nextTableY = lastTable ? lastTable.finalY + 10 : 30;

            // Si existen detalles de la remisión, agregarlos
            if (referralDetails.length > 0) {
                doc.setFontSize(14);
                doc.text("Detalles de la Remisión", 14, nextTableY - 5);

                autoTable(doc, {
                    startY: nextTableY,
                    head: [["ID Detalle", "ID Remisión", "Identificación", "Tipo Documento", "Estado", "Observaciones"]],
                    body: referralDetails.map((detail: referralDetailsModel) => [
                        detail.id_dremision,
                        detail.id_remision,
                        detail.identificacion,
                        detail.tipo_documento,
                        detail.estado,
                        detail.observaciones || "N/A"
                    ]),
                });
            } else {
                doc.setFontSize(12);
                doc.text("No hay detalles disponibles para esta remisión.", 14, nextTableY);
            }

            // Guardar el PDF
            doc.save(`Remision_${referralToDownload.id_remision}.pdf`);
        } catch (error) {
            console.error("Error al obtener detalles de la remisión:", error);
            toast.error("Error al obtener detalles de la remisión.");
        }
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

                                        <Button
                                            variant="contained"
                                            color="error"
                                            sx={{ margin: "5px" }}
                                            onClick={() => handleDownloadPDF(referral.id_remision)} // Aquí pasamos el id_remision
                                        >
                                            Descargar PDF
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            sx={{ margin: "5px" }}
                                            onClick={() => handleAddDetailsDialog(referral.id_remision)}
                                        >
                                            Agregar Detalle Remisión
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
                <DialogTitle>Agregar Remision</DialogTitle>
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
                    <ReferralRegister></ReferralRegister>
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
                <DialogTitle>Editar Remision</DialogTitle>
                <DialogContent
                    sx={{
                        display: 'flex', // Por ejemplo, para organizar los elementos internos.
                        flexDirection: 'column', // Organiza los hijos en una columna.
                        gap: 2, // Espaciado entre elementos.
                        height: '1200px',
                        width: '1200px', // Ajusta la altura según necesites.
                        overflowY: 'auto', // Asegura que el contenido sea desplazable si excede el tamaño.
                    }}>
                    {selectedRefeerral && (<UpdatedReferral ReferralsData={selectedRefeerral} />)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openAddDetailsDialog}
                onClose={() => setOpenAddDetailsDialog(false)}
                maxWidth="lg" // Ajusta el tamaño máximo del diálogo. Opciones: 'xs', 'sm', 'md', 'lg', 'xl'.
                fullWidth
            >
                <DialogTitle>Agregar Detalles de remision</DialogTitle>
                <DialogContent
                    sx={{
                        display: 'flex', // Por ejemplo, para organizar los elementos internos.
                        flexDirection: 'column', // Organiza los hijos en una columna.
                        gap: 2, // Espaciado entre elementos.
                        height: '1200px',
                        width: '1200px', // Ajusta la altura según necesites.
                        overflowY: 'auto', // Asegura que el contenido sea desplazable si excede el tamaño.
                    }}>
                    {idRemisionSeleccionado && (<DetailsRegister idRemision={idRemisionSeleccionado} />)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDetailsDialog(false)}>Cancelar</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )

}