// Import Dependencies
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Skeleton } from "components/ui";
import { useThemeContext } from "app/contexts/theme/context";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { DocumentPlusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { getListData, getSingleData } from 'utils/apis';
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";

// Local Imports
import { Schema } from "app/components/form/schema";
import { Page } from "components/shared/Page";
import { Button, Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import DynamicForms from 'app/components/form/dynamicForms';
import { useInfo, useAddData, useFeachSingle, useUpdateData, useFeachData } from "hooks/useApiHook";
import { getCustomData } from "utils/apis";

const pageName = "Delivery Challan List"
const doctype = "Delivery Note"
const fields_list = ['posting_date', 'customer', 'custom_site', 'items']
const subFields = ['custom_dumppump', 'custom_asset_name', 'custom_vehicle', 'driver_name']

const tableFields = {
  "items": { "item_code": true, "uom": true, "custom_bom_no": true, "qty": true, "custom_produced_qty": true, "custom_cumulative_qty": true, "against_sales_order": true },
  ignorFields: { "driver_name": true }
}

// ----------------------------------------------------------------------

function ProductSelectionModal({ isOpen, onClose, onSelect, customer }) {
  const [products, setProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [search, setSearch] = useState({
    doctype: "Sales Order",
    page: 1,
    page_length: 10,
    filters: JSON.stringify([["Sales Order", "status", "!=", "Draft"], ["Sales Order", "customer", "=", customer]]),
    fields: JSON.stringify(['name', 'customer', 'custom_site'])
  });

  const [itemSearch, setItemSearch] = useState({
    doctype: "Sales Order Item",
    page: 1,
    page_length: 50,
    filters: JSON.stringify([["Sales Order Item", "parent", "=", ""]]),
    fields: JSON.stringify(['name', 'item_code', 'qty', 'uom', 'rate', 'bom_no'])
  });

  const { data } = useFeachData(search);
  const { data: itemsData } = useFeachData(itemSearch);

  useEffect(() => {
    setSearch({ ...search, filters: JSON.stringify([["Sales Order", "status", "!=", "Draft"], ["Sales Order", "customer", "=", customer]]) })
  }, [customer])

  useEffect(() => {
    if (data?.data) {
      setProducts(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (selectedOrder) {
      setItemSearch({
        ...itemSearch,
        filters: JSON.stringify([["Sales Order Item", "parent", "=", selectedOrder.name]])
      });
    }
  }, [selectedOrder]);

  useEffect(() => {
    if (itemsData?.data) {
      setOrderItems(itemsData.data);
    }
  }, [itemsData]);

  const handleOrderSelect = async (order) => {
    setSelectedOrder(order);
  };

  const handleItemSelect = async (order, item) => {
    const today = new Date().toISOString().split('T')[0]
    const json = await getListData({ doctype: "Delivery Note Item", page: 1, page_length: 1, fields: JSON.stringify(['*']), filters: JSON.stringify([["Delivery Note Item", "against_sales_order", "=", order.name], ["Delivery Note Item", "so_detail", "=", item.name], ["Delivery Note Item", "creation", "Between", [today, today]]]) })
    onSelect(order, item, json ? json?.data[0] : null);
    setSelectedOrder(null);
    setOrderItems([]);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" onClose={onClose}>
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-gray-900/50 transition-opacity dark:bg-black/40" />
        </TransitionChild>

        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogPanel className="scrollbar-sm relative flex w-full max-w-2xl flex-col overflow-y-auto rounded-lg bg-white p-4 transition-opacity duration-300 dark:bg-dark-700">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {selectedOrder ? 'Select Item' : 'Select Sales Order'}
              </h3>
              {selectedOrder && (
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  Back to Orders
                </Button>
              )}
            </div>

            {!selectedOrder ? (
              // Show Sales Orders List
              <Table>
                <THead>
                  <Tr>
                    <Th>Order No</Th>
                    <Th>Customer</Th>
                    <Th>Action</Th>
                  </Tr>
                </THead>
                <TBody>
                  {products.map((order) => (
                    <Tr key={order.name}>
                      <Td>{order.name}</Td>
                      <Td>{order.customer}</Td>
                      <Td>
                        <Button
                          size="sm"
                          onClick={() => handleOrderSelect(order)}
                        >
                          View Items
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
            ) : (
              // Show Items from Selected Order
              <Table>
                <THead>
                  <Tr>
                    <Th>Item Name</Th>
                    <Th>Quantity</Th>
                    <Th>UOM</Th>
                    <Th>Action</Th>
                  </Tr>
                </THead>
                <TBody>
                  {orderItems.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.item_code}</Td>
                      <Td>{item.qty}</Td>
                      <Td>{item.uom}</Td>
                      <Td>
                        <Button
                          size="sm"
                          onClick={() => handleItemSelect(selectedOrder, item)}
                        >
                          Select
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
            )}
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

export default function AddEditFrom() {
  const { isDark, darkColorScheme, lightColorScheme } = useThemeContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const [fields, setFields] = useState(null);
  const [initialState, setInitialState] = useState({});
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const { data: info, isFetching: isFetchingInfo } = useInfo({ doctype, fields: JSON.stringify([...fields_list, ...subFields]) });
  const { data, isFetching: isFetchingData } = useFeachSingle({ doctype, id, fields: JSON.stringify(fields) });

  useEffect(() => {
    if (info?.fields) {
      let fields = info?.fields.map(item => item.fieldname)
      setFields(fields);
      setInitialState(Object.fromEntries(fields.map(field => [field, ""])))
    }
  }, [info?.fields])

  const mutationAdd = useAddData((data) => {
    if (data) {
      reset();
      if (data.docstatus === 1) {
        createInstallationNote(data)
      } else {
        navigate(-1)
      }
    }
  });

  const mutationUpdate = useUpdateData(async (data) => {
    if (data) {
      reset();
      if (data.docstatus === 1) {
        createInstallationNote(data)
      } else {
        navigate(-1)
      }
    }
  });

  const createInstallationNote = async (data) => {
    let doctype = 'Installation Note'

    // Delete all Installation Note records for the same Delivery Note
    let listData = await getListData({
      doctype,
      filters: JSON.stringify([[doctype, "custom_delivery_note", "=", data?.name]]),
      fields: JSON.stringify(["name"]),
      page_length: 1000
    })
    if (listData?.data?.length > 0) {
      await getCustomData({
        url: `erptech_rcm.api.doctype.delete_data?doctype=${doctype}&ids=${JSON.stringify(listData?.data.map(item => item.name))}`
      });
    }

    // Create Installation Note
    let res = await getListData({ doctype, filters: JSON.stringify([[doctype, "custom_delivery_note", "=", data?.name]]), fields: JSON.stringify(["name"]) })
    if (!res.data[0]) {
      let body = {}
      let item = {}
      let bom = await getSingleData({ doctype: 'BOM', id: data.items[0].custom_bom_no })
      if (data.posting_time) {
        let now = new Date();
        let [hours, minutes, seconds] = (data.posting_time).split(':').map(Number);
        now.setHours(hours, minutes, seconds);
        now.setMinutes(now.getMinutes() - 2);
        let updatedTime = now.toTimeString().split(' ')[0];
        body['inst_time'] = updatedTime
      }
      body['docstatus'] = 1
      body['custom_vehicle_no'] = data.custom_vehicle
      body['custom_driver_name'] = data.driver
      body['custom_recipe_name'] = data.items[0].item_code
      body['customer'] = data.customer
      body['custom_delivery_note'] = data.name

      const today = new Date();
      const formattedDate = today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, '0') + "-" +
        String(today.getDate()).padStart(2, '0');
      body['inst_date'] = formattedDate

      item['item_code'] = data.items[0].item_code
      item['qty'] = data.items[0].qty
      item['custom_bom_no'] = data.items[0].custom_bom_no
      item['custom_recipe_code'] = bom ? bom.custom_recipe_code : ''
      item['custom_sales_order_no'] = data.items[0].against_sales_order
      let qty = data.items[0]['qty']
      // let customCount = Number(qty / data.items[0]['custom_batch_size']).toFixed(0)
      let customCount = Number(qty / 1).toFixed(0)
      item['custom_count'] = customCount
      let custom_percycle = qty / customCount
      item['custom_percycle'] = custom_percycle
      let customNoOfBatch = qty / custom_percycle
      item['custom_no_of_batch'] = customNoOfBatch
      if (customNoOfBatch) {
        let noOfBatch = customNoOfBatch ? customNoOfBatch : 1
        let now = new Date();
        let [hours, minutes, seconds] = (body['inst_time']).split(':').map(Number);
        now.setHours(hours, minutes, seconds);
        now.setSeconds(now.getSeconds() - (Number(noOfBatch) * 80));
        let updatedTime = now.toTimeString().split(' ')[0];
        body['custom_start_time'] = updatedTime
      }
      let custom_installation_note_recipe = []
      if (data.items[0].custom_bom_no) {
        const recipes = bom.items.length ? bom.items : []
        const materialMapping = await getListData({
          doctype: 'Raw Material Mapping',
          fields: JSON.stringify(["item_name", "item", "decimal"]),
          order_by: "srno ASC"
        })
        for (let i = 0; i <= materialMapping.data.length - 1; i++) {
          let installation_note_recipe = {}
          let tempIds = {}
          let recipe = recipes.find((item) => item.item_code == materialMapping.data[i].item && item.item_code in tempIds === false)
          installation_note_recipe.item_name = materialMapping.data[i].item_name;
          installation_note_recipe.decimal = materialMapping.data[i].decimal;
          if (recipe) {
            tempIds[recipe.item_code] = true
            installation_note_recipe.qty = recipe.qty;
            const setQty = Array.from({ length: customNoOfBatch }, () => recipe.qty + Math.floor(Math.random() * (6 + 5 + 1)) - 5);
            installation_note_recipe.qtys = JSON.stringify(setQty);
            installation_note_recipe.uom = recipe.uom;
          } else {
            installation_note_recipe.qty = 0;
            const setQty = Array.from({ length: customNoOfBatch }, () => 0);
            installation_note_recipe.qtys = JSON.stringify(setQty);
            installation_note_recipe.uom = 'Kg';
          }
          custom_installation_note_recipe.push(installation_note_recipe)
        }
      }
      mutationAddInstallation.mutate({ doctype, body: { ...body, items: [item], custom_installation_note_recipe: custom_installation_note_recipe } })
    } else {
      navigate(-1)
    }
  }

  const mutationAddInstallation = useAddData((data) => {
    if (data) {
      reset();
      navigate(-1)
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(Schema(info?.fields)),
    values: id ? data : initialState,
  });

  const onSubmit = async (formData) => {
    if (id) {
      const response = await getCustomData({
        url: `erptech_rcm.api.doctype.update_data?doctype=${doctype}&name=${id}&update_fields=${JSON.stringify([{ 'docstatus': 0 }])}`
      });
      if (response.success) {
        delete formData.creation
        delete formData.modified
        mutationUpdate.mutate({ doctype, body: { ...formData, 'docstatus': 1, id } })
      }
    } else {
      mutationAdd.mutate({ doctype, body: { ...formData, docstatus: 1 } })
    }
  };

  const handleProductSelect = (order, item, preItem) => {
    const today = new Date();
    const formattedDate = today.getFullYear() + "-" +
      String(today.getMonth() + 1).padStart(2, '0') + "-" +
      String(today.getDate()).padStart(2, '0');
    setValue('posting_date', formattedDate);
    setValue('custom_site', order?.custom_site);
    setValue('custom_dumppump', 'Dumping');

    // Add the item to the items table
    const newItem = {
      item_name: item.item_code,
      item_code: item.item_code,
      custom_balance_quantity: item.qty,
      qty: 0,
      uom: item.uom,
      custom_bom_no: item.bom_no,
      against_sales_order: order.name,
      so_detail: item.name,
      custom_cumulative_qty: preItem?.custom_cumulative_qty || 0
    };
    setValue('items', [newItem]);
  };

  if (isFetchingInfo || isFetchingData) {
    return <Skeleton
      style={{
        "--sk-color": isDark ? darkColorScheme[700] : lightColorScheme[300],
      }}
    />
  }

  return (
    <Page title={(id ? 'Edit ' : "New ") + pageName}>
      <div className="transition-content px-(--margin-x) pb-6">
        <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
          <div className="flex items-center gap-1">
            <DocumentPlusIcon className="size-6" />
            <h2 className="line-clamp-1 text-xl font-medium text-gray-700 dark:text-dark-50">
              {id ? 'Edit' : "New"} {pageName}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              className="min-w-[7rem]"
              variant="outlined"
              color="error"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Button
              className="min-w-[7rem]"
              color={"success"}
              type="submit"
              form="new-post-form"
            >
              {"Submit"}
            </Button>
          </div>
        </div>

        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          id="new-post-form"
        >
          <div className="grid grid-cols-12 place-content-start gap-4 sm:gap-5 lg:gap-6">
            <div className="col-span-12 lg:col-span-8">
              <Card className="p-4 sm:px-5">
                <div className="mt-5 space-y-5">
                  {(!id && !watch('custom_site')) ? (
                    <>
                      <DynamicForms
                        infos={info}
                        fields={['customer']}
                        register={register}
                        control={control}
                        errors={errors}
                      />
                      {watch('customer') && (
                        <Button
                          onClick={() => setIsProductModalOpen(true)}
                          className="flex items-center gap-2"
                        >
                          <PlusIcon className="size-5" />
                          Choose Products
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <DynamicForms
                        infos={info}
                        fields={fields_list}
                        tables={tableFields}
                        register={register}
                        control={control}
                        errors={errors}
                        readOnly={true}
                      />
                      {!id && <div className="mt-4">
                        <label className="mb-2 block font-medium text-gray-700 dark:text-dark-50">
                          Enter Quantity
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="number"
                            className="form-input w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm+ dark:border-dark-500"
                            placeholder="Enter quantity"
                            onChange={(e) => {
                              const qty = parseFloat(e.target.value) || 0;
                              const items = watch('items') || [];
                              if (items.length > 0) {
                                const updatedItems = items.map(item => {
                                  const custom_produced_qty = item.custom_cumulative_qty || 0;
                                  const custom_cumulative_qty = custom_produced_qty + qty;
                                  return {
                                    ...item,
                                    qty: qty,
                                    custom_produced_qty: custom_produced_qty,
                                    custom_cumulative_qty: custom_cumulative_qty,
                                    custom_serial_count: (item.custom_serial_count || 0) + 1
                                  };
                                });
                                setValue('items', updatedItems);
                              }
                            }}
                          />
                        </div>
                      </div>}
                    </>
                  )}
                </div>
              </Card>
            </div>
            {(id || watch('custom_site')) && (
              <div className="col-span-12 space-y-4 sm:space-y-5 lg:col-span-4 lg:space-y-6">
                <Card className="space-y-5 p-4 sm:px-5">
                  <DynamicForms
                    infos={info}
                    fields={subFields}
                    tables={tableFields}
                    register={register}
                    control={control}
                    errors={errors}
                    readOnly={info?.is_submittable && data?.docstatus}
                  />
                </Card>
              </div>
            )}
          </div>
        </form>
      </div>
      {watch('customer') && (
        <ProductSelectionModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onSelect={handleProductSelect}
          customer={watch('customer')}
        />
      )}
    </Page>
  );
}
