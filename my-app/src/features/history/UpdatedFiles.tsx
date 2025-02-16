import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { FieldValues, useForm } from 'react-hook-form';
import api from '../../app/api/api';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { filesModel } from "../../app/models/filesModel";
import HistoryFiles from "./FilesHistory";
import { historyFilesModel } from "../../app/models/historyFilesModel";


interface UpdateFilesProps {
    FilesData: filesModel;
}

export default function UpdateFiles({ FilesData }: UpdateFilesProps) {
    const [currentFile, setCurrentFile] = useState<Partial<filesModel>>(FilesData);
    const [selectedFile, setSelectedFile] = useState<historyFilesModel[] | null>(null);
    const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        mode: 'onTouched',
    });
    useEffect(() => {
        if (FilesData) {
            setCurrentFile(FilesData);
            console.log(FilesData.codigo);
        }
    }, [FilesData]);

    const onSubmit = async (data: FieldValues) => {
        if (currentFile) {
            try {
                await api.history.updateFiles(currentFile.codigo, data);
                toast.success('Expediente actualizado con éxito.');
            } catch (error) {
                console.error(error);
                toast.error('Error al actualizar el expediente.');
            }
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setCurrentFile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setCurrentFile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = async (codigo: number) => {
        try {
            const response = await api.history.getHistoryFiles(codigo);
            setSelectedFile(response.data);
            setOpenHistoryDialog(true);
        } catch (error) {
            console.error("Error al cargar los datos de los pagos:", error);
            toast.error("No se puede acceder a este expediente");
        }
    };

    return (
        <Card>
            <Button
                variant="contained"
                color="info"
                sx={{ margin: "20px" }}
                onClick={() => handleEdit(FilesData.codigo)}
            >
                Ver Historial de cambios del expediente
            </Button>
            <Box p={2}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="tipo-label">Tipo de expediente</InputLabel>
                                <Select
                                    labelId="tipo-label"
                                    {...register('tipo_expediente', { required: 'Se necesita el tipo de expediente' })}
                                    name="tipo_expediente"
                                    value={currentFile.tipo_expediente?.toString() || ''}
                                    onChange={handleSelectChange}
                                    fullWidth
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200, // Limita la altura del menú desplegable
                                                width: 250,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="Bono de vivienda">Bono de Vivienda</MenuItem>
                                    <MenuItem value="Articulo 59">Articulo 59</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('estado', { required: 'Se necesita la nueva observacion' })}
                                name="estado"
                                label="Estado"
                                value={currentFile.estado?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('fecha_creacion', { required: 'Se necesita la fecha de creacion' })}
                                type="date"
                                name="fecha_creacion"
                                label="Fecha de Creacion"
                                value={currentFile.fecha_creacion?.toString() || ''}
                                onChange={handleInputChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('fecha_emitido', { required: 'Se necesita la fecha de emision' })}
                                type="date"
                                name="fecha_emitido"
                                label="Fecha de Emitido"
                                value={currentFile.fecha_emitido?.toString() || ''}
                                onChange={handleInputChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('fecha_enviado_entidad', { required: 'Se necesita la fecha de emision' })}
                                type="date"
                                name="fecha_enviado_entidad"
                                label="Fecha Envio entidad"
                                value={currentFile.fecha_enviado_entidad?.toString() || ''}
                                onChange={handleInputChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('ubicacion', { required: 'Se necesita la nueva observacion' })}
                                name="ubicacion"
                                label="Ubicacion"
                                value={currentFile.ubicacion?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('etiqueta', { required: 'Se necesita la nueva observacion' })}
                                name="etiqueta"
                                label="Etiqueta"
                                value={currentFile.etiqueta?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('entidad', { required: 'Se necesita la nueva observacion' })}
                                name="entidad"
                                label="Entidad"
                                value={currentFile.entidad?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                {...register('observaciones', { required: 'Se necesita la nueva observacion' })}
                                name="observaciones"
                                label="Observaciones"
                                value={currentFile.observaciones?.toString() || ''}
                                onChange={handleInputChange}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        minHeight: '100px', // Opcional: especifica un tamaño mínimo
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('remitente', { required: 'Se necesita la remision' })}
                                name="remitente"
                                label="Remision"
                                value={currentFile.remitente?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('asignadoa', { required: 'Se necesita la asignacion' })}
                                name="asignadoa"
                                label="Asignado(a)"
                                value={currentFile.asignadoa?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                    <Button variant="contained" color="info" sx={{ margin: "10px", width: '100%' }} type="submit" disabled={isSubmitting}>
                        Actualizar
                    </Button>
                </form>
            </Box>
            <Dialog
                open={openHistoryDialog}
                onClose={() => setOpenHistoryDialog(false)}
                maxWidth="lg" // Ajusta el tamaño máximo del diálogo. Opciones: 'xs', 'sm', 'md', 'lg', 'xl'.
                fullWidth
            >
                <DialogTitle>Ver Hisotiral de cambios</DialogTitle>
                <DialogContent
                    sx={{
                        display: 'flex', // Por ejemplo, para organizar los elementos internos.
                        flexDirection: 'column', // Organiza los hijos en una columna.
                        gap: 2, // Espaciado entre elementos.
                        height: '1200px',
                        width: '1200px', // Ajusta la altura según necesites.
                        overflowY: 'auto', // Asegura que el contenido sea desplazable si excede el tamaño.
                    }}>
                    {selectedFile && (<HistoryFiles HistoryData={selectedFile} />)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenHistoryDialog(false)}>Cancelar</Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}
