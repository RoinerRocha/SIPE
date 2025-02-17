import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Button, Card, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { FieldValues, useForm } from 'react-hook-form';
import api from '../../app/api/api';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { referralsModel } from "../../app/models/referralsModel";

interface UpdateReferralsProps {
    ReferralsData: referralsModel;
}

export default function UpdatedReferral({ ReferralsData }: UpdateReferralsProps) {
    const [currentReferral, setCurrentReferral] = useState<Partial<referralsModel>>(ReferralsData);

    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        mode: 'onTouched',
    });

    useEffect(() => {
        if (ReferralsData) {
            setCurrentReferral(ReferralsData);
            console.log(ReferralsData.id_remision);
        }
    }, [ReferralsData]);

    const onSubmit = async (data: FieldValues) => {
        if (currentReferral) {
            try {
                await api.referrals.updateReferrals(Number(currentReferral.id_remision), data);
                toast.success('Remision actualizada con éxito.');
            } catch (error) {
                console.error(error);
                toast.error('Error al actualizar la remision.');
            }
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setCurrentReferral((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setCurrentReferral((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Card>
            <Box p={2}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="estado-label">Estado</InputLabel>
                                <Select
                                    labelId="estado-label"
                                    {...register('estado', { required: 'Se necesita el estado' })}
                                    name="estado"
                                    value={currentReferral.estado?.toString() || ''}
                                    onChange={handleSelectChange}
                                    fullWidth
                                >
                                    <MenuItem value="Anulado">Anulado</MenuItem>
                                    <MenuItem value="Procesado">Procesado</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="entidad-label">Entidad Destinada</InputLabel>
                                <Select
                                    labelId="entidad-label"
                                    {...register('entidad_destino', { required: 'Se necesita la Entidad' })}
                                    name="entidad_destino"
                                    value={currentReferral.entidad_destino?.toString() || ''}
                                    onChange={handleSelectChange}
                                    fullWidth
                                >
                                    <MenuItem value="Banco Costa Rica">Banco Costa Rica</MenuItem>
                                    <MenuItem value="Mutual Alajuela">Mutual Alajuela</MenuItem>
                                    <MenuItem value="BANHVI">BANHVI</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Button variant="contained" color="info" sx={{ margin: "10px", width: '100%' }} type="submit" disabled={isSubmitting}>
                        Actualizar
                    </Button>
                </form>
            </Box>
        </Card>
    )
}
