import {
    Grid, TableContainer, Paper, Table, TableCell, TableHead, TableRow,
    TableBody, Button, TablePagination, CircularProgress,
    Dialog, DialogActions, DialogContent, DialogTitle, SelectChangeEvent,
    Card,
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";

import { FieldValues, Form, useForm } from 'react-hook-form';
import { useState, useEffect } from "react";
import { referralsModel } from "../../app/models/referralsModel";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import api from "../../app/api/api";


export default function ReferralRegister() {
    const { user } = useAppSelector(state => state.account);
    const [newReferral, setNewReferral] = useState<Partial<referralsModel>>({
        fecha_preparacion: new Date(),
        fecha_envio: new Date(),
        usuario_prepara: user?.correo_electronico,
        entidad_destino: "",
        estado: "",
    });

    const { register, handleSubmit, setError, formState: { isSubmitting, errors, isValid, isSubmitSuccessful } } = useForm({
        mode: 'onTouched'
    });

    const formatDate = (date: Date) => {
        return date.toISOString().split("T")[0]; // Convierte a YYYY-MM-DD
    };

    const onSubmit = async (data: FieldValues) => {
        try {
            // Formateamos las fechas antes de enviarlas
            data.fecha_preparacion = formatDate(new Date(data.fecha_preparacion));
            data.fecha_envio = formatDate(new Date(data.fecha_envio));

            console.log("Datos enviados al backend:", data); // Para verificar antes de enviarlo

            await api.referrals.saveReferrals(data);
            toast.success("Remision registrado correctamente");
        } catch (error) {
            console.error("Error en el registro de Remision:", error);
            toast.error("Error al registrar la remision");
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setNewReferral((prevAsset) => ({
            ...prevAsset,
            [name]: value,
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const name = event.target.name as keyof referralsModel;
        const value = event.target.value;
        setNewReferral((prevAsset) => ({
            ...prevAsset,
            [name]: value,
        }));
    };

    return (
        <Card>
            <Box p={2}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('fecha_preparacion', { required: 'Se necesita la fecha de preparacion' })}
                                type="date"
                                name="fecha_preparacion"
                                label="Fecha de Preparacion"
                                value={newReferral.fecha_preparacion?.toString() || ''}
                                onChange={handleInputChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('fecha_envio', { required: 'Se necesita la fecha de envio' })}
                                type="date"
                                name="fecha_envio"
                                label="Fecha de Envio"
                                value={newReferral.fecha_envio?.toString() || ''}
                                onChange={handleInputChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('usuario_prepara', { required: 'Se necesita la fecha de envio' })}
                                label="Correo del usuario"
                                value={user?.correo_electronico}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="entidad-label">Entidad Destinada</InputLabel>
                                <Select
                                    labelId="entidad-label"
                                    {...register('entidad_destino', { required: 'Se necesita la Entidad' })}
                                    name="entidad_destino"
                                    value={newReferral.entidad_destino?.toString() || ''}
                                    onChange={handleSelectChange}
                                    fullWidth
                                >
                                    <MenuItem value="Banco Costa Rica">Banco Costa Rica</MenuItem>
                                    <MenuItem value="Mutual Alajuela">Mutual Alajuela</MenuItem>
                                    <MenuItem value="BANHVI">BANHVI</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="estado-label">Estado</InputLabel>
                                <Select
                                    labelId="estado-label"
                                    {...register('estado', { required: 'Se necesita el estado' })}
                                    name="estado"
                                    value={newReferral.estado?.toString() || ''}
                                    onChange={handleSelectChange}
                                    fullWidth
                                >
                                    <MenuItem value="Anulado">Anulado</MenuItem>
                                    <MenuItem value="Procesado">Procesado</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Button variant="contained" color="info" sx={{ margin: "10px", width: '100%' }} type="submit" disabled={isSubmitting}>
                            Agregar
                        </Button>
                    </Grid>
                </form>
            </Box>
        </Card>
    )
}