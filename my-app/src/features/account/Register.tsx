import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Paper, FormControl, InputLabel, Select, MenuItem, FormHelperText, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FieldValues, useForm } from 'react-hook-form';
import api from '../../app/api/api';
import { toast } from 'react-toastify';
import { roleModels } from '../../app/models/roleModels'; 
import { statesModels } from '../../app/models/states'; 
import { useTranslation } from "react-i18next";
import { useLanguage } from '../../app/context/LanguageContext';

export default function Register() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<roleModels[]>([]);
  const [states, setStates] = useState<statesModels[]>([]);

  const { register, handleSubmit, setError, formState: { isSubmitting, errors, isValid } } = useForm({
    mode: 'onTouched'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesData, statesData] = await Promise.all([
          api.roles.getRoles(),
          api.States.getStates()
        ]);

        if (rolesData && Array.isArray(rolesData.data)) {
          setRoles(rolesData.data);
        } else {
          console.error("Roles data is not an array", rolesData);
        }

        if (statesData && Array.isArray(statesData.data)) {
          setStates(statesData.data);
        } else {
          console.error("States data is not an array", statesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error al cargar perfiles y estados");
      }
    };

    fetchData();
  }, []);

  function handleApiErrors(errors: any) {
    if (Array.isArray(errors)) {
      errors.forEach((error: string) => {
        if (error.includes('nombre_usuario')) {
          setError('nombre_usuario', { message: error });
        } else if (error.includes('correo_electronico')) {
          setError('correo_electronico', { message: error });
        }
      });
    }
  }

  const onSubmit = async (data: FieldValues) => {
    try {
      const selectedRole = roles.find(role => role.id === data.perfil_asignado);
      if (selectedRole) {
        data.perfil_asignado = selectedRole.rol; 
      } else {
        toast.error('Rol no encontrado');
        return;
      }

      const selectedState = states.find( state => state.id === data.estado);
      if (selectedState) {
        data.estado = selectedState.estado; 
      } else {
        toast.error('estado no encontrado');
        return;
      }

      const response = await api.Account.register(data);
      console.log(response.data); 
      navigate('/');
      toast.success(t('Toast-registro')); 
    } catch (error) {
      handleApiErrors(errors);
      console.error('Error:', error);
    }
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const { t } = useTranslation();
  const { changeLanguage, language } = useLanguage();

  return (
    <Container component={Paper} maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        {t('titulo-registro')}
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          fullWidth
          label={t('nombre-registro')}
          autoFocus
          {...register('nombre', { required: t('nombre-registro-error')})}
          error={!!errors.nombre}
          helperText={errors?.nombre?.message as string}
        />
        <TextField
          margin="normal"
          fullWidth
          label={t('primer-apellido-registro')}
          {...register('primer_apellido', { required: t('primer-apellido-registro-error') })}
          error={!!errors.primer_apellido}
          helperText={errors?.primer_apellido?.message as string}
        />
        <TextField
          margin="normal"
          fullWidth
          label={t('segundo-apellido-registro')}
          {...register('segundo_apellido', { required: t('segundo-apellido-registro-error') })}
          error={!!errors.segundo_apellido}
          helperText={errors?.segundo_apellido?.message as string}
        />
        <TextField
          margin="normal"
          fullWidth
          label={t('usuario-registro')}
          {...register('nombre_usuario', { required: t('usuario-registro-error') })}
          error={!!errors.nombre_usuario}
          helperText={errors?.nombre_usuario?.message as string}
        />
        <TextField
          margin="normal"
          fullWidth
          label={t('email-registro')}
          {...register('correo_electronico', { required: t('email-registro-error') })}
          error={!!errors.correo_electronico}
          helperText={errors?.correo_electronico?.message as string}
        />
        <TextField
          margin="normal"
          fullWidth
          label={t('password-registro')}
          type="password"
          {...register('contrasena', { required: t('password-registro-error') })}
          error={!!errors.contrasena}
          helperText={errors?.contrasena?.message as string}
        />
        <FormControl fullWidth margin="normal" error={!!errors.perfil_asignado}>
          <InputLabel id="perfil-asignado-label">{t('perfil-registro')}</InputLabel>
          <Select
            labelId="perfil-asignado-label"
            id="perfil_asignado"
            label="Perfil Asignado"
            {...register('perfil_asignado', { required: t('perfil-registro-error') })}
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.rol}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors?.perfil_asignado?.message as string}</FormHelperText>
        </FormControl>
        <FormControl fullWidth margin="normal" error={!!errors.estado}>
          <InputLabel id="estado-label">Estado</InputLabel>
          <Select
            labelId="estado-label"
            id="estado"
            label="Estado"
            {...register('estado', { required: t('perfil-registro-error') })}
          >
            {states.map((state) => (
              <MenuItem key={state.id} value={state.id}>
                {state.estado}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{errors?.estado?.message as string}</FormHelperText>
        </FormControl>
        <LoadingButton
          loading={isSubmitting}
          disabled={!isValid}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {t('boton-registro')}
        </LoadingButton>
      </Box>
    </Container>
  );
}
