// Import Dependencies
import React, { useEffect, useState } from "react";
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
import { useInfo, useAddData, useFeachSingle, useUpdateData } from "hooks/useApiHook";
import { getCustomData } from 'utils/apis';
import { useAuthContext } from "app/contexts/auth/context";

const pageName = "Sales Order List"
const doctype = "Sales Order"
const fields_list = ['customer', 'delivery_date', 'po_no', 'po_date', 'items']
const subFields = ['custom_site']

const tableFields = {
  "items": { "item_code": true, "qty": true, "conversion_factor": true },
  "ignorFields": { "custom_site": true }
}

// ----------------------------------------------------------------------

export default function AddEditFrom() {
  const { isDark, darkColorScheme, lightColorScheme } = useThemeContext();
  const { user } = useAuthContext();
  const branch = user?.settings?.is_enable_branch ? ['custom_branch'] : []
  const navigate = useNavigate();
  const { id } = useParams();
  const [fields, setFields] = useState(null)
  const [initialState, setInitialState] = useState({})
  const [sites, setSites] = useState([]);
  const { data: info, isFetching: isFetchingInfo } = useInfo({ doctype, fields: JSON.stringify([...branch, ...fields_list, ...subFields]) });
  const { data, isFetching: isFetchingData } = useFeachSingle({ doctype, id, fields: fields ? JSON.stringify(fields) : null });

  useEffect(() => {
    if (info?.fields) {
      let fields = info?.fields.map(item => item.fieldname)
      setFields(fields);
      setInitialState(Object.fromEntries(fields.map(field => [field, ""])))
    }
  }, [info?.fields])

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

  // Watch customer field
  const customer = useWatch({
    control,
    name: "customer",
  });

  // Effect to handle customer changes
  useEffect(() => {
    const fetchCustomerSites = async () => {
      if (customer) {
        try {
          // Fetch sites for the selected customer
          const response = await getCustomData({
            url: `erptech_rcm.api.custom.get_customer_address?customer_name=${customer}`
          });

          if (response) {
            const siteOptions = response.map(site => ({
              label: site.site_name || site.name,
              value: site.name
            }));
            setSites(siteOptions);

            // If there's only one site, auto-select it
            if (siteOptions.length === 1) {
              setValue('custom_site', siteOptions[0].value);
            } else if (siteOptions.length === 0) {
              setValue('custom_site', ''); // Clear selection if no sites
            }
          }
        } catch (error) {
          console.error('Error fetching customer sites:', error);
          setSites([]);
          setValue('custom_site', '');
        }
      } else {
        setSites([]);
        setValue('custom_site', '');
      }
    };

    fetchCustomerSites();
  }, [customer, setValue]);

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
                  <DynamicForms
                    infos={info}
                    fields={fields_list}
                    tables={tableFields}
                    register={register}
                    control={control}
                    errors={errors}
                    readOnly={info?.is_submittable && data?.docstatus}
                  />
                </div>
              </Card>
            </div>
            <div className="col-span-12 space-y-4 sm:space-y-5 lg:col-span-4 lg:space-y-6">
              <Card className="space-y-5 p-4 sm:px-5">
                <DynamicForms
                  infos={info}
                  fields={[...branch]}
                  register={register}
                  control={control}
                  errors={errors}
                  readOnly={info?.is_submittable && data?.docstatus}
                />
                <Controller
                  render={({ field: { onChange, value, ...rest } }) => {
                    return <SearchSelect
                      onChange={onChange}
                      value={value}
                      label={'Site'}
                      lists={sites}
                      placeholder={`Select Site`}
                      error={errors['custom_site']?.message}
                      readOnly={info?.is_submittable && data?.docstatus}
                      {...rest}
                    />
                  }}
                  control={control}
                  name={'custom_site'}
                  {...register('custom_site')}
                />
              </Card>
            </div>
          </div>
        </form>
      </div>
    </Page>
  );
};
