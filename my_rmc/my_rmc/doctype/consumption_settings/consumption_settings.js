// Copyright (c) 2024, erptech and contributors
// For license information, please see license.txt

frappe.ui.form.on("Consumption Settings", {
    refresh: function (frm) {
        checkConditionalFields_sqlServer(frm, frm.doc.sql_server)
        if (frm.doc.type) {
            checkConditionalFields(frm, frm.doc.type)
        }
        checkConditionalFields_fetchLatest(frm, frm.doc.fetch_latest)
    },
    type: async function (frm) {
        if (frm.doc.type) {
            checkConditionalFields(frm, frm.doc.type)
            checkConditionalFields_fetchLatest(frm, frm.doc.fetch_latest)
        }
    },
    sql_server: async function (frm) {
        checkConditionalFields_sqlServer(frm, frm.doc.sql_server)
    },
    fetch_latest: async function (frm) {
        checkConditionalFields_fetchLatest(frm, frm.doc.fetch_latest)
    },
});


async function checkConditionalFields_sqlServer(frm, type) {
    if (type == 1) {
        frm.set_df_property('db_driver', 'hidden', 0);
        frm.set_df_property('db_driver', 'reqd', 1);
    } else {
        frm.set_df_property('db_driver', 'hidden', 1);
        frm.set_df_property('db_driver', 'reqd', 0);
    }
}

async function checkConditionalFields(frm, type) {
    frm.set_df_property('consumption_item_table_from', 'hidden', 1);
    frm.set_df_property('consumption_item_table_from', 'reqd', 0);
    frm.set_df_property('from_date', 'hidden', 1);
    frm.set_df_property('from_date', 'reqd', 0);
    frm.set_df_property('to_date', 'hidden', 1);
    frm.set_df_property('to_date', 'reqd', 0);
    frm.set_df_property('fetch_latest', 'hidden', 1);
    frm.set_df_property('fetch_latest', 'reqd', 0);

    if (type == "Stetter") {
        frm.set_df_property('consumption_item_table_from', 'hidden', 0);
        frm.set_df_property('consumption_item_table_from', 'reqd', 1);
    }
    if (type == "KYB") {
        frm.set_df_property('from_date', 'hidden', 0);
        frm.set_df_property('from_date', 'reqd', 1);
        frm.set_df_property('to_date', 'hidden', 0);
        frm.set_df_property('to_date', 'reqd', 1);
        frm.set_df_property('fetch_latest', 'hidden', 0);
        frm.set_df_property('fetch_latest', 'reqd', 1);
    }
}

async function checkConditionalFields_fetchLatest(frm, type) {
    if (type == 1) {
        frm.set_df_property('from_date', 'hidden', 1);
        frm.set_df_property('from_date', 'reqd', 0);
        frm.set_df_property('to_date', 'hidden', 1);
        frm.set_df_property('to_date', 'reqd', 0);
    } else {
        frm.set_df_property('from_date', 'hidden', 0);
        frm.set_df_property('from_date', 'reqd', 1);
        frm.set_df_property('to_date', 'hidden', 0);
        frm.set_df_property('to_date', 'reqd', 1);
    }
}