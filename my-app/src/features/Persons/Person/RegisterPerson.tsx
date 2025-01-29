import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Button, Card, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FieldValues, Form, useForm } from 'react-hook-form';
import api from '../../../app/api/api';
import { User } from "../../../app/models/user";
import { statesModels } from '../../../app/models/states'; 
import { toast } from 'react-toastify';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { personModel } from '../../../app/models/persons';

interface AddPersonProps {
    loadAccess: () => void;
}

export default function RegisterPerson({loadAccess}: AddPersonProps) {
    const navigate = useNavigate();

    const [users, setUsers] = useState<User[]>([]);
    const [persons, setPersons] = useState<personModel[]>([]);
    const [state, setState] = useState<statesModels[]>([]);

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


    const { register, handleSubmit, setError, formState: { isSubmitting, errors, isValid, isSubmitSuccessful } } = useForm({
        mode: 'onTouched'
    });

    useEffect(() => {

        const generateRandomId = () => {
            const randomId = Math.floor(100000 + Math.random() * 900000); // Genera un número aleatorio de 6 dígitos
            setNewPerson((prevState) => ({
                ...prevState,
                id_persona: randomId,
            }));
        };
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
                toast.error(t('Activo-toast-errror'));
            }
        };
        generateRandomId();
        fetchData();
    }, []);

    const onSubmit = async (data: FieldValues) => {
        try {
          await api.persons.savePersons(data);
          toast.success("Persona registrada correctamente");
          loadAccess();
        } catch (error) {
          console.error(error);
          toast.error("Error al registrar a la persona");
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setNewPerson((prevAsset) => ({
          ...prevAsset,
          [name]: value,
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const name = event.target.name as keyof personModel;
        const value = event.target.value;
        setNewPerson((prevAsset) => ({
          ...prevAsset,
          [name]: value,
        }));
      };

    return (
        <Card>
            <Box p={2}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                {...register('id_persona', { required: 'Se necesita el numero id de la persona' })}
                                name="id_persona"
                                label="ID de la persona"
                                value={newPerson.id_persona?.toString()}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="tipo-identificacion-label">Tipo de Identificación</InputLabel>
                                <Select
                                    labelId="tipo-identificacion-label"
                                    {...register('tipo_identificacion', { required: 'Se necesita el tipo de identificacion' })}
                                    name="tipo_identificacion"
                                    value={newPerson.tipo_identificacion?.toString() || ''}
                                    onChange={handleSelectChange}
                                    fullWidth
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
                                value={newPerson.numero_identifiacion?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('nombre', { required: 'Se necesita el nombre' })}
                                name="nombre"
                                label="Nombre"
                                value={newPerson.nombre?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('primer_apellido', { required: 'Se necesita el primer apellido' })}
                                name="primer_apellido"
                                label="Primer Apellido"
                                value={newPerson.primer_apellido?.toString() || ''}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                {...register('segundo_apellido', { required: 'Se necesita el segundo apellido' })}
                                name="segundo_apellido"
                                label="Segundo Apellido"
                                value={newPerson.segundo_apellido?.toString() || ''}
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
                                value={newPerson.fecha_nacimiento?.toString() || ''}
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
                                        value={newPerson.genero?.toString() || ''}
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
                                        value={newPerson.estado_civil?.toString() || ''}
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
                                value={newPerson.nacionalidad?.toString() || ''}
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
                                value={newPerson.fecha_registro?.toString() || ''}
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
                                    value={newPerson.usuario_registro?.toString() || ''}
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
                                        value={newPerson.nivel_estudios?.toString() || ''}
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
                                value={newPerson.asesor?.toString() || ""}
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
                                    value={newPerson.estado?.toString() || ""}
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
                        <Button  variant="contained" color="info" sx={{ margin: "10px", width: '100%' }} type="submit" disabled={isSubmitting}>
                                Agregar
                        </Button>
                    </Grid>
                </form>
            </Box>
        </Card>
    )
}