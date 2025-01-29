import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Button, Card, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { FieldValues, useForm } from 'react-hook-form';
import api from '../../../app/api/api';
import { User } from '../../../app/models/user';
import { statesModels } from '../../../app/models/states';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { directionsModel } from '../../../app/models/directionsModel';

interface UpdateDirectionProps {
    direction: directionsModel;
    loadAccess: () => void;
}

export default function UpdateDirection({ direction, loadAccess }: UpdateDirectionProps) {
    const navigate = useNavigate();

    const [users, setUsers] = useState<User[]>([]);
    const [directions, setDirections] = useState<directionsModel[]>([]);
    const [state, setState] = useState<statesModels[]>([]);

    const [currentDirection, setCurrentDirection] = useState<Partial<directionsModel>>(direction);
    
    
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        mode: 'onTouched',
    });

    useEffect(() => {
        if (direction) {
            setCurrentDirection(direction);
            console.log("currentDirection set:", direction);
        }
        
        const fetchData = async () => {
          try {
            const [userData, stateData] = await Promise.all([
              api.Account.getAllUser(),
              api.States.getStates(),
            ]);
                   // Se verifica que las respuestas sean arrays antes de actualizar el estado
            if (userData && Array.isArray(userData.data)) {
                setUsers(userData.data);
            } else {
                console.error("User data is not an array", userData);
            }
            if (stateData && Array.isArray(stateData.data)) {
                setState(stateData.data);
            } else {
                console.error("States data is not an array", stateData);
            }
           
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [direction]);


    const onSubmit = async (data: FieldValues) => {
        if (currentDirection) {
            try {
                await api.directions.updateDirections(currentDirection.id_direccion, data);
                toast.success('Direccion actualizada con éxito.');
                loadAccess();
            } catch (error) {
              console.error(error);
              toast.error('Error al actualizar la persona.');
            }
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setCurrentDirection((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setCurrentDirection((prev) => ({
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
                            <TextField
                                fullWidth
                                {...register('provincia', { required: 'Se necesita la provincia' })}
                                name="provincia"
                                label="Provincia"
                                value={currentDirection.provincia?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('canton', { required: 'Se necesita el canton' })}
                                name="canton"
                                label="Canton"
                                value={currentDirection.canton?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('distrito', { required: 'Se necesita el distrito' })}
                                name="distrito"
                                label="Distrito"
                                value={currentDirection.distrito?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('barrio', { required: 'Se necesita el barrio' })}
                                name="barrio"
                                label="Barrio"
                                value={currentDirection.barrio?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                {...register('otras_senas', { required: 'Se necesitan otras señas' })}
                                name="otras_senas"
                                label="Otras Señas"
                                value={currentDirection.otras_senas?.toString() || ''}
                                onChange={handleInputChange}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        minHeight: '100px', // Opcional: especifica un tamaño mínimo
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="direccion-label">Nivel de Estudios</InputLabel>
                                    <Select
                                        labelId="direccion-label"
                                        {...register('tipo_direccion', { required: 'Se necesita el tipo de estudio' })}
                                        name="tipo_direccion"
                                        value={currentDirection.tipo_direccion?.toString() || ''}
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
                                        <MenuItem value="DOMICILIO">DOMICILIO</MenuItem>
                                        <MenuItem value="TRABAJO">TRABAJO</MenuItem>
                                        <MenuItem value="OFICINA">OFICINA</MenuItem>
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
                                    value={currentDirection.estado?.toString() || ""}
                                    onChange={handleSelectChange}
                                    label="Seleccionar Estado"
                                    MenuProps={{
                                        PaperProps: {
                                          style: {
                                            maxHeight: 200, // Limita la altura del menú desplegable
                                            width: 250,
                                          },
                                        },
                                    }}
                                    
                                >
                                    {Array.isArray(state) && state.map((states) => (
                                        <MenuItem key={states.id} value={states.estado}>
                                            {states.estado}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {/*<FormHelperText>Lista desplegable</FormHelperText>*/}
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Button  variant="contained" color="info" sx={{ margin: "10px", width: '100%' }} type="submit" disabled={isSubmitting}>
                        Actualizar
                    </Button>
                </form>
            </Box>
        </Card>
    )
}
