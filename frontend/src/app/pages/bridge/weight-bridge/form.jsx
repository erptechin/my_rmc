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
import { Button, Card } from "components/ui";
import DynamicForms from 'app/components/form/dynamicForms';
import { useInfo, useAddData, useFeachSingle, useUpdateData } from "hooks/useApiHook";

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

  // Watch weight fields for calculations
  const grossWeight = useWatch({ control, name: "gross_weight" });
  const tareWeight = useWatch({ control, name: "tare_weight" });
  const deduct = useWatch({ control, name: "deduct" });

  // Calculate net weight and grand net weight
  useEffect(() => {
    if (grossWeight && tareWeight) {
      const netWeight = parseFloat(grossWeight) - parseFloat(tareWeight);
      setValue('net_weight', netWeight.toString());
      
      if (deduct) {
        const grandNetWeight = netWeight - (netWeight * parseFloat(deduct) / 100);
        setValue('grand_net_weight', grandNetWeight.toString());
      } else {
        setValue('grand_net_weight', netWeight.toString());
      }
    }
  }, [grossWeight, tareWeight, deduct, setValue]);

  // Handle gross weight button click
  const handleGrossWeight = () => {
    const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    setValue('gross_weight_date_time', currentDateTime);
    // In a real application, you would integrate with weight bridge hardware here
    // For now, we'll just set a placeholder value
    setValue('gross_weight', '0');
  };

  // Handle tare weight button click
  const handleTareWeight = () => {
    const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    setValue('tare_weight_date_time', currentDateTime);
    // In a real application, you would integrate with weight bridge hardware here
    // For now, we'll just set a placeholder value
    setValue('tare_weight', '0');
  };

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
          <div className="grid grid-cols-12 place-content-start gap-4 sm:gap-5 lg:gap-6">
            <div className="col-span-12 lg:col-span-8">
              <Card className="p-4 sm:px-5">
                <div className="mt-5 space-y-5">
                  <DynamicForms
                    infos={info}
                    fields={fields}
                    register={register}
                    tables={tableFields}
                    control={control}
                    errors={errors}
                  />
                </div>
              </Card>
            </div>
            <div className="col-span-12 space-y-4 sm:space-y-5 lg:col-span-4 lg:space-y-6">
              <Card className="p-4 sm:px-5">
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Button
                      type="button"
                      variant="outlined"
                      color="primary"
                      onClick={handleGrossWeight}
                      className="w-full"
                    >
                      Gross Weight
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      color="secondary"
                      onClick={handleTareWeight}
                      className="w-full"
                    >
                      Tare Weight
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </Page>
  );
};
