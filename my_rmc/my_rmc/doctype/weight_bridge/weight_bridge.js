// Copyright (c) 2024, erptech and contributors
// For license information, please see license.txt

frappe.ui.form.on("Weight Bridge", {
    async refresh(frm) {
        if (!frm.doc.docstatus) {
            document.querySelector('input[data-fieldname="display_data"]').readOnly = true;
            document.querySelector('input[data-fieldname="gross_weight"]').readOnly = true;
            document.querySelector('input[data-fieldname="tare_weight"]').readOnly = true;

            if (frm.doc.name.includes("new-weight-bridge")) {
                document.querySelector('div[data-fieldname="section_break_outward"]').style.display = 'none';
                document.querySelector('button[data-fieldname="tare"]').disabled = true;
            } else {
                document.querySelector('select[data-fieldname="wbslip_type"]').disabled = true;
                if (frm.doc.gross_weight) {
                    document.querySelector('button[data-fieldname="gross"]').disabled = true;
                }
                if (frm.doc.tare_weight) {
                    document.querySelector('button[data-fieldname="tare"]').disabled = true;
                }
                if (frm.doc.wbslip_type === "Inward") {
                    document.querySelector('div[data-fieldname="section_break_outward"]').style.display = 'none';
                }
                if (frm.doc.wbslip_type === "Outward") {
                    document.querySelector('div[data-fieldname="section_break_inward"]').style.display = 'none';
                }
            }

            doc = await frappe.db.get_doc('RMC Settings', 'enable_weigh_scale')
            if (doc.enable_weigh_scale == 1) {

                // TEST START
                const outputDiv = document.querySelector('input[data-fieldname="display_data"]');
                setInterval(() => {
                    outputDiv.value = Math.floor(Math.random() * (900 - 100 + 1)) + 100;
                }, 5000)
                // TEST END

                if ("serial" in navigator) {
                    var ports = await navigator.serial.getPorts();
                    if (ports.length == 0) {
                        frappe.confirm(
                            'Please provide permission to connect to the weigh device',
                            async function () {
                                let port = await navigator.serial.requestPort();
                                await port.open({ baudRate: Number(doc.baud_rate) });
                                await listenToPort(port, doc);
                            },

                        );
                    } else {
                        await ports[0].open({ baudRate: Number(doc.baud_rate) });
                        await listenToPort(ports[0], doc);
                    }
                }
                else {
                    frappe.msgprint("Your browser does not support serial device connection. Please switch to a supported browser to connect to your weigh device");
                }

            }
        }
    },
    wbslip_type: async function (frm) {
        if (frm.doc.wbslip_type) {
            if (frm.doc.wbslip_type === "Inward") {
                document.querySelector('div[data-fieldname="section_break_inward"]').style.display = 'block';
                document.querySelector('div[data-fieldname="section_break_outward"]').style.display = 'none';
                document.querySelector('button[data-fieldname="gross"]').disabled = false;
                document.querySelector('button[data-fieldname="tare"]').disabled = true;
            }
            if (frm.doc.wbslip_type === "Outward") {
                document.querySelector('div[data-fieldname="section_break_inward"]').style.display = 'none';
                document.querySelector('div[data-fieldname="section_break_outward"]').style.display = 'block';
                document.querySelector('button[data-fieldname="gross"]').disabled = true;
                document.querySelector('button[data-fieldname="tare"]').disabled = false;
            }
            if (frm.doc.wbslip_type === "Other") {
                document.querySelector('div[data-fieldname="section_break_inward"]').style.display = 'block';
                document.querySelector('div[data-fieldname="section_break_outward"]').style.display = 'block';
                document.querySelector('button[data-fieldname="gross"]').disabled = false;
                document.querySelector('button[data-fieldname="tare"]').disabled = false;
            }
        }
    },
    gross: async function (frm) {
        let value = document.querySelector('input[data-fieldname="display_data"]').value;
        frm.set_value('gross_weight', value);
        frm.set_value('gross_weight_date_time', frappe.datetime.now_date());
    },
    tare: async function (frm) {
        let value = document.querySelector('input[data-fieldname="display_data"]').value;
        frm.set_value('tare_weight', value);
        frm.set_value('tare_weight_date_time', frappe.datetime.now_date());
    },
    gross_weight: async function (frm) {
        calculateWeight(frm)
    },
    tare_weight: async function (frm) {
        calculateWeight(frm)
    },
    deduct: async function (frm) {
        calculateWeight(frm)
    },
    purchase_order: async function (frm) {
        if (frm.doc.purchase_order) {
            let purchaseOrder = await frappe.db.get_value("Purchase Order", frm.doc.purchase_order, ["supplier_name"]);
            if (purchaseOrder?.message) {
                frm.set_value('supplier_name', purchaseOrder?.message.supplier_name);
                frappe.call({
                    method: 'my_rmc.api.custom.get_child_items',
                    args: {
                        parent: "Purchase Order",
                        child: "Purchase Order Item",
                        parent_name: frm.doc.purchase_order,
                    },
                    callback: function (res) {
                        frm.set_query('item', function () {
                            return {
                                filters: {
                                    'item_code': ['in', (res.message).map(item => item.item_code)]
                                }
                            };
                        });
                    }
                });
            }
        }
    },
    delivery_note: async function (frm) {
        if (frm.doc.delivery_note) {
            let deliveryNote = await frappe.db.get_value("Delivery Note", frm.doc.delivery_note, ["customer", "custom_vehicle"]);
            if (deliveryNote?.message) {
                frm.set_value('customer_name', deliveryNote?.message.customer);
                frm.set_value('vehicle', deliveryNote?.message.custom_vehicle);
            }
            frappe.call({
                method: 'my_rmc.api.custom.get_child_items',
                args: {
                    parent: "Delivery Note",
                    child: "Delivery Note Item",
                    parent_name: frm.doc.delivery_note,
                },
                callback: function (res) {
                    res.message.forEach((item) => {
                        frm.set_value('item', item.item_code);
                    });
                }
            });
        }
    }
});

function calculateWeight(frm) {
    if (frm.doc.gross_weight && frm.doc.tare_weight) {
        let netWeight = Number(frm.doc.gross_weight) - Number(frm.doc.tare_weight)
        frm.set_value('net_weight', netWeight);
        let grandNetDeduct = Number(frm.doc.deduct ?? 0) / 100 * netWeight
        frm.set_value('grand_net_weight', netWeight - grandNetDeduct);
    }
}

async function listenToPort(port, settings) {
    const outputDiv = document.querySelector('input[data-fieldname="display_data"]');
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();

    // Listen to data coming from the serial device.
    let tempValue = 0
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            reader.releaseLock();
            break;
        }
        // value is a string.
        let newValue = String(value).includes(settings.split_character) ? String(value).replace(settings.split_character, "") : String(value)
        if (tempValue != Number(newValue)) {
            tempValue = Number(newValue)
            outputDiv.value = String(Number(newValue))
        }
    }
}