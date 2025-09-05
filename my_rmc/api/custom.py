import frappe
import requests
import re

uniqueId = "CFk1mgVfd8Dx2bcTuRuILOE4DAV169"
def is_valid_gst(gstin):
	# Basic format check using regex
	gst_regex = r'^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'
	if not re.match(gst_regex, gstin):
		return False

	# Checksum validation
	chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	factor = 2
	total_sum = 0

	# Calculate sum for first 14 characters
	for i in range(len(gstin)-2, -1, -1):
		code_point = chars.index(gstin[i])
		addend = factor * code_point
		factor = 1 if factor == 2 else 2
		total_sum += (addend // len(chars)) + (addend % len(chars))

	# Calculate checksum
	checksum = (len(chars) - (total_sum % len(chars))) % len(chars)
	return gstin[-1] == chars[checksum]

@frappe.whitelist()
def gst_info(keyword):
	if not is_valid_gst(keyword):
		return frappe.throw('Invalid GSTIN format or checksum')
		
	url = "https://blog-backend.mastersindia.co/api/v1/custom/search/gstin/?keyword="+keyword+"&unique_id="+uniqueId
	payload = {}
	headers = {
		'origin': 'https://www.mastersindia.co'
	}
	response = requests.request("GET", url, headers=headers, data=payload)
	return response.text

@frappe.whitelist()
def get_customer_address(customer_name):
	addresses = frappe.db.sql("""
        SELECT
            addr.name
        FROM
            `tabAddress` AS addr
        INNER JOIN
            `tabDynamic Link` AS link
        ON
            link.parent = addr.name
        WHERE
            link.link_doctype = 'Customer' AND link.link_name = %s
    """, (customer_name), as_dict=True)
	return addresses


@frappe.whitelist()
def get_child_items(parent_name, parent, child):
	
    # SQL query to fetch data from parent and child tables
    query = f"""
        SELECT 
           ri.*
        FROM 
            `tab{child}` ri
        INNER JOIN 
            `tab{parent}` r ON ri.parent = r.name
        WHERE 
            r.name = %s
    """
  
    # Execute the query
    results = frappe.db.sql(query, (parent_name,), as_dict=True)
    return results

@frappe.whitelist()
def unlink_customer_address(customer_name, address_name):
    dynamic_links = frappe.get_all(
        "Dynamic Link",
        filters={
            "link_doctype": "Customer",
            "link_name": customer_name,
            "parenttype": "Address",
            "parent": address_name,
        }
    )
    if dynamic_links:
        for link in dynamic_links:
            frappe.delete_doc("Dynamic Link", link.name)
            frappe.db.commit()
            
        return f"Address '{address_name}' has been removed from Customer '{customer_name}'."
    else:
        return f"No address found linked to Customer '{customer_name}' with the name '{address_name}'."
    

@frappe.whitelist()
def get_latest_delivery_note_with_items(posting_date, against_sales_order):
    dn = frappe.db.sql("""
        SELECT name
        FROM `tabDelivery Note` dn
        JOIN `tabDelivery Note Item` dni ON dni.parent = dn.name
        WHERE dn.posting_date = %s
          AND dni.against_sales_order = %s
          AND dn.docstatus = 1
        ORDER BY dn.creation DESC
        LIMIT 1
    """, (posting_date, against_sales_order), as_dict=True)

    if dn:
        return frappe.get_doc("Delivery Note", dn[0].name)
    return None

