import * as yup from 'yup';

export const addressSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  mobileNumber: yup
    .string()
    .required('Mobile number is required'),
  additionalAddress: yup.string().required('Additional address is required'),
});