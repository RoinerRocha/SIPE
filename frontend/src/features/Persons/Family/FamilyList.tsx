import {
    Grid, TableContainer, Paper, Table, TableCell, TableHead, TableRow,
    TableBody, Button, TablePagination, CircularProgress, Dialog, DialogActions,
    DialogContent, DialogTitle,
    Box
} from "@mui/material";
import { directionsModel } from "../../../app/models/directionsModel";
import { useState, useEffect } from "react";
import api from "../../../app/api/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { familyModel } from '../../../app/models/familyModel';
import UpdateFamilyMember from '../Family/UpdatedFamilyMember';


interface Props {
    personId: number; // ID de la persona pasada como parámetro
}

export default function FamilyList({ personId }: Props) {
    const [members, setMembers] = useState<familyModel[]>([]);
    const [selectedMember, setSelectedMember] = useState<familyModel | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { t } = useTranslation();

    useEffect(() => {
        loadAccess();
    }, [personId]);

    const loadAccess = async () => {
        setLoading(true);
        try {
            const response = await api.family.getMembersByPerson(personId);
            setMembers(response.data);
        } catch (error) {
            console.error("Error al obtener miembros familiares:", error);
            toast.error("Error al obtener miembros familiares.");
        } finally {
            setLoading(false);
        }
    }

    const handleEdit = async (idnucleo: number) => {
        try {
            const response = await api.family.getMembersByID(idnucleo);
            setSelectedMember(response.data);
            setOpenEditDialog(true);
        } catch (error) {
            console.error("Error al cargar los datos de los miembros familiares:", error);
            toast.error("Miembro familiar no encontrado");
        }
    };

    const handleDelete = async (idnucleo: number) => {
        try {
            await api.family.deleteMember(idnucleo);
            toast.success("Miembro eliminado");
            loadAccess();
        } catch (error) {
            console.error("Error al eliminar el miembro familiar:", error);
            toast.error("Error al desactivar el miembro familiar");
        }
    };

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedMembers = members.slice(startIndex, endIndex);

    return (
        <Grid container spacing={1}>
            <TableContainer component={Paper}>
                {loading ? (
                    <CircularProgress sx={{ margin: "20px auto", display: "block" }} />
                ) : (
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    ID del miembro familiar
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    ID de la persona
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Cedula
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Nombre Completo
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Fecha de Nacimiento
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Relacion
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Ingresos
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "uppercase" }}>
                                    Observaciones
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                                >
                                    {t('Control-ColumnaConfiguracion')}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedMembers.map((member) => (
                                <TableRow key={member.idnucleo}>
                                    <TableCell align="center">{member.idnucleo}</TableCell>
                                    <TableCell align="center">{member.idpersona}</TableCell>
                                    <TableCell align="center">{member.cedula}</TableCell>
                                    <TableCell align="center">{member.nombre_completo}</TableCell>
                                    <TableCell align="center">{new Date(member.fecha_nacimiento).toLocaleDateString()}</TableCell>
                                    <TableCell align="center">{member.relacion}</TableCell>
                                    <TableCell align="center">{member.ingresos}</TableCell>
                                    <TableCell align="center">{member.observaciones}</TableCell>
                                    <TableCell align="center">
                                        <Box display="flex" flexDirection="column" alignItems="center">
                                            <Box display="flex" justifyContent="center" gap={1}>
                                                <Button
                                                    variant="contained"
                                                    color="info"
                                                    sx={{ margin: "5px" }}
                                                    onClick={() => handleEdit(member.idnucleo)}
                                                >
                                                    {t('Control-BotonEditar')}
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    sx={{ margin: "5px" }}
                                                    onClick={() => handleDelete(member.idnucleo)}
                                                >
                                                    {t('Control-BotonEliminar')}
                                                </Button>
                                            </Box>
                                        </Box>
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
                count={members.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
            />
            <Dialog
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                maxWidth="lg" // Ajusta el tamaño máximo del diálogo. Opciones: 'xs', 'sm', 'md', 'lg', 'xl'.
                fullWidth
            >
                <DialogTitle>Editar Miembro Familiar</DialogTitle>
                <DialogContent
                    sx={{
                        display: 'flex', // Por ejemplo, para organizar los elementos internos.
                        flexDirection: 'column', // Organiza los hijos en una columna.
                        gap: 2, // Espaciado entre elementos.
                        height: '1200px',
                        width: '1200px', // Ajusta la altura según necesites.
                        overflowY: 'auto', // Asegura que el contenido sea desplazable si excede el tamaño.
                    }}>
                    {selectedMember && (<UpdateFamilyMember member={selectedMember} loadAccess={loadAccess} />)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
                </DialogActions>
            </Dialog>

        </Grid>
    )
}