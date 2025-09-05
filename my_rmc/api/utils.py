import frappe
from pytz import timezone
from datetime import datetime, timedelta

def create_response(status,message,data=None):
    frappe.local.response.http_status_code = status
    frappe.local.response.message = message
    if data is not None:
        frappe.local.response.data = data

def timeOfZone(time):
    utc_time =  time.astimezone(timezone('Asia/Gaza'))         
    return utc_time.strftime("%Y-%m-%d %H:%M:%S.%f")
         

#Country List
@frappe.whitelist()
def country():
    try:
        # Construct base SQL query
        base_query = "SELECT name FROM `tabCountry`"
        # Execute base query
        country_data = frappe.db.sql(base_query,as_dict=True)

        # Creating the response
        synced_time = timeOfZone(datetime.now())
        create_response(200, "Country fetched successfully", {
            "time": synced_time,
            "country_data": country_data
        })
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Error in fetching Country")    




#State List
@frappe.whitelist(allow_guest=True)
def state():
    try:
        # Get parameters from request
        country = frappe.local.form_dict.get('country')

        # Construct conditions for SQL queries
        conditions = ""
        values = {}

        if country:
            conditions = "country LIKE %(country)s"
            values["country"] = f"%{country}%"

        # Construct base SQL query with LEFT JOIN to include price from tabItem Price
        base_query = """
            SELECT 
                name
            FROM `tabState`
        """

        # Add conditions if any
        if conditions:
            base_query += f" WHERE {conditions}"

        # Execute base query
        state_data = frappe.db.sql(base_query, values, as_dict=True)


        # Creating the response
        synced_time = timeOfZone(datetime.now())
        return create_response(200, "State List Fetched Successfully", {
            "time": synced_time,
            "state_data": state_data
        })
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Error in fetching State")
        return create_response(500, "Error in fetching State")

     

#City List
@frappe.whitelist(allow_guest=True)
def city():
    try:
        # Get parameters from request
        state = frappe.local.form_dict.get('state')

        # Construct conditions for SQL queries
        conditions = ""
        values = {}

        if state:
            conditions = "state LIKE %(state)s"
            values["state"] = f"%{state}%"

        # Construct base SQL query with LEFT JOIN to include price from tabItem Price
        base_query = """
            SELECT 
                name
            FROM `tabCity`
        """

        # Add conditions if any
        if conditions:
            base_query += f" WHERE {conditions}"

        # Execute base query
        city_data = frappe.db.sql(base_query, values, as_dict=True)


        # Creating the response
        synced_time = timeOfZone(datetime.now())
        create_response(200, "City List Fetched Successfully", {
            "time": synced_time,
            "city_data": city_data
        })
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Error in fetching City")
        create_response(500, "Error in fetching City")
    


#Home Page
@frappe.whitelist(allow_guest=True)
def home_page_config():
    try:
        # Fetch the Home Page Configuration document
        home_page = frappe.get_doc('Home Page')

        # Fetch the Shop Setting document and get the warehouse value
        setting = frappe.get_cached_doc('Shop Setting')
        warehouse = setting.warehouse

        # Ensure the warehouse is configured
        if not warehouse:
            frappe.throw("Please setup the Warehouse in Shop Setting.")

        # Initialize lists to store slider data, best selling items, and item category data
        slider_data = []
        best_selling_items = []
        top_item_groups = []

        # Iterate over the slider child table entries
        for child in home_page.slider:
            # Access the fields of the child table (example fields: image, title, subtitle, button_text)
            slider_data.append({
                "image": child.image,
                "title": child.title, 
                "subtitle": child.sub_title,
                "button_text": child.button_text
            })

        # SQL query to join Item and Item Price tables and get best selling items with their price
        best_selling_items_query = """
            SELECT
                i.item_code,
                i.item_name AS item_title,
                i.item_group,
                i.description AS item_desc,
                i.image AS item_image,
                i.custom_image_hover AS item_image_hover,
                COALESCE(bin.actual_qty, 0) AS available_qty,
                COALESCE(it.price_list_rate, 0) AS item_price
            FROM 
                `tabItem` AS i
            LEFT JOIN 
                `tabItem Price` it ON it.item_code = i.item_code AND it.price_list = 'Standard Selling'
            LEFT JOIN 
                `tabBin` bin ON bin.item_code = i.item_code AND bin.warehouse = %(warehouse)s
            WHERE
                i.custom_best_selling = 1
            GROUP BY 
                i.item_code
        """

        # Execute the SQL query with warehouse parameter
        best_selling_item_records = frappe.db.sql(best_selling_items_query, {'warehouse': warehouse}, as_dict=True)

        # Append each best selling item to the list
        for item in best_selling_item_records:
            best_selling_items.append({
                "item_code": item.item_code,
                "item_title": item.item_title,  # Correct field for item name
                "item_price": item.item_price,      # Correct field for price
                "item_image": item.item_image,     # Correct field for image
                "item_image_hover": item.item_image_hover,  # Hover image (if needed)
                "available_qty": item.available_qty,    # Quantity available in warehouse
                "item_group": item.item_group,          # Item group information
                "item_desc": item.item_desc             # Description of the item
            })

        # Construct base SQL query with LEFT JOIN to include item count
        base_query = """
            SELECT 
                ig.name AS item_group,
                COUNT(i.name) AS item_count,
                ig.custom_category_image
            FROM `tabItem Group` ig
            LEFT JOIN `tabItem` i ON i.item_group = ig.name
            WHERE ig.is_group != 1
            GROUP BY ig.name
            ORDER BY COUNT(i.name) DESC
            LIMIT 3
        """

        # Execute the base query to get top 3 item groups
        item_category_data = frappe.db.sql(base_query, as_dict=True)

        # Append each item group and count to the list
        for category in item_category_data:
            top_item_groups.append({
                "item_group": category.item_group,
                "item_count": category.item_count,
                "category_image": category.custom_category_image
            })

        # Get the current time
        synced_time = timeOfZone(datetime.now())

        # Create response with slider data, best selling items, and top item groups
        create_response(200, "Home Page Fetched Successfully", {
            "time": synced_time,
            "slider_data": slider_data,
            "categories": top_item_groups,
            "best_selling_items": best_selling_items
        })

    except Exception as e:
        # Handle any exceptions and log errors
        frappe.log_error(frappe.get_traceback(), "Home Page Config Error")
        return {
            "status": "error",
            "message": str(e)
        }


#Settings Page
@frappe.whitelist(allow_guest=True)
def settings_page_config():
    try:

        # Fetch the Shop Setting document and get the warehouse value
        globalDefaults = frappe.get_cached_doc('Global Defaults')
        settings = frappe.get_cached_doc('Website Settings')
        shopSettings = frappe.get_cached_doc('Shop Setting')

        # Create response with slider data, best selling items, and top item groups
        create_response(200, "Setting Page Fetched Successfully", {
            "app_name": settings.app_name,
            "app_logo": settings.app_logo,
            "copyright": settings.copyright,
            "address": settings.address,
            "stripe_publishable_key": shopSettings.stripe_publishable_key,
            "default_currency": globalDefaults.default_currency,
        })

    except Exception as e:
        # Handle any exceptions and log errors
        frappe.log_error(frappe.get_traceback(), "Home Page Config Error")
        return {
            "status": "error",
            "message": str(e)
        }

