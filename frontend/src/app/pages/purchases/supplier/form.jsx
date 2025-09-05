// Import Dependencies
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Skeleton } from "components/ui";
import { useThemeContext } from "app/contexts/theme/context";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm, useWatch } from "react-hook-form";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { SearchSelect } from "app/components/form/SearchSelect";

// Local Imports
import { Schema } from "app/components/form/schema";
import { Page } from "components/shared/Page";
import { Button, Card } from "components/ui";
import DynamicForms from 'app/components/form/dynamicForms';
import { getCustomData, addData } from 'utils/apis';
import { useInfo, useAddData, useFeachSingle, useUpdateData } from "hooks/useApiHook";

const pageName = "Suppliers"
const doctype = "Supplier"
const fields = ['supplier_name', 'supplier_type', 'gstin', 'pan']
const subFields = ['supplier_primary_address']

// ----------------------------------------------------------------------

const initialState = Object.fromEntries(
  [...fields, ...subFields].map(field => [field, ""])
);

export default function AddEditFrom() {
  const { isDark, darkColorScheme, lightColorScheme } = useThemeContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const [address, setAddress] = useState([]);
  const { data: info, isFetching: isFetchingInfo } = useInfo({ doctype, fields: JSON.stringify([...fields, ...subFields]) });
  const { data, isFetching: isFetchingData, refetch } = useFeachSingle({ doctype, id, fields: JSON.stringify([...fields, ...subFields]) });


  useEffect(() => {
    if (info?.fields) {
      const options_lists = info?.fields.find(item => item.fieldname === 'supplier_primary_address')
      setAddress(options_lists?.options_list ? options_lists.options_list : []);
    }
  }, [info?.fields]);


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
  } = useForm({
    resolver: yupResolver(Schema(info?.fields)),
    values: id ? data : initialState,
  });

  // Watch GSTIN field
  const gstin = useWatch({
    control,
    name: "gstin",
  });

  // Effect to handle GSTIN changes
  useEffect(() => {
    const fetchGSTInfo = async () => {
      if (gstin && gstin.length >= 15) {
        try {
          const response = await getCustomData({ url: `erptech_rcm.api.custom.gst_info?keyword=${gstin}` });
          if (response) {
            const json = JSON.parse(response);
            const pan = gstin.slice(2, 12);
            let address = json.data?.pradr?.addr ? json.data.pradr.addr : {};

            // Check for existing address
            const existingAddresses = await getCustomData({
              url: `frappe.client.get_list?doctype=Address&fields=["name"]&filters=[["gstin","=","${gstin}"],["address_type","=","Billing"]]&limit=1`
            });

            setValue('supplier_name', json.data.lgnm || json.data.tradeNam);
            setValue('pan', pan);

            if (!existingAddresses?.length) {
              // Create new address
              const newAddressData = {
                doctype: 'Address',
                address_type: 'Billing',
                gstin: gstin,
                pan: pan,
                address_title: json.data.tradeNam,
                address_line1: `${address.bno || ''} ${address.flno || ''}`.trim(),
                address_line2: address.landMark || '',
                county: address.locality || '',
                city: address.loc || '',
                state: address.stcd || '',
                pincode: address.pncd || ''
              };

              const newAddressResponse = await addData({
                doctype: 'Address',
                body: newAddressData
              });

              if (newAddressResponse) {
                setAddress([...address, { label: newAddressResponse.address_title, value: newAddressResponse.name }]);
                setValue('supplier_primary_address', newAddressResponse.name);
              }
            } else {
              setValue('supplier_primary_address', existingAddresses[0].name);
            }
          }
        } catch (error) {
          console.error('Error fetching GST info:', error);
        }
      }
    };

    fetchGSTInfo();
  }, [gstin, setValue, id, refetch]);

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
                    control={control}
                    errors={errors}
                  />
                </div>
              </Card>
            </div>
            <div className="col-span-12 space-y-4 sm:space-y-5 lg:col-span-4 lg:space-y-6">
              <Card className="space-y-5 p-4 sm:px-5">
                <Controller
                  render={({ field: { onChange, value, ...rest } }) => {
                    return <SearchSelect
                      onChange={onChange}
                      value={value}
                      label={'Customer Primary Address'}
                      lists={address}
                      placeholder={`Customer Primary Address`}
                      error={errors['supplier_primary_address']?.message}
                      {...rest}
                    />
                  }}
                  control={control}
                  name={'supplier_primary_address'}
                  {...register('supplier_primary_address')}
                />
              </Card>
            </div>
          </div>
        </form>
      </div>
    </Page>
  );
};
