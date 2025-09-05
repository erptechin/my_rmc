import frappe
import requests
from my_rmc.api.custom import get_child_items

@frappe.whitelist()
def create_stock_entry(doc, method):
    host = frappe.request.host
    parts = host.split(".")
    subdomain = parts[0]
    if subdomain == "localhost:8000" or subdomain == "jke" or subdomain == "balaji" or subdomain == "biharrmc" or subdomain == "greystoneinfra":
        pass
    else:
        # Check some conditions or add any custom validation logic before creating a Stock Entry
        if not doc.docstatus == 1:
            frappe.throw(
                "Some field is missing, cannot proceed with the Stock Entry creation."
            )

        # Create Stock Entry document
        stock_entry = frappe.new_doc("Stock Entry")

        # Populate the fields of the Stock Entry document
        stock_entry.stock_entry_type = (
            "Material Issue"  # Example, use appropriate entry type
        )
        stock_entry.company = (
            doc.company
        )  # Assume the custom doctype has a company field
        if doc.items[0].custom_bom_no:
            stock_entry.from_bom = True
            stock_entry.use_multi_level_bom = True
            stock_entry.bom_no = doc.items[0].custom_bom_no
            stock_entry.fg_completed_qty = doc.items[0].qty

        # Assuming you have child table "items" in the custom doctype and need to transfer items to stock
        if doc.items[0].custom_bom_no:
            items = get_child_items(doc.items[0].custom_bom_no, "BOM", "BOM Item")
            for item in items:
                checkItem = frappe.get_doc("Item", item.item_code)
                if checkItem.is_stock_item == 1:
                    stock_entry.append(
                        "items",
                        {
                            "item_code": item.item_code,
                            "qty": item.qty,
                            "rate": item.rate,
                            "uom": item.uom,
                            "allow_zero_valuation_rate": (
                                1 if item["item_code"] == "Water" else 0
                            ),
                            "s_warehouse": item.source_warehouse,
                        },
                    )

        if doc.custom_consumed_raw_material:
            for item in doc.custom_consumed_raw_material:
                items_data = frappe.get_all(
                    "Item",
                    filters={"item_name": item.item_name},
                    fields=["*"],
                )
                if items_data and item.act_qty and items_data[0].is_stock_item == 1:
                    stock_entry.append(
                        "items",
                        {
                            "item_code": items_data[0].item_code,
                            "qty": item.act_qty,
                            "rate": items_data[0].rate,
                            "uom": items_data[0].stock_uom,
                            "allow_zero_valuation_rate": (
                                1 if items_data[0]["item_code"] == "Water" else 0
                            ),
                            "s_warehouse": items_data[0].custom_source_warehouse,
                        },
                    )

        # Submit the Stock Entry document to record the transaction
        stock_entry.submit()

        # Optional: Log or add any more business logic here

        frappe.msgprint(
            f"Stock Entry {stock_entry.name} has been created successfully."
        )
    

    # Create Installation Note
    db_name = "Installation Note"
    exists = frappe.db.exists(db_name, {"custom_delivery_note": doc.name})
    if exists:
        pass
    else:
        pass