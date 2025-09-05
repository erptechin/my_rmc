import frappe
import base64
from frappe.utils.password import check_password, update_password
from frappe.utils import escape_html

@frappe.whitelist(allow_guest=True)
def login(usr, pwd, company=None, device_id=None):
    if company:
        company = frappe.get_value("Company", company, "abbr")
        usr = company + '-' + usr
    try:
        login_manager = frappe.auth.LoginManager()
        login_manager.authenticate(user=usr, pwd=pwd)
        login_manager.post_login()
        set_device_id(usr, device_id)
    except frappe.exceptions.AuthenticationError:
        frappe.clear_messages()
        frappe.local.response.http_status_code = 422
        frappe.local.response["message"] = "Invalid Email or Password"
        return

    user = frappe.get_doc("User", frappe.session.user)

    api_generate = generate_keys(user)

    # Update the User
    frappe.db.set_value(
        "User", frappe.session.user, {"api_key": str(api_generate["api_key"])}
    )
    frappe.db.commit()

    token_string = str(api_generate["api_key"]) + ":" + str(api_generate["api_secret"])

    frappe.response["user"] = {
        "id": escape_html(user.name or ""),
        "first_name": escape_html(user.first_name or ""),
        "last_name": escape_html(user.last_name or ""),
        "gender": escape_html(user.gender or "") or "",
        "birth_date": user.birth_date or "",
        "mobile_no": user.mobile_no or "",
        "username": user.username or "",
        "full_name": user.full_name or "",
        "email": user.email or "",
        "user_image": user.user_image,
    }
    frappe.response["token"] = base64.b64encode(token_string.encode("ascii")).decode(
        "utf-8"
    )
    return

def set_device_id(user, device_id):
    pass
    # frappe.db.set_value("User Device",{"user":user},"device_id",device_id)

def generate_keys(user):
    api_secret = api_key = ""
    if not user.api_key and not user.api_secret:
        api_secret = frappe.generate_hash(length=15)
        # if api key is not set generate api key
        api_key = frappe.generate_hash(length=15)
        user.api_key = api_key
        user.api_secret = api_secret
        user.save(ignore_permissions=True)
    else:
        api_secret = user.get_password("api_secret")
        api_key = user.get("api_key")
    return {"api_secret": api_secret, "api_key": api_key}

# Sign Up
@frappe.whitelist(allow_guest=True)
def sign_up():
    company = frappe.local.form_dict.company
    email = frappe.local.form_dict.email
    password = frappe.local.form_dict.password
    first_name = frappe.local.form_dict.first_name
    last_name = frappe.local.form_dict.last_name
    mobile_no = frappe.local.form_dict.mobile_no
    gender = frappe.local.form_dict.gender
    birth_date = frappe.local.form_dict.birth_date

    if company:
        company_abbr = frappe.get_value("Company", company, "abbr")
        username = company_abbr + '-' + email

    # Check if customer with the same mobile number already exists
    if frappe.db.exists("User", {"email": email}):
        create_response(404, f"User with Email {email} already exists", {})
    else:
        # Create User for the new customer
        user = frappe.get_doc(
            {
                "doctype": "User",
                "email": email,
                "company": company,
                "first_name": first_name,
                "gender": gender,
                "role_profile_name": "MyProfile",
                "last_name": last_name,
                "mobile_no": mobile_no,
                "new_password": password,
                "birth_date": birth_date,
            }
        )
        user.insert(ignore_permissions=True)

        # Creating the response
        synced_time = timeOfZone(datetime.now())
        create_response(
            200,
            "User created successfully",
            {"time": synced_time, "customer": customer.name},
        )

@frappe.whitelist()
def profile():
    user = frappe.get_doc("User", frappe.session.user)
    settings = frappe.get_cached_doc('RMC Settings')
    
    # Get employee details if exists
    employee = None
    if frappe.db.exists("Employee", {"user_id": frappe.session.user}):
        employee = frappe.get_doc("Employee", {"user_id": frappe.session.user})
    
    frappe.response["user"] = {
        "id": escape_html(user.name or ""),
        "first_name": escape_html(user.first_name or ""),
        "last_name": escape_html(user.last_name or ""),
        "gender": escape_html(user.gender or "") or "",
        "birth_date": user.birth_date or "",
        "mobile_no": user.mobile_no or "",
        "username": user.username or "",
        "full_name": user.full_name or "",
        "email": user.email or "",
        "user_image": user.user_image,
        "settings": settings,
        "employeeId":employee.name if employee else None
    }
    return

# Update Profile
@frappe.whitelist()
def update_profile():

    # Parameters
    user = frappe.local.form_dict.user
    first_name = frappe.local.form_dict.first_name
    last_name = frappe.local.form_dict.last_name
    mobile_no = frappe.local.form_dict.mobile_no
    user_image = frappe.local.form_dict.user_image
    gender = frappe.local.form_dict.gender
    birth_date = frappe.local.form_dict.birth_date

    # Check if the user is logged in
    if frappe.session.user == "Guest":
        return {
            "status": "failed",
            "message": ("You need to be logged in to change your password"),
        }

    # Validate if the user exists
    if not frappe.db.exists("User", user):
        return {"status": "failed", "message": ("User does not exist")}

    # Update the Profile
    try:
        frappe.db.set_value(
            "User", frappe.session.user, {
                "first_name": first_name,
                "last_name": last_name,
                "full_name": first_name + " " + last_name,
                "mobile_no": mobile_no,
                "gender": gender,
                "user_image": user_image,
            }
        )
        frappe.db.commit()

        return {"status": "success", "message": ("Profile updated successfully")}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), ("Profile updated  Error"))
        return {
            "status": "failed",
            "message": ("An error occurred while updating the Profile: {0}").format(
                str(e)
            ),
        }
    
# Changes Password
@frappe.whitelist()
def change_password():
    # Parameters
    user = frappe.local.form_dict.user
    old_password = frappe.local.form_dict.old_password
    new_password = frappe.local.form_dict.new_password
    confirm_password = frappe.local.form_dict.confirm_password

    # Check if the user is logged in
    if frappe.session.user == "Guest":
        return {
            "status": "failed",
            "message": ("You need to be logged in to change your password"),
        }

    # Validate if the user exists
    if not frappe.db.exists("User", user):
        return {"status": "failed", "message": ("User does not exist")}

    # Check if old password is correct
    try:
        check_password(user, old_password)
    except frappe.exceptions.AuthenticationError:
        return {"status": "failed", "message": ("Old password is incorrect")}

    # Validate if the new password and confirm password match
    if new_password != confirm_password:
        return {
            "status": "failed",
            "message": ("New password and confirm password do not match"),
        }

    # Update the password
    try:
        update_password(user, new_password)

        return {"status": "success", "message": ("Password updated successfully")}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), ("Password Change Error"))
        return {
            "status": "failed",
            "message": ("An error occurred while updating the password: {0}").format(
                str(e)
            ),
        }
 