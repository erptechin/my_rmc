import * as Yup from 'yup'

export const schema = Yup.object().shape({
    old_password: Yup.string().trim()
        .required('Old Password Required'),
    new_password: Yup.string().trim()
        .required('New Password Required'),
    confirm_password: Yup.string().trim()
        .required('Confirm Password Required'),
})

export const schema_profile = Yup.object().shape({
    first_name: Yup.string()
        .trim()
        .required('First Name Required'),
    last_name: Yup.string()
        .trim()
        .required('Last Name Required'),
    email: Yup.string()
        .trim()
        .required('Email Required'),
    mobile_no: Yup.string().trim()
        .required('Mobile No Required'),
})