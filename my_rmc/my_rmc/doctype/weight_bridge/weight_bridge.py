# Copyright (c) 2024, erptech and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document

class WeightBridge(Document):
	def before_save(self):
		if self.gross_weight is None and self.tare_weight is None:
			frappe.throw(_("The gross weight or tare weight must be filled before save."))

	def before_submit(self):
		if self.gross_weight is None or self.tare_weight is None:
			frappe.throw(_("The gross weight and tare weight must be filled before submission."))
		
		if self.docstatus == 1 and self.wbslip_type == "Inward":
			# Create a new Purchase Receipt
			purchase_receipt = frappe.get_doc({
				"doctype": "Purchase Receipt",
				"supplier": self.supplier_name, 
				"vehicle_no": self.vehicle_no, 
				"transporter": self.transporter, 
				"posting_date": frappe.utils.nowdate(), 
				"items": []
			})

			item = frappe.db.get_value("Item", self.item, ["*"], as_dict=True)
			if item:
				# Copy items from the custom doctype to the Purchase Receipt
				purchase_receipt.append("items", {
					"item_code": item.item_code,
					"qty": item.qty,
					"rate": item.rate,
					"warehouse": item.warehouse
				})

			# Save and submit the new Purchase Receipt
			purchase_receipt.insert()
			purchase_receipt.submit()
			frappe.msgprint(_("Purchase Receipt {0} created successfully.").format(purchase_receipt.name))
