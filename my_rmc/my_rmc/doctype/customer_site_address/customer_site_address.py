# Copyright (c) 2025, My Rmc and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class CustomerSiteAddress(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		address_line_1: DF.Data
		address_line_2: DF.Data
		address_type: DF.Literal["Billing", "Shipping", "Both"]
		city: DF.Data
		contact_person: DF.Data
		country: DF.Link
		email: DF.Data
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
		phone: DF.Data
		pincode: DF.Data
		site_name: DF.Data
		state: DF.Data
	# end: auto-generated types

	pass
