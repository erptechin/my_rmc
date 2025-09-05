import * as Yup from 'yup'

export const schema = Yup.object().shape({
    otp: Yup.string()
        .trim()
        .required('OTP Required'),
    password: Yup.string().trim()
        .required('Password Required'),
    cPassword: Yup.string().trim()
        .required('Conform Password Required'),
})