import {
    Grid, TableContainer, Paper, Table, TableCell, TableHead, TableRow,
    TableBody, Button, TablePagination, CircularProgress,
    Dialog, DialogActions, DialogContent, DialogTitle,  SelectChangeEvent,
    Card,
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";

import { FieldValues, Form, useForm } from 'react-hook-form';
import { paymentsModel } from "../../app/models/paymentsModel";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { personModel } from "../../app/models/persons";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import api from "../../app/api/api";

interface Prop {
    idPersona: number;
    person: string;
    identificationPerson: string;
}

export default function PaymentRegister({  idPersona: idPersona, person: person, identificationPerson: identificationPerson }: Prop) {
    const { user } = useAppSelector(state => state.account);
    const [newPayment, setNewPayment] = useState<Partial<paymentsModel>>({
        id_persona: idPersona,
        identificacion: identificationPerson,
        comprobante: "",
        tipo_pago: "",
        fecha_pago: new Date(),
        fecha_presentacion: new Date(),
        estado: "",
        monto: 0,
        moneda: "",
        usuario: user?.nombre_usuario,
        observaciones: "",
        archivo: "",
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
            data.fecha_pago = formatDate(new Date(data.fecha_pago));
            data.fecha_presentacion = formatDate(new Date(data.fecha_presentacion));
    
            console.log("Datos enviados al backend:", data); // Para verificar antes de enviarlo
    
            await api.payments.savePayments(data);
            toast.success("Pago registrado correctamente");
        } catch (error) {
            console.error("Error en el registro de pago:", error);
            toast.error("Error al registrar el pago");
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setNewPayment((prevAsset) => ({
            ...prevAsset,
            [name]: value,
        }));
    };
    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const name = event.target.name as keyof personModel;
        const value = event.target.value;
        setNewPayment((prevAsset) => ({
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
                                {...register('id_persona', { required: 'Se necesita el id de la persona' })}
                                name="id_persona"
                                label="Id de la persona"
                                value={newPayment.id_persona?.toString() || ''}
                                onChange={handleInputChange}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Nombre de la persona"
                                value={person}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('identificacion', { required: 'Se necesita el id de la persona' })}
                                name="identificacion"
                                label="Identificacion"
                                value={newPayment.identificacion?.toString() || ''}
                                onChange={handleInputChange}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('comprobante', { required: 'Se necesita el comprobante' })}
                                name="comprobante"
                                label="Comprobante"
                                value={newPayment.comprobante?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('tipo_pago', { required: 'Se necesita el tipo de pago' })}
                                name="tipo_pago"
                                label="Tipo de Pago"
                                value={newPayment.tipo_pago?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('fecha_pago', { required: 'Se necesita la fecha de pago' })}
                                type="date"
                                name="fecha_pago"
                                label="Fecha de pago"
                                value={newPayment.fecha_pago?.toString() || ''}
                                onChange={handleInputChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('fecha_presentacion', { required: 'Se necesita la fecha de nacimiento' })}
                                type="date"
                                name="fecha_presentacion"
                                label="Fecha de presentacion"
                                value={newPayment.fecha_presentacion?.toString() || ''}
                                onChange={handleInputChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="estado-label">Estado</InputLabel>
                                <Select
                                    labelId="estado-label"
                                    {...register('estado', { required: 'Se necesita el comprobante' })}
                                    name="estado"
                                    value={newPayment.estado?.toString() || ''}
                                    onChange={handleSelectChange}
                                    fullWidth
                                >
                                    <MenuItem value="Realizado">Realizado</MenuItem>
                                    <MenuItem value="Anulado">Anulado</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('monto', { required: 'Se necesita el tipo de moneda' })}
                                name="monto"
                                label="Monto"
                                value={newPayment.monto?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('moneda', { required: 'Se necesita el tipo de moneda' })}
                                name="moneda"
                                label="Moneda"
                                value={newPayment.moneda?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('usuario', { required: 'Se necesita el usuario' })}
                                name="usuario"
                                label="Nombre de usuario" 
                                value={newPayment.usuario?.toString() || ''}
                                onChange={handleInputChange}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                {...register('observaciones', { required: 'Se necesitan algunas observaciones' })}
                                name="observaciones"
                                label="Observaciones"
                                value={newPayment.observaciones?.toString() || ''}
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
                                {...register('archivo', { required: 'Se necesita el Archivo' })}
                                name="archivo"
                                label="Archivo"
                                value={newPayment.archivo?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Button  variant="contained" color="info" sx={{ margin: "10px", width: '100%' }} type="submit" disabled={isSubmitting}>
                                Agregar
                        </Button>
                    </Grid>
                </form>
            </Box>
        </Card>
    )
}
