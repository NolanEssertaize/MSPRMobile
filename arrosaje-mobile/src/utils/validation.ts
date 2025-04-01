import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  username: yup.string().email('Email invalide').required('Email requis'),
  password: yup.string().required('Mot de passe requis'),
});

export const registerSchema = yup.object().shape({
  email: yup.string().email('Email invalide').required('Email requis'),
  username: yup.string().required('Nom d\'utilisateur requis').min(3, 'Au moins 3 caractères'),
  phone: yup.string().required('Numéro de téléphone requis'),
  password: yup
    .string()
    .required('Mot de passe requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export const plantSchema = yup.object().shape({
  name: yup.string().required('Le nom est requis'),
  location: yup.string().required('L\'emplacement est requis'),
  care_instructions: yup.string(),
});

export const profileSchema = yup.object().shape({
  email: yup.string().email('Email invalide').required('Email requis'),
  username: yup.string().required('Nom d\'utilisateur requis').min(3, 'Au moins 3 caractères'),
  phone: yup.string().required('Numéro de téléphone requis'),
});
