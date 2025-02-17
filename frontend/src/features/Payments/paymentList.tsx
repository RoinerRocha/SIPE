import {
    Grid, TableContainer, Paper, Table, TableCell, TableHead, TableRow,
    TableBody, Button, TablePagination, CircularProgress,
    Dialog, DialogActions, DialogContent, DialogTitle,
    TextField
} from "@mui/material";

import { paymentsModel } from "../../app/models/paymentsModel";
import { useState, useEffect } from "react";
import PaymentRegister from "./paymentRegister";
import api from "../../app/api/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import UpdatePayment from "./UpdatedPayment";

interface Props {
    payments: paymentsModel[];
    setPayments: React.Dispatch<React.SetStateAction<paymentsModel[]>>;
}

export default function PaymentList({ payments: payments, setPayments: setPayments }: Props) {
    const [loading, setLoading] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<paymentsModel | null>(null);
    const [identification, setIdentification] = useState("");
    const [selectedIdPersona, setSelectedIdPersona] = useState<number | null>(null);
    const [personName, setPersonName] = useState("");


    const handleSearch = async () => {
        if (!identification) {
            const defaultResponse = await api.payments.getAllPayments();
            setPayments(defaultResponse.data);
            setPersonName("");
            return;
        }

        setLoading(true);
        try {
            const response = await api.payments.getPaymentsByIdentification(identification);
            if (response && Array.isArray(response.data)) {
                setPayments(response.data);
                const personResponse = await api.persons.getPersonByIdentification(identification);
                const fullName = `${personResponse.data.nombre || ""} ${personResponse.data.primer_apellido || ""} ${personResponse.data.segundo_apellido || ""}`.trim();
                setPersonName(fullName);
            } else {
                console.error("La respuesta de la API no es un array de pagos:", response);
                toast.error("No se encontraron pagos con esa identificación.");
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
        const foundObservation = payments.find(obs => obs.identificacion === identification);
    
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

    const handleEdit = async (id_pago: number) => {
        try {
            const response = await api.payments.getPaymentsByIDPago(id_pago);
            setSelectedPayment(response.data);
            setOpenEditDialog(true);
        } catch (error) {
            console.error("Error al cargar los datos de los pagos:", error);
            toast.error("No se puede acceder a este pago inactiva");
        }
    };


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedPayments = payments.slice(startIndex, endIndex);
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
                                    Numero de identificacion
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Comprobante
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Tipo de pago
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Fecha de pago
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    fecha de presentacion
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Estado
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Monto
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Moneda
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Usuario
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Observaciones
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Archivo
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Realizar Cambios
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedPayments.map((payments) => (
                                <TableRow key={payments.id_pago}>
                                    <TableCell align="center">{payments.identificacion}</TableCell>
                                    <TableCell align="center">{payments.comprobante}</TableCell>
                                    <TableCell align="center">{payments.tipo_pago}</TableCell>
                                    <TableCell align="center">{new Date(payments.fecha_pago).toLocaleDateString()}</TableCell>
                                    <TableCell align="center">{new Date(payments.fecha_presentacion).toLocaleDateString()}</TableCell>
                                    <TableCell align="center">{payments.estado}</TableCell>
                                    <TableCell align="center">{payments.monto}</TableCell>
                                    <TableCell align="center">{payments.moneda}</TableCell>
                                    <TableCell align="center">{payments.usuario}</TableCell>
                                    <TableCell align="center">{payments.observaciones}</TableCell>
                                    <TableCell align="center">{payments.archivo}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            color="info"
                                            sx={{ margin: "5px" }}
                                            onClick={() => handleEdit(payments.id_pago)}
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
                count={payments.length}
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
                    <PaymentRegister identificationPerson={identification} person={personName} idPersona={selectedIdPersona ?? 0}  ></PaymentRegister>
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
                    {selectedPayment && (<UpdatePayment PaymentsData={selectedPayment} />)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}



