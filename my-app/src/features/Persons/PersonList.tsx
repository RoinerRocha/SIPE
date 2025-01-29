import { Grid, TableContainer, Paper, Table, TableCell, TableHead, TableRow,
    TableBody, Button, Dialog, DialogActions, DialogContent,
    DialogTitle, TablePagination,
} from "@mui/material";
import { personModel } from "../../app/models/persons";
import { useState, useEffect } from "react";

import api from "../../app/api/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLanguage } from '../../app/context/LanguageContext';
import TableAddData from "./TableAddData";
import TableUpdateData from "./TableUpdateData";

interface Props {
    persons: personModel[];
    setPersons: React.Dispatch<React.SetStateAction<personModel[]>>;
}

export default function PersonList({
    persons: persons,
    setPersons: setPersons
}: Props) {
    const [selectedPerson, setSelectedPerson] = useState<personModel | null>(
        null
    );
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newPerson, setNewPerson] = useState<Partial<personModel>>({
        id_persona: 0,
        tipo_identificacion: "",
        numero_identifiacion: "",
        nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        fecha_nacimiento: new Date(),
        genero: "",
        estado_civil: "",
        nacionalidad: "",
        fecha_registro: new Date(),
        usuario_registro: "",
        nivel_estudios: "",
        asesor: "",
        estado: "",
    });
    const { t } = useTranslation();
    const { changeLanguage, language } = useLanguage();

    useEffect(() => {
        // Cargar los accesos al montar el componente
        loadAccess();
    }, []);

    const loadAccess = async () => {
        try {
          const response = await api.persons.getPersons();
          setPersons(response.data);
        } catch (error) {
          console.error("Error al cargar las personas:", error);
          toast.error("Error al cargar los datos");
        }
    };

    const handleDelete = async (id_persona: number) => {
        try {
           await api.persons.deletePersons(id_persona);
           toast.success("Persona Desactivada correctamente");
           loadAccess();
        } catch (error) {
           console.error("Error al eliminar la persona:", error);
           toast.error("Error al desactivar a la persona");
        }
    };

    const handleEdit = async (id_persona: number) => {
        try {
            const response = await api.persons.getPersonById(id_persona);
            setSelectedPerson(response.data);
            setOpenEditDialog(true);
        } catch (error) {
            console.error("Error al cargar los datos de la persona:", error);
            toast.error("Persona Inactiva");
        }
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedPersons = persons.slice(startIndex, endIndex);

    return( 
        <Grid container spacing={1}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenAddDialog(true)}
            >
                {t('Control-BotonAgregar')}
            </Button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                ID de la persona
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Tipo de identificacion
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Numero de identificacion
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Nombre
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Primer Apellido
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Segundo Apellido
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Fecha de Nacimiento
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Genero
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Estado Civil
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Nacionalidad
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Fecha de Registro
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Usuario
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Nivel de estudio
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Asesor
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Estado
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
                        {paginatedPersons.map((person) => (
                            <TableRow key={person.id_persona}>
                                <TableCell align="center">{person.id_persona}</TableCell>
                                <TableCell align="center">{person.tipo_identificacion}</TableCell>
                                <TableCell align="center">{person.numero_identifiacion}</TableCell>
                                <TableCell align="center">{person.nombre}</TableCell>
                                <TableCell align="center">{person.primer_apellido}</TableCell>
                                <TableCell align="center">{person.segundo_apellido}</TableCell>
                                <TableCell align="center">{new Date(person.fecha_nacimiento).toLocaleDateString()}</TableCell>
                                <TableCell align="center">{person.genero}</TableCell>
                                <TableCell align="center">{person.estado_civil}</TableCell>
                                <TableCell align="center">{person.nacionalidad}</TableCell>
                                <TableCell align="center">{new Date(person.fecha_registro).toLocaleDateString()}</TableCell>
                                <TableCell align="center">{person.usuario_registro}</TableCell>
                                <TableCell align="center">{person.nivel_estudios}</TableCell>
                                <TableCell align="center">{person.asesor}</TableCell>
                                <TableCell align="center">{person.estado}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        color="info"
                                        sx={{ margin: "5px" }}
                                        onClick={() => handleEdit(person.id_persona)}
                                    >
                                        {t('Control-BotonEditar')}
                                    </Button> 
                                    <Button
                                        variant="contained"
                                        color="error"
                                        sx={{ margin: "5px" }}
                                        onClick={() => handleDelete(person.id_persona)}
                                    >
                                        {t('Control-BotonEliminar')}
                                    </Button> 
                                </TableCell>
                            </TableRow>      
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={persons.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) =>
                setRowsPerPage(parseInt(event.target.value, 10))
                }
            />

                <Dialog 
                    open={openAddDialog} 
                    onClose={() => setOpenAddDialog(false)}
                    maxWidth="lg" // Ajusta el tamaño máximo del diálogo. Opciones: 'xs', 'sm', 'md', 'lg', 'xl'.
                    fullWidth
                >
                    <DialogTitle>Agregar Persona</DialogTitle>
                    <DialogContent
                    sx={{
                        display: 'flex', // Por ejemplo, para organizar los elementos internos.
                        flexDirection: 'column', // Organiza los hijos en una columna.
                        gap: 2, // Espaciado entre elementos.
                        height: '1200px',
                        width: '1200px', // Ajusta la altura según necesites.
                        overflowY: 'auto', // Asegura que el contenido sea desplazable si excede el tamaño.
                      }}>
                      <TableAddData loadAccess={loadAccess} ></TableAddData>
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
                    <DialogTitle>Editar Persona</DialogTitle>
                        <DialogContent
                        sx={{
                            display: 'flex', // Por ejemplo, para organizar los elementos internos.
                            flexDirection: 'column', // Organiza los hijos en una columna.
                            gap: 2, // Espaciado entre elementos.
                            height: '1200px',
                            width: '1200px', // Ajusta la altura según necesites.
                            overflowY: 'auto', // Asegura que el contenido sea desplazable si excede el tamaño.
                        }}>
                            {selectedPerson && (<TableUpdateData person={selectedPerson} loadAccess={loadAccess} />)}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
                        </DialogActions>
                </Dialog>
        </Grid>
    )
}
