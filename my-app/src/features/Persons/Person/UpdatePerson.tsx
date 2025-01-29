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
import { personModel } from '../../../app/models/persons';

interface UpdatePersonProps {
    person: personModel;
    loadAccess: () => void;
}

export default function UpdatePerson({ person, loadAccess }: UpdatePersonProps) {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [users, setUsers] = useState<User[]>([]);
    const [persons, setPersons] = useState<personModel[]>([]);
    const [state, setState] = useState<statesModels[]>([]);

    const [currentPerson, setCurrentPerson] = useState<Partial<personModel>>(person);
    console.log(person.id_persona)
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        mode: 'onTouched',
    });

    useEffect(() => {
        const fetchData = async () => {
          try {
            const [userData, personData, stateData] = await Promise.all([
              api.Account.getAllUser(),
              api.persons.getPersons(),
              api.States.getStates()
            ]);
                   // Se verifica que las respuestas sean arrays antes de actualizar el estado
            if (userData && Array.isArray(userData.data)) {
                setUsers(userData.data);
            } else {
                console.error("User data is not an array", userData);
            }

            if (personData && Array.isArray(personData.data)) {
                setPersons(personData.data);
            } else {
                console.error("Persons data is not an array", userData);
            }
            if (stateData && Array.isArray(stateData.data)) {
                setState(stateData.data);
            } else {
                console.error("States data is not an array", userData);
            }
           
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const onSubmit = async (data: FieldValues) => {
        if (currentPerson) {
            try {
                await api.persons.updatePersons(currentPerson.id_persona, data);
                toast.success('Persona actualizada con éxito.');
                loadAccess();
            } catch (error) {
              console.error(error);
              toast.error('Error al actualizar la persona.');
            }
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setCurrentPerson((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setCurrentPerson((prev) => ({
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
                                {...register('id_persona', { required: 'Se necesita el numero de identificacion' })}
                                name="id_persona"
                                label="ID de persona"
                                value={currentPerson.id_persona?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="tipo-identificacion-label">Tipo de Identificación</InputLabel>
                                <Select
                                    labelId="tipo-identificacion-label"
                                    {...register('tipo_identificacion', { required: 'Se necesita el tipo de identificacion' })}
                                    name="tipo_identificacion"
                                    value={currentPerson.tipo_identificacion || ''}
                                    onChange={handleSelectChange}
                                >
                                    <MenuItem value="CEDULA NACIONAL">CÉDULA NACIONAL</MenuItem>
                                    <MenuItem value="PASAPORTE">PASAPORTE</MenuItem>
                                    <MenuItem value="EXTRANJERO">EXTRANJERO</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('numero_identifiacion', { required: 'Se necesita el numero de identificacion' })}
                                name="numero_identifiacion"
                                label="Numero de Identificacion"
                                value={currentPerson.numero_identifiacion?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('nombre', { required: 'Se necesita el nombre' })}
                                name="nombre"
                                label="Nombre"
                                value={currentPerson.nombre?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('primer_apellido', { required: 'Se necesita el primer apellido' })}
                                name="primer_apellido"
                                label="Primer Apellido"
                                value={currentPerson.primer_apellido?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('segundo_apellido', { required: 'Se necesita el segundo apellido' })}
                                name="segundo_apellido"
                                label="Segundo Apellido"
                                value={currentPerson.segundo_apellido?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('fecha_nacimiento', { required: 'Se necesita la fecha de nacimiento' })}
                                type="date"
                                name="fecha_nacimiento"
                                label="Fecha de Nacimiento"
                                value={currentPerson.fecha_nacimiento?.toString() || ''}
                                onChange={handleInputChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="genero-label">Genero</InputLabel>
                                    <Select
                                        labelId="genero-label"
                                        {...register('genero', { required: 'Se necesita el genero' })}
                                        name="genero"
                                        value={currentPerson.genero?.toString() || ''}
                                        onChange={handleSelectChange}
                                        fullWidth
                                    >
                                        <MenuItem value="MASCULINO">MASCULINO</MenuItem>
                                        <MenuItem value="FEMENINO">FEMENINO</MenuItem>
                                        <MenuItem value="NO APLICA">NO APLICA</MenuItem>
                                    </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="estadoCivil-label">Estado Civil</InputLabel>
                                    <Select
                                        labelId="estadoCivil-label"
                                        {...register('estado_civil', { required: 'Se necesita el estado civil' })}
                                        name="estado_civil"
                                        value={currentPerson.estado_civil?.toString() || ''}
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
                                        <MenuItem value="NO APLICA">NO APLICA</MenuItem>
                                        <MenuItem value="SOLTERO(A)">SOLTERO(A)</MenuItem>
                                        <MenuItem value="CASADO(A)">CASADO(A)</MenuItem>
                                        <MenuItem value="DIVORCIADO(A)">DIVORCIADO(A)</MenuItem>
                                        <MenuItem value="VIUDO(A)">VIUDO(A)</MenuItem>
                                        <MenuItem value="UNION LIBRE">UNION LIBRE</MenuItem>
                                        <MenuItem value="UNION DE HECHO">UNION DE HECHO</MenuItem>
                                    </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('nacionalidad', { required: 'Se necesita la nacionalidad' })}
                                name="nacionalidad"
                                label="Nacionalidad"
                                value={currentPerson.nacionalidad?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('fecha_registro', { required: 'Se necesita la fecha de registro' })}
                                type="date"
                                name="fecha_registro"
                                label="Fecha de Registro"
                                value={currentPerson.fecha_registro?.toString() || ''}
                                onChange={handleInputChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="usuario-label">Usuarios</InputLabel>
                                <Select
                                    labelId="usuario-label"
                                    {...register('usuario_registro', { required: 'Se necesita el usuario' })}
                                    name="usuario_registro"
                                    value={currentPerson.usuario_registro?.toString() || ''}
                                    onChange={handleSelectChange}
                                    label="Seleccionar Usuario"
                                    MenuProps={{
                                        PaperProps: {
                                          style: {
                                            maxHeight: 200, // Limita la altura del menú desplegable
                                            width: 250,
                                          },
                                        },
                                    }}
                                    
                                >
                                    {Array.isArray(users) && users.map((user) => (
                                        <MenuItem key={user.id} value={user.nombre_usuario}>
                                            {user.nombre_usuario}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {/*<FormHelperText>Lista desplegable</FormHelperText>*/}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="estudios-label">Nivel de Estudios</InputLabel>
                                    <Select
                                        labelId="estudios-label"
                                        {...register('nivel_estudios', { required: 'Se necesita el nivel de estudio' })}
                                        name="nivel_estudios"
                                        value={currentPerson.nivel_estudios?.toString() || ''}
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
                                        <MenuItem value="NO APLICA">NO APLICA</MenuItem>
                                        <MenuItem value="PRIMARIA">PRIMARIA</MenuItem>
                                        <MenuItem value="SECUNDARIA">SECUNDARIA</MenuItem>
                                        <MenuItem value="TECNICO">TECNICO</MenuItem>
                                        <MenuItem value="UNIVERSITARIO">UNIVERSITARIO</MenuItem>
                                        <MenuItem value="POSGRADO">POSGRADO</MenuItem>
                                        <MenuItem value="LICENCIATURA">LICENCIATURA</MenuItem>
                                        <MenuItem value="MAESTRIA">MAESTRIA</MenuItem>
                                        <MenuItem value="DOCTORADO">DOCTORADO</MenuItem>
                                    </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('asesor', { required: 'Se necesita el asesor' })}
                                name="asesor"
                                label="Asesor"
                                value={currentPerson.asesor?.toString() || ""}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="estado-label">Estado</InputLabel>
                                <Select
                                    labelId="estado-label"
                                    {...register('estado', { required: 'Se necesita el estado' })}
                                    name="estado"
                                    value={currentPerson.estado?.toString() || ""}
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
                        {/* Similar fields for the rest of the properties */}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                            >
                                Actualizar Persona
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Card>
    );
}
