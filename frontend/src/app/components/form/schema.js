// Import Dependencies
import * as Yup from 'yup'

// ----------------------------------------------------------------------

export function Schema(fields = []) {

    const schemaFields = {}

    for (let item of fields) {
        if (item.reqd && item.read_only === 0) {
            if (item.fieldtype == "Table") {
                schemaFields[item.fieldname] = Yup.array()
                    .transform((value, originalValue) =>
                        typeof originalValue === 'string' && originalValue.trim() === ''
                        ? []
                        : originalValue
                    )
                    .required(`${item.label} Required`)
                    .min(1, `At least one ${item.label} is required`);
            } else {
                schemaFields[item.fieldname] = Yup.string()
                    .trim()
                    .required(`${item.label} Required`)
            }
        }
    }

    return Yup.object().shape(schemaFields)
}