import * as yup from 'yup';

export const schema = yup.object().shape({
  firstName: yup.string().required('First name is required.'),
  lastName: yup.string().required('Last name is required.'),
  email: yup.string().email('Invalid email').required('Email is required.'),
  phoneNumber: yup.string().optional(),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required.'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), ''], 'Passwords must match')
    .required('Confirm your password'),
});