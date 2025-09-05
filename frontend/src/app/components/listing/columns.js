// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";
import { RowPrints } from "./RowPrints";
import {
    SelectCell,
    SelectHeader,
} from "components/shared/table/SelectCheckbox";
import {
    OrderIdCell,
    SelectLink,
    DateCell,
    TotalCell,
    BadgeCell,
    ProgressCell,
    RoleCell
} from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export function Columns(fields = [], fields_order = [], isPrint = false) {
    let returnColumns = []
    // Sort fields based on fields_order array
    // const sortedFields = [...fields].sort((a, b) => {
    //     const indexA = fields_order.indexOf(a.idx);
    //     const indexB = fields_order.indexOf(b.idx);

    //     // If field is not in fields_order, put it at the end
    //     if (indexA === -1) return 1;
    //     if (indexB === -1) return -1;

    //     return indexA - indexB;
    // });

    // Check box
    returnColumns.push(columnHelper.display({
        id: "select",
        label: "Row Selection",
        header: SelectHeader,
        cell: SelectCell,
    }))

    // ID Link
    returnColumns.push(columnHelper.display({
        id: 'name',
        header: "Name",
        filter: "",
        cell: SelectLink
    }))


    for (let item of fields) {


        // Percent
        if (item.fieldtype == 'Percent') {
            returnColumns.push(columnHelper.accessor((row) => row[item.fieldname], {
                id: item.fieldname,
                label: item.label,
                header: item.label,
                cell: ProgressCell
            }))
        }


        // Data
        if (item.fieldtype == 'Data') {
            returnColumns.push(columnHelper.accessor((row) => row[item.fieldname], {
                id: item.fieldname,
                label: item.label,
                header: item.label
            }))
        }

        // Data
        if (item.fieldtype == 'Currency') {
            returnColumns.push(columnHelper.accessor((row) => row[item.fieldname], {
                id: item.fieldname,
                label: item.label,
                header: item.label,
                cell: TotalCell,
            }))
        }

        // Float
        if (item.fieldtype == 'Float') {
            returnColumns.push(columnHelper.accessor((row) => row[item.fieldname], {
                id: item.fieldname,
                label: item.label,
                header: item.label,
            }))
        }

        // Int
        if (item.fieldtype == 'Int') {
            returnColumns.push(columnHelper.accessor((row) => row[item.fieldname], {
                id: item.fieldname,
                label: item.label,
                header: item.label,
            }))
        }

        // Select
        if (item.fieldtype == 'Select') {
            const options = item.options ? (item.options).split("\n").map(item => ({ label: item, value: item })) : [];

            returnColumns.push(columnHelper.accessor((row) => row[item.fieldname], {
                id: item.fieldname,
                label: item.label,
                header: item.label,
                cell: BadgeCell,
                filter: options.length ? "select" : "",
                filterFn: options.length ? "arrIncludesSome" : "includesString",
                options: options,
            }))
        }

        // Link
        if (item.fieldtype == 'Link') {
            returnColumns.push(columnHelper.accessor((row) => row[item.fieldname], {
                id: item.fieldname,
                label: item.label,
                header: item.label,
                cell: OrderIdCell,
            }))
        }

        // Check
        if (item.fieldtype == 'Check') {
            returnColumns.push(columnHelper.accessor((row) => row[item.fieldname], {
                id: item.fieldname,
                label: item.label,
                header: item.label,
                cell: RoleCell,
                filterFn: "equalsString",
            }))
        }

        // Check
        if (item.fieldtype == 'Date') {
            returnColumns.push(columnHelper.accessor((row) => row[item.fieldname], {
                id: item.fieldname,
                label: item.label,
                header: item.label,
                cell: DateCell,
            }))
        }
    }

    if (isPrint) {
        returnColumns.push(columnHelper.display({
            id: "print",
            label: "Row Print",
            header: "Print",
            cell: RowPrints
        }))
    }

    returnColumns.push(columnHelper.display({
        id: "actions",
        label: "Row Actions",
        header: "Actions",
        cell: RowActions
    }))

    return returnColumns
}