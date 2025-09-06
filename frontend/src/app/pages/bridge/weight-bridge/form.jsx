// Import Dependencies
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Skeleton } from "components/ui";
import { useThemeContext } from "app/contexts/theme/context";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm, useWatch } from "react-hook-form";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Schema } from "app/components/form/schema";
import { Page } from "components/shared/Page";
import { Button, Card, Input, Select } from "components/ui";
import { useInfo, useAddData, useFeachSingle, useUpdateData } from "hooks/useApiHook";
import { useWeightBridge } from "hooks/useWeightBridge";

const pageName = "Weight Bridge";
const doctype = "Weight Bridge";
const fields = [
  'naming_series', 'date', 'display_data', 'wbslip_type', 'company',
  'purchase_order', 'supplier_name', 'vehicle_no', 'transporter', 'ref_no',
  'delivery_note', 'customer_name', 'vehicle', 'item', 'deduct_reason',
  'gross_weight_date_time', 'tare_weight_date_time', 'gross_weight', 
  'tare_weight', 'net_weight', 'deduct', 'grand_net_weight'
];

const subFields = ['gross', 'tare'];

const tableFields = {
  "ignorFields": {}
}

// ----------------------------------------------------------------------

const initialState = Object.fromEntries(
  [...fields, ...subFields].map(field => [field, ""])
);

export default function AddEditFrom() {
  const { isDark, darkColorScheme, lightColorScheme } = useThemeContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: info, isFetching: isFetchingInfo } = useInfo({ doctype, fields: JSON.stringify([...fields, ...subFields]) });
  const { data, isFetching: isFetchingData } = useFeachSingle({ doctype, id, fields: JSON.stringify([...fields, ...subFields]) });

  const mutationAdd = useAddData((data) => {
    if (data) {
      reset();
      navigate(-1)
    }
  });

  const mutationUpdate = useUpdateData((data) => {
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
    watch,
  } = useForm({
    resolver: yupResolver(Schema(info?.fields)),
    values: id ? data : initialState,
  });

  // Watch form fields after control is initialized
  const wbslipType = useWatch({ control, name: "wbslip_type" });
  const purchaseOrder = useWatch({ control, name: "purchase_order" });
  const deliveryNote = useWatch({ control, name: "delivery_note" });
  
  // Use custom weight bridge hook
  const {
    isGrossDisabled,
    isTareDisabled,
    showInward,
    showOutward,
    itemOptions,
    isNewRecord,
    displayData,
    isWeighScaleEnabled,
    serialPort,
    rmcSettings,
    purchaseOrderData,
    deliveryNoteData,
    handleWBSlipTypeChange,
    handleGrossWeight,
    handleTareWeight,
    calculateWeight,
    setItemOptions,
    setIsGrossDisabled,
    setIsTareDisabled,
    setShowInward,
    setShowOutward,
  } = useWeightBridge(id, purchaseOrder, deliveryNote);



  // Initialize form state based on existing data
  useEffect(() => {
    if (data && id) {
      // Set button states based on existing data
      if (data.gross_weight) {
        setIsGrossDisabled(true);
      }
      if (data.tare_weight) {
        setIsTareDisabled(true);
      }
      
      // Set section visibility based on WB slip type
      if (data.wbslip_type === "Inward") {
        setShowInward(true);
        setShowOutward(false);
      } else if (data.wbslip_type === "Outward") {
        setShowInward(false);
        setShowOutward(true);
      } else if (data.wbslip_type === "Other") {
        setShowInward(true);
        setShowOutward(true);
      }
    }
  }, [data, id, setIsGrossDisabled, setIsTareDisabled, setShowInward, setShowOutward]);

  // Watch weight fields for calculations
  const grossWeight = useWatch({ control, name: "gross_weight" });
  const tareWeight = useWatch({ control, name: "tare_weight" });
  const deduct = useWatch({ control, name: "deduct" });

  // Calculate net weight and grand net weight
  useEffect(() => {
    calculateWeight(grossWeight, tareWeight, deduct, setValue);
  }, [grossWeight, tareWeight, deduct, setValue, calculateWeight]);

  // Watch WB slip type for section visibility

  // Handle WB slip type changes
  useEffect(() => {
    handleWBSlipTypeChange(wbslipType);
  }, [wbslipType, handleWBSlipTypeChange]);

  // Handle gross weight button click (matching doctype logic)
  const onGrossWeight = () => {
    handleGrossWeight(setValue);
  };

  // Handle tare weight button click (matching doctype logic)
  const onTareWeight = () => {
    handleTareWeight(setValue);
  };

  // Handle purchase order data
  useEffect(() => {
    if (purchaseOrderData) {
      setValue('supplier_name', purchaseOrderData.supplier_name);
    }
  }, [purchaseOrderData, setValue]);

  // Handle delivery note data
  useEffect(() => {
    if (deliveryNoteData) {
      setValue('customer_name', deliveryNoteData.customer);
      setValue('vehicle', deliveryNoteData.custom_vehicle);
    }
  }, [deliveryNoteData, setValue]);


  const onSubmit = (data) => {
    if (id) {
      mutationUpdate.mutate({ doctype, body: { ...data, id } })
    } else {
      mutationAdd.mutate({ doctype, body: data })
    }
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
              color="primary"
              type="submit"
              form="new-post-form"
            >
              Save
            </Button>
          </div>
        </div>
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          id="new-post-form"
        >
          <Card className="p-6">
            {/* Header Section - 4 fields in a row */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Series <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="naming_series"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="w-full"
                      options={[{ label: "WB", value: "WB" }]}
                      placeholder="Select Series"
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date</label>
                <Input
                  {...register("date")}
                  type="date"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Display Data</label>
                <div className="relative">
                  <Input
                    value={displayData}
                    className="w-full bg-purple-50 text-center text-lg font-mono font-bold"
                    placeholder="127"
                    readOnly
                  />
                  {isWeighScaleEnabled && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">WBSlip Type</label>
                <Controller
                  name="wbslip_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="w-full"
                      options={[
                        { label: "Inward", value: "Inward" },
                        { label: "Outward", value: "Outward" },
                        { label: "Other", value: "Other" }
                      ]}
                      placeholder="Select Type"
                    />
                  )}
                />
              </div>
            </div>

            {/* Inward Section */}
            {showInward && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Inward</h3>
                <div className="grid grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Purchase Order</label>
                    <Input
                      {...register("purchase_order")}
                      className="w-full"
                      placeholder=""
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Supplier Name</label>
                    <Input
                      {...register("supplier_name")}
                      className="w-full"
                      placeholder=""
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Vehicle No</label>
                    <Input
                      {...register("vehicle_no")}
                      className="w-full"
                      placeholder=""
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Transporter</label>
                    <Input
                      {...register("transporter")}
                      className="w-full"
                      placeholder=""
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Ref No</label>
                    <Input
                      {...register("ref_no")}
                      className="w-full"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Outward Section */}
            {showOutward && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Outward</h3>
                <div className="grid grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Delivery Note</label>
                    <Input
                      {...register("delivery_note")}
                      className="w-full"
                      placeholder=""
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Customer Name</label>
                    <Input
                      {...register("customer_name")}
                      className="w-full"
                      placeholder=""
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Vehicle</label>
                    <Input
                      {...register("vehicle")}
                      className="w-full"
                      placeholder=""
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Item</label>
                    <Controller
                      name="item"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="w-full"
                          options={itemOptions}
                          placeholder="Select Item"
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Deduct Reason</label>
                    <Controller
                      name="deduct_reason"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="w-full"
                          options={[
                            { label: "Select", value: "" },
                            { label: "Moisture", value: "Moisture" },
                            { label: "Bad Quality", value: "Bad Quality" }
                          ]}
                          placeholder="Select"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Weight Details Section */}
            <div className="space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Item</label>
                  <Controller
                    name="item"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        options={itemOptions}
                        placeholder="Select Item"
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Gross Weight Date Time</label>
                  <Input
                    {...register("gross_weight_date_time")}
                    type="datetime-local"
                    className="w-full"
                    placeholder=""
                    readOnly
                  />
                  <p className="text-xs text-gray-500">Asia/Kolkata</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Gross Weight</label>
                  <Input
                    {...register("gross_weight")}
                    className="w-full"
                    placeholder=""
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Deduct %</label>
                  <Input
                    {...register("deduct")}
                    type="number"
                    step="0.01"
                    className="w-full"
                    placeholder=""
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">&nbsp;</label>
                  <Button
                    type="button"
                    onClick={onGrossWeight}
                    disabled={isGrossDisabled}
                    className={`w-full ${isGrossDisabled 
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                      : 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200'
                    }`}
                    variant="outlined"
                  >
                    Gross
                  </Button>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Deduct Reason</label>
                  <Controller
                    name="deduct_reason"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className="w-full"
                        options={[
                          { label: "Select", value: "" },
                          { label: "Moisture", value: "Moisture" },
                          { label: "Bad Quality", value: "Bad Quality" }
                        ]}
                        placeholder="Select"
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tare Weight Date Time</label>
                  <Input
                    {...register("tare_weight_date_time")}
                    type="datetime-local"
                    className="w-full"
                    placeholder=""
                    readOnly
                  />
                  <p className="text-xs text-gray-500">Asia/Kolkata</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tare Weight</label>
                  <Input
                    {...register("tare_weight")}
                    className="w-full"
                    placeholder=""
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Grand Net Weight</label>
                  <Input
                    {...register("grand_net_weight")}
                    className="w-full"
                    placeholder=""
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">&nbsp;</label>
                  <Button
                    type="button"
                    onClick={onTareWeight}
                    disabled={isTareDisabled}
                    className={`w-full ${isTareDisabled 
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                      : 'border-dashed border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                    variant="outlined"
                  >
                    Tare
                  </Button>
                </div>
              </div>

              {/* Row 3 - Net Weight spanning 2 columns */}
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-2 col-start-3 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Net Weight</label>
                  <Input
                    {...register("net_weight")}
                    className="w-full"
                    placeholder=""
                    readOnly
                  />
                </div>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </Page>
  );
};
