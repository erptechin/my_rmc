from collections import defaultdict
from datetime import datetime
import frappe
import json


@frappe.whitelist(allow_guest=True)
def consumption_settings():
    settings = frappe.get_cached_doc("Consumption Settings").as_dict()
    count = frappe.db.count(settings.consumption_table_to)
    settings["count"] = count
    return settings


# Stetter
@frappe.whitelist(allow_guest=True)
def consumption_set_data_stetter():
    settings = frappe.get_cached_doc("Consumption Settings").as_dict()
    db_name = settings.consumption_table_to
    stringified_data = frappe.local.form_dict.get("payload")
    if not stringified_data:
        return {"status": "error", "message": "No data received"}
    results = json.loads(stringified_data)
    for result in results:
        # TO DO
        items = []
        for item in result["items"]:
            items.append(
                {
                    "batch_index": item["batch_index"],
                    "batch_date": item["batch_date"],
                    "batch_size": item["batch_size"],
                    "prod_adj": item["Prod_Adj"],
                    "prod1_agg_name": item["Prod1_Agg_Name"],
                    "prod1_agg_stwt": item["Prod1_Agg_Stwt"],
                    "prod1_agg_atwt": item["Prod1_Agg_Atwt"],
                    "prod1_agg_moi": item["Prod1_Agg_Moi"],
                    "prod2_agg_name": item["Prod2_Agg_Name"],
                    "prod2_agg_stwt": item["Prod2_Agg_Stwt"],
                    "prod2_agg_atwt": item["Prod2_Agg_Atwt"],
                    "prod2_agg_moi": item["Prod2_Agg_Moi"],
                    "prod3_agg_name": item["Prod3_Agg_Name"],
                    "prod3_agg_stwt": item["Prod3_Agg_Stwt"],
                    "prod3_agg_atwt": item["Prod3_Agg_Atwt"],
                    "prod3_agg_moi": item["Prod3_Agg_Moi"],
                    "prod4_agg_name": item["Prod4_Agg_Name"],
                    "prod4_agg_stwt": item["Prod4_Agg_Stwt"],
                    "prod4_agg_atwt": item["Prod4_Agg_Atwt"],
                    "prod4_agg_moi": item["Prod4_Agg_Moi"],
                    "prod5_agg_name": item["Prod5_Agg_Name"],
                    "prod5_agg_stwt": item["Prod5_Agg_Stwt"],
                    "prod5_agg_atwt": item["Prod5_Agg_Atwt"],
                    "prod5_agg_moi": item["Prod5_Agg_Moi"],
                    "prod6_agg_name": item["Prod6_Agg_Name"],
                    "prod6_agg_stwt": item["Prod6_Agg_Stwt"],
                    "prod6_agg_atwt": item["Prod6_Agg_Atwt"],
                    "prod6_agg_moi": item["Prod6_Agg_Moi"],
                    "prod7_cem_name": item["Prod7_Cem_Name"],
                    "prod7_cem_stwt": item["Prod7_Cem_Stwt"],
                    "prod7_cem_atwt": item["Prod7_Cem_Atwt"],
                    "prod7_cem_corr": item["Prod7_Cem_Corr"],
                    "prod8_cem_name": item["Prod8_Cem_Name"],
                    "prod8_cem_stwt": item["Prod8_Cem_Stwt"],
                    "prod8_cem_atwt": item["Prod8_Cem_Atwt"],
                    "prod8_cem_corr": item["Prod8_Cem_Corr"],
                    "prod9_cem_name": item["Prod9_Cem_Name"],
                    "prod9_cem_stwt": item["Prod9_Cem_Stwt"],
                    "prod9_cem_atwt": item["Prod9_Cem_Atwt"],
                    "prod9_cem_corr": item["Prod9_Cem_Corr"],
                    "prod10_cem_name": item["Prod10_Cem_Name"],
                    "prod10_cem_stwt": item["Prod10_Cem_Stwt"],
                    "prod10_cem_atwt": item["Prod10_Cem_Atwt"],
                    "prod10_cem_corr": item["Prod10_Cem_Corr"],
                    "prod11_cem_name": item["Prod11_Cem_Name"],
                    "prod11_cem_stwt": item["Prod11_Cem_Stwt"],
                    "prod11_cem_atwt": item["Prod11_Cem_Atwt"],
                    "prod11_cem_corr": item["Prod11_Cem_Corr"],
                    "prod12_wtr_name": item["Prod12_Wtr_Name"],
                    "prod12_wtr_stwt": item["Prod12_Wtr_Stwt"],
                    "prod12_wtr_atwt": item["Prod12_Wtr_Atwt"],
                    "prod12_wtr_corr": item["Prod12_Wtr_Corr"],
                    "prod13_wtr_name": item["Prod13_Wtr_Name"],
                    "prod13_wtr_stwt": item["Prod13_Wtr_Stwt"],
                    "prod13_wtr_atwt": item["Prod13_Wtr_Atwt"],
                    "prod13_wtr_corr": item["Prod13_Wtr_Corr"],
                    "prod14_wtr_name": item["Prod14_Wtr_Name"],
                    "prod14_wtr_stwt": item["Prod14_Wtr_Stwt"],
                    "prod14_wtr_atwt": item["Prod14_Wtr_Atwt"],
                    "prod15_adm_name": item["Prod15_Adm_Name"],
                    "prod15_adm_stwt": item["Prod15_Adm_Stwt"],
                    "prod15_adm_atwt": item["Prod15_Adm_Atwt"],
                    "prod15_adm_corr": item["Prod15_Adm_Corr"],
                    "prod16_adm_name": item["Prod16_Adm_Name"],
                    "prod16_adm_stwt": item["Prod16_Adm_Stwt"],
                    "prod16_adm_atwt": item["Prod16_Adm_Atwt"],
                    "prod16_adm_corr": item["Prod16_Adm_Corr"],
                    "prod17_adm_name": item["Prod17_Adm_Name"],
                    "prod17_adm_stwt": item["Prod17_Adm_Stwt"],
                    "prod17_adm_agwt": item["Prod17_Adm_Agwt"],
                    "prod17_adm_corr": item["Prod17_Adm_Corr"],
                    "prod18_adm_name": item["Prod18_Adm_Name"],
                    "prod18_adm_stwt": item["Prod18_Adm_Stwt"],
                    "prod18_adm_atwt": item["Prod18_Adm_Atwt"],
                    "prod18_adm_corr": item["Prod18_Adm_Corr"],
                    "prod19_sil_name": item["Prod19_Sil_Name"],
                    "prod19_sil_stwt": item["Prod19_Sil_Stwt"],
                    "prod19_sil_atwt": item["Prod19_Sil_Atwt"],
                    "prod19_sil_corr": item["Prod19_Sil_Corr"],
                    "prod20_add_name": item["Prod20_Add_Name"],
                    "prod20_add_stwt": item["Prod20_Add_Stwt"],
                    "prod20_add_atwt": item["Prod20_Add_Atwt"],
                    "prod21_add_name": item["Prod21_Add_Name"],
                    "prod21_add_stwt": item["Prod21_Add_Stwt"],
                    "prod21_add_atwt": item["Prod21_Add_Atwt"],
                    "prod22_add_name": item["Prod22_Add_Name"],
                    "prod22_add_stwt": item["Prod22_Add_Stwt"],
                    "prod22_add_atwt": item["Prod22_Add_Atwt"],
                    "prod23_add_name": item["Prod23_Add_Name"],
                    "prod23_add_stwt": item["Prod23_Add_Stwt"],
                    "prod23_add_atwt": item["Prod23_Add_Atwt"],
                    "truck_trip": item["Truck_Trip"],
                    "prod1_agg_moi_ab": item["Prod1_Agg_Moi_Ab"],
                    "prod2_agg_moi_ab": item["Prod2_Agg_Moi_Ab"],
                    "prod3_agg_moi_ab": item["Prod3_Agg_Moi_Ab"],
                    "prod4_agg_moi_ab": item["Prod4_Agg_Moi_Ab"],
                    "prod5_agg_moi_ab": item["Prod5_Agg_Moi_Ab"],
                    "prod6_agg_moi_ab": item["Prod6_Agg_Moi_Ab"],
                    "batch_st": item["Batch_St"],
                    "batch_et": item["Batch_Et"],
                    "bt2_id": item["BT2_ID"],
                }
            )
        data = {
            "batch_no": result["Batch_No"],
            "batch_no_serial": result["batch_no_serial"],
            "batch_date": result["batch_date"],
            "batch_end_time": result["batch_end_time"],
            "cust_id": result["cust_id"],
            "recipe_name": result["recipe_name"],
            "truck_id": result["Truck_ID"],
            "prod_adj": result["Prod_Adj"],
            "driver_name": result["driver_name"],
            "mixing_time": result["mixing_time"],
            "mixet_cap": result["mixet_cap"],
            "consistancy": result["consistancy"],
            "batch_size": result["batch_size"],
            "sch_id": result["Sch_Id"],
            "batch_end_time_txt": result["batch_end_time_txt"],
            "weighed_net_weight": result["weighed_net_weight"],
            "bcp_flag": result["BCP_Flag"],
            "ds_flag": result["DS_Flag"],
            "batch_start_time": result["batch_start_time"],
            "user_id": result["user_id"],
            "recipe_id": result["recipe_id"],
            "site": result["site"],
            "production_qty": result["Production_Qty"],
            "ordered_qty": result["ordered_qty"],
            "pre_mixing_time": result["pre_mixing_time"],
            "strength": result["strength"],
            "load_send_qty": result["load_send_qty"],
            "order_id": result["Order_Id"],
            "batch_start_time_txt": result["batch_start_time_txt"],
            "v_print": result["v_Print"],
            "weigh_bridge_stat": result["Weigh_bridge_stat"],
            "batch_c_flag": result["Batch_C_Flag"],
            "bt1_id": result["BT1_ID"],
            "items": items,
        }
        exists = frappe.db.exists(db_name, {"batch_no": result["Batch_No"]})
        if exists:
            batch = frappe.get_doc(db_name, {"batch_no": result["Batch_No"]})

            # Updtae doc object
            for field, value in data.items():
                if field != "items":
                    batch.set(field, value)

                # Updtae child doc object
                if "items" in data:
                    batch.items.clear()
                    for child_item in data["items"]:
                        batch.append("items", child_item)
            batch.save(ignore_permissions=True)
        else:

            # Create a new doc object
            doc = frappe.get_doc({**{"doctype": db_name}, **data})
            for item in data["items"]:
                doc.append("items", item)

            doc.insert(ignore_permissions=True)

    # Commit the changes to save the records
    frappe.db.commit()
    return {"status": "success", "message": "Data fetched successfully"}


# KYB
@frappe.whitelist(allow_guest=True)
def consumption_set_data_kyb():
    settings = frappe.get_cached_doc("Consumption Settings").as_dict()
    db_name = settings.consumption_table_to
    db_name_delivery_note = "Delivery Note"
    stringified_data = frappe.local.form_dict.get("payload")

    # stringified_data
    if not stringified_data:
        return {"status": "error", "message": "No data received"}
    results = json.loads(stringified_data)
    for result in results:
        # Filter customers by customer_name
        customers = frappe.get_all(
            "Customer",
            filters={"customer_name": result["CUSTOMER_NAME_VAL0"]},
            fields=["name"],
        )
        vehicles = frappe.get_all(
            "Vehicle",
            filters={"name": result["TM_NO_VAL0"]},
            fields=["name"],
        )
        sites = frappe.get_all(
            "Address",
            filters={"address_title": result["SITE_NAME_VAL0"]},
            fields=["name"],
        )

        items = []
        items_delivery_note = []
        for item in result["items"]:
            items.append(
                {
                    "sequence_number": item["sequence_number"],
                    "batch_size_val0": item["BATCH_SIZE_VAL0"],
                    "ticket_id_val0": item["TICKET_ID_VAL0"],
                    "agg_1_name_val0": item["AGG_1_NAME_VAL0"],
                    "agg1_set_log_val0": item["AGG1_SET_LOG_VAL0"],
                    "agg1_act_log_val0": item["AGG1_ACT_LOG_VAL0"],
                    "agg_2_name_val0": item["AGG_2_NAME_VAL0"],
                    "agg2_set_log_val0": item["AGG2_SET_LOG_VAL0"],
                    "agg2_act_log_val0": item["AGG2_ACT_LOG_VAL0"],
                    "adm_1_name_val0": item["ADM_1_NAME_VAL0"],
                    "adm_2_name_val0": item["ADM_2_NAME_VAL0"],
                    "adm_3_name_val0": item["ADM_3_NAME_VAL0"],
                    "adm_4_name_val0": item["ADM_4_NAME_VAL0"],
                    "adm_5_name_val0": item["ADM_5_NAME_VAL0"],
                    "admixer_1_val0": item["ADMIXER_1_VAL0"],
                    "admixer_2_val0": item["ADMIXER_2_VAL0"],
                    "admixer_3_val0": item["ADMIXER_3_VAL0"],
                    "admixer_4_val0": item["ADMIXER_4_VAL0"],
                    "admixer_5_val0": item["ADMIXER_5_VAL0"],
                    "adm1_act_log_val0": item["ADM1_ACT_LOG_VAL0"],
                    "adm1_set_log_val0": item["ADM1_SET_LOG_VAL0"],
                    "adm2_act_log_val0": item["ADM2_ACT_LOG_VAL0"],
                    "adm2_set_log_val0": item["ADM2_SET_LOG_VAL0"],
                    "adm3_act_log_val0": item["ADM3_ACT_LOG_VAL0"],
                    "adm3_set_log_val0": item["ADM3_SET_LOG_VAL0"],
                    "adm4_act_log_val0": item["ADM4_ACT_LOG_VAL0"],
                    "adm4_set_log_val0": item["ADM4_SET_LOG_VAL0"],
                    "adm5_act_log_val0": item["ADM5_ACT_LOG_VAL0"],
                    "adm5_set_log_val0": item["ADM5_SET_LOG_VAL0"],
                    "agg_1_val0": item["AGG_1_VAL0"],
                    "agg_2_val0": item["AGG_2_VAL0"],
                    "agg_3_name_val0": item["AGG_3_NAME_VAL0"],
                    "agg_3_val0": item["AGG_3_VAL0"],
                    "agg_4_name_val0": item["AGG_4_NAME_VAL0"],
                    "agg_4_val0": item["AGG_4_VAL0"],
                    "agg_5_name_val0": item["AGG_5_NAME_VAL0"],
                    "agg_5_val0": item["AGG_5_VAL0"],
                    "agg_6_name_val0": item["AGG_6_NAME_VAL0"],
                    "agg_6_val0": item["AGG_6_VAL0"],
                    "agg1_mos_log_val0": item["AGG1_MOS_LOG_VAL0"],
                    "agg2_mos_log_val0": item["AGG2_MOS_LOG_VAL0"],
                    "agg3_act_log_val0": item["AGG3_ACT_LOG_VAL0"],
                    "agg3_mos_log_val0": item["AGG3_MOS_LOG_VAL0"],
                    "agg3_set_log_val0": item["AGG3_SET_LOG_VAL0"],
                    "agg4_act_log_val0": item["AGG4_ACT_LOG_VAL0"],
                    "agg4_mos_log_val0": item["AGG4_MOS_LOG_VAL0"],
                    "agg4_set_log_val0": item["AGG4_SET_LOG_VAL0"],
                    "agg5_act_log_val0": item["AGG5_ACT_LOG_VAL0"],
                    "agg5_mos_log_val0": item["AGG5_MOS_LOG_VAL0"],
                    "agg5_set_log_val0": item["AGG5_SET_LOG_VAL0"],
                    "agg6_act_log_val0": item["AGG6_ACT_LOG_VAL0"],
                    "agg6_mos_log_val0": item["AGG6_MOS_LOG_VAL0"],
                    "agg6_set_log_val0": item["AGG6_SET_LOG_VAL0"],
                    "cmt_1_name_val0": item["CMT_1_NAME_VAL0"],
                    "cmt_2_name_val0": item["CMT_2_NAME_VAL0"],
                    "cmt_3_name_val0": item["CMT_3_NAME_VAL0"],
                    "cmt_4_name_val0": item["CMT_4_NAME_VAL0"],
                    "cmt_5_name_val0": item["CMT_5_NAME_VAL0"],
                    "cmt_6_name_val0": item["CMT_6_NAME_VAL0"],
                    "cement_1_val0": item["CEMENT_1_VAL0"],
                    "cement_2_val0": item["CEMENT_2_VAL0"],
                    "cement_3_val0": item["CEMENT_3_VAL0"],
                    "cement_4_val0": item["CEMENT_4_VAL0"],
                    "cement_5_val0": item["CEMENT_5_VAL0"],
                    "cement_6_val0": item["CEMENT_6_VAL0"],
                    "cmt1_act_log_val0": item["CMT1_ACT_LOG_VAL0"],
                    "cmt1_set_log_val0": item["CMT1_SET_LOG_VAL0"],
                    "cmt2_act_log_val0": item["CMT2_ACT_LOG_VAL0"],
                    "cmt2_set_log_val0": item["CMT2_SET_LOG_VAL0"],
                    "cmt3_act_log_val0": item["CMT3_ACT_LOG_VAL0"],
                    "cmt3_set_log_val0": item["CMT3_SET_LOG_VAL0"],
                    "cmt4_act_log_val0": item["CMT4_ACT_LOG_VAL0"],
                    "cmt4_set_log_val0": item["CMT4_SET_LOG_VAL0"],
                    "cmt5_act_log_val0": item["CMT5_ACT_LOG_VAL0"],
                    "cmt5_set_log_val0": item["CMT5_SET_LOG_VAL0"],
                    "cmt6_act_log_val0": item["CMT6_ACT_LOG_VAL0"],
                    "cmt6_set_log_val0": item["CMT6_SET_LOG_VAL0"],
                    "wtr_1_name_val0": item["WTR_1_NAME_VAL0"],
                    "wtr_2_name_val0": item["WTR_2_NAME_VAL0"],
                    "water_1_val0": item["WATER_1_VAL0"],
                    "water_1_val0": item["WATER_2_VAL0"],
                    "wtr1_act_log_val0": item["WTR1_ACT_LOG_VAL0"],
                    "wtr1_set_log_val0": item["WTR1_SET_LOG_VAL0"],
                    "wtr2_act_log_val0": item["WTR2_ACT_LOG_VAL0"],
                    "wtr2_set_log_val0": item["WTR2_SET_LOG_VAL0"],
                    "wtr_adj_log_val0": item["WTR_ADJ_LOG_VAL0"],
                }
            )

            # AGG
            items_data1 = frappe.get_all(
                "Item",
                filters={"item_name": item["AGG_1_NAME_VAL0"]},
                fields=["name"],
            )
            items_delivery_note.append(
                {
                    "item_name": items_data1[0].name if items_data1 else None,
                    "act_qty": item["AGG1_ACT_LOG_VAL0"],
                }
            )
            items_data2 = frappe.get_all(
                "Item",
                filters={"item_name": item["AGG_2_NAME_VAL0"]},
                fields=["name"],
            )
            items_delivery_note.append(
                {
                    "item_name": items_data2[0].name if items_data2 else None,
                    "act_qty": item["AGG2_ACT_LOG_VAL0"],
                }
            )
            items_data3 = frappe.get_all(
                "Item",
                filters={"item_name": item["AGG_3_NAME_VAL0"]},
                fields=["name"],
            )
            items_delivery_note.append(
                {
                    "item_name": items_data3[0].name if items_data3 else None,
                    "act_qty": item["AGG3_ACT_LOG_VAL0"],
                }
            )
            items_data4 = frappe.get_all(
                "Item",
                filters={"item_name": item["AGG_4_NAME_VAL0"]},
                fields=["name"],
            )
            items_delivery_note.append(
                {
                    "item_name": items_data4[0].name if items_data4 else None,
                    "act_qty": item["AGG4_ACT_LOG_VAL0"],
                }
            )
            items_data5 = frappe.get_all(
                "Item",
                filters={"item_name": item["AGG_5_NAME_VAL0"]},
                fields=["name"],
            )
            items_delivery_note.append(
                {
                    "item_name": items_data5[0].name if items_data5 else None,
                    "act_qty": item["AGG5_ACT_LOG_VAL0"],
                }
            )
            items_data6 = frappe.get_all(
                "Item",
                filters={"item_name": item["AGG_6_NAME_VAL0"]},
                fields=["name"],
            )
            items_delivery_note.append(
                {
                    "item_name": items_data6[0].name if items_data6 else None,
                    "act_qty": item["AGG6_ACT_LOG_VAL0"],
                }
            )
            # CMT
            items_data_cmt1 = frappe.get_all(
                "Item",
                filters={"item_name": item["CMT_1_NAME_VAL0"]},
                fields=["name"],
            )
            items_delivery_note.append(
                {
                    "item_name": items_data_cmt1[0].name if items_data_cmt1 else None,
                    "act_qty": item["CMT1_ACT_LOG_VAL0"],
                }
            )
            items_data_cmt2 = frappe.get_all(
                "Item",
                filters={"item_name": item["CMT_2_NAME_VAL0"]},
                fields=["name"],
            )
            items_delivery_note.append(
                {
                    "item_name": items_data_cmt2[0].name if items_data_cmt2 else None,
                    "act_qty": item["CMT2_ACT_LOG_VAL0"],
                }
            )
            items_data_cmt3 = frappe.get_all(
                "Item",
                filters={"item_name": item["CMT_3_NAME_VAL0"]},
                fields=["name"],
            )
            items_delivery_note.append(
                {
                    "item_name": items_data_cmt3[0].name if items_data_cmt3 else None,
                    "act_qty": item["CMT3_ACT_LOG_VAL0"],
                }
            )
            items_data_cmt4 = frappe.get_all(
                "Item",
                filters={"item_name": item["CMT_4_NAME_VAL0"]},
                fields=["name"],
            )
            items_delivery_note.append(
                {
                    "item_name": items_data_cmt4[0].name if items_data_cmt4 else None,
                    "act_qty": item["CMT4_ACT_LOG_VAL0"],
                }
            )
            items_data_cmt5 = frappe.get_all(
                "Item",
                filters={"item_name": item["CMT_5_NAME_VAL0"]},
                fields=["name"],
            )
            items_delivery_note.append(
                {
                    "item_name": items_data_cmt5[0].name if items_data_cmt5 else None,
                    "act_qty": item["CMT5_ACT_LOG_VAL0"],
                }
            )
            items_data_cmt6 = frappe.get_all(
                "Item",
                filters={"item_name": item["CMT_6_NAME_VAL0"]},
                fields=["name"],
            )
            items_delivery_note.append(
                {
                    "item_name": items_data_cmt6[0].name if items_data_cmt6 else None,
                    "act_qty": item["CMT6_ACT_LOG_VAL0"],
                }
            )
            # ADM
            items_data_adm1 = frappe.get_all(
                "Item",
                filters={"item_name": item["ADM_1_NAME_VAL0"]},
                fields=["name"],
            )
            items_delivery_note.append(
                {
                    "item_name": items_data_adm1[0].name if items_data_adm1 else None,
                    "act_qty": item["ADM1_ACT_LOG_VAL0"],
                }
            )
            items_data_adm2 = frappe.get_all(
                "Item",
                filters={"item_name": item["ADM_2_NAME_VAL0"]},
                fields=["name"],
            )
            items_delivery_note.append(
                {
                    "item_name": items_data_adm2[0].name if items_data_adm2 else None,
                    "act_qty": item["ADM2_ACT_LOG_VAL0"],
                }
            )
            items_data_adm3 = frappe.get_all(
                "Item",
                filters={"item_name": item["ADM_3_NAME_VAL0"]},
                fields=["name"],
            )
            items_delivery_note.append(
                {
                    "item_name": items_data_adm3[0].name if items_data_adm3 else None,
                    "act_qty": item["ADM3_ACT_LOG_VAL0"],
                }
            )
            items_data_adm4 = frappe.get_all(
                "Item",
                filters={"item_name": item["ADM_4_NAME_VAL0"]},
                fields=["name"],
            )
            items_delivery_note.append(
                {
                    "item_name": items_data_adm4[0].name if items_data_adm4 else None,
                    "act_qty": item["ADM4_ACT_LOG_VAL0"],
                }
            )
            items_data_adm5 = frappe.get_all(
                "Item",
                filters={"item_name": item["ADM_5_NAME_VAL0"]},
                fields=["name"],
            )
            items_delivery_note.append(
                {
                    "item_name": items_data_adm5[0].name if items_data_adm5 else None,
                    "act_qty": item["ADM5_ACT_LOG_VAL0"],
                }
            )
            # WTR
            items_data_wtr1 = frappe.get_all(
                "Item",
                filters={"item_name": item["WTR_1_NAME_VAL0"]},
                fields=["name"],
            )
            items_delivery_note.append(
                {
                    "item_name": items_data_wtr1[0].name if items_data_wtr1 else None,
                    "act_qty": item["WTR1_ACT_LOG_VAL0"],
                }
            )
            items_data_wtr2 = frappe.get_all(
                "Item",
                filters={"item_name": item["WTR_2_NAME_VAL0"]},
                fields=["name"],
            )
            items_delivery_note.append(
                {
                    "item_name": items_data_wtr2[0].name if items_data_wtr2 else None,
                    "act_qty": item["WTR2_ACT_LOG_VAL0"],
                }
            )

        data = {
            "addinfo23": result["AddInfo23"],
            "timestamp_utc": result["timestamp_utc"],
            "timestamp": result["timestamp"],
            "plant_address_val0": result["PLANT_ADDRESS_VAL0"],
            "plant_no_val0": result["PLANT_NO_VAL0"],
            "deliery_no_val0": result["DELIERY_NO_VAL0"],
            "customer_name_val0": customers[0].name if customers else None,
            "customer_address_val0": result["CUSTOMER_ADDRESS_VAL0"],
            "site_name_val0": result["SITE_NAME_VAL0"],
            "site_address_val0": result["SITE_ADDRESS_VAL0"],
            "tm_no_val0": result["TM_NO_VAL0"],
            "driver_name_val0": result["DRIVER_NAME_VAL0"],
            "order_qty_val0": result["ORDER_QTY_VAL0"],
            "pro_qty_val0": result["PRO_QTY_VAL0"],
            "recipe_grade_val0": result["RECIPE_GRADE_VAL0"],
            "recipe_name_val0": result["RECIPE_NAME_VAL0"],
            "recipe_density_val0": result["RECIPE_DENSITY_VAL0"],
            "batching_plant": result["batching_plant"],
            "items": items,
        }

        # data delivery note
        data_delivery_note = {
            "customer": customers[0].name if customers else None,
            "custom_site": sites[0].name if sites else None,
            "shipping_address_name": result["SITE_ADDRESS_VAL0"],
            "custom_vehicle": vehicles[0].name if vehicles else None,
            "driver_name": result["DRIVER_NAME_VAL0"],
            "custom_pro_qty_val0": result["PRO_QTY_VAL0"],
            "custom_recipe_grade_val0": result["RECIPE_GRADE_VAL0"],
            "custom_ticket_id_val0": result["TICKET_ID_VAL0"],
            "custom_batching_plant": result["batching_plant"],
            "custom_addinfo23": result["AddInfo23"],
            "posting_date": result["timestamp"],
            "posting_time": result["timestamp"],
            "custom_batch_date": result["timestamp"],
            "delivery_items": items_delivery_note,
        }
        exists = frappe.db.exists(db_name, {"addinfo23": result["AddInfo23"]})
        if exists:
            batch = frappe.get_doc(db_name, {"addinfo23": result["AddInfo23"]})
            # Updtae doc object
            # for field, value in data.items():
            #     if field != "items":
            #         batch.set(field, value)

            #     # Updtae child doc object
            #     if "items" in data:
            #         batch.table_hbmh.clear()
            #         for child_item in data["items"]:
            #             batch.append("table_hbmh", child_item)

            # batch.save(ignore_permissions=True)
        else:

            # Create a new doc object
            doc = frappe.get_doc({**{"doctype": db_name}, **data})
            for item in data["items"]:
                doc.append("table_hbmh", item)
            doc.insert(ignore_permissions=True)

            # Create a new doc object Delivery Note
            if (
                data_delivery_note["customer"]
                and data_delivery_note["custom_recipe_grade_val0"]
            ):
                item_data = frappe.get_all(
                    "Item",
                    filters={
                        "item_name": data_delivery_note["custom_recipe_grade_val0"]
                    },
                    fields=["item_code", "item_name"],
                )
                if item_data:
                    doc = frappe.get_doc(
                        {**{"doctype": db_name_delivery_note}, **data_delivery_note}
                    )
                    aggregated_data = defaultdict(int)                    
                    for delivery_item in data_delivery_note["delivery_items"]:
                        aggregated_data[delivery_item["item_name"]] += delivery_item[
                            "act_qty"
                        ]
                    results = [
                        {"item_name": item_name, "act_qty": act_qty}
                        for item_name, act_qty in aggregated_data.items()
                    ]
                    
                    for result in results:
                        if result["item_name"]:
                            doc.append("custom_consumed_raw_material", result)
                    doc.append(
                        "items",
                        {
                            "item_code": item_data[0].item_code,
                            "item_name": item_data[0].item_name,
                            "qty": (
                                data_delivery_note["custom_pro_qty_val0"]
                                if (
                                    data_delivery_note["custom_pro_qty_val0"]
                                    and data_delivery_note["custom_pro_qty_val0"] != 0
                                )
                                else 1
                            ),
                        },
                    )
                    doc.insert(ignore_permissions=True)

    # Commit the changes to save the records
    frappe.db.commit()
    return {"status": "success", "message": "Data fetched successfully"}
