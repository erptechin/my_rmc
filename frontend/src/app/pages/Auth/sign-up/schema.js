import * as Yup from 'yup'

export const schema = Yup.object().shape({
    first_name: Yup.string()
        .trim()
        .required('First Name Required'),
    last_name: Yup.string()
        .trim()
        .required('Last Name Required'),
    email: Yup.string()
        .trim()
        .required('Email Required'),
    password: Yup.string().trim()
        .required('Password Required'),
    cPassword: Yup.string().trim()
        .required('Conform Password Required'),
    agree: Yup.boolean()
        .oneOf([true], 'You must accept the terms and conditions')
        .required('Check Agree'),
})