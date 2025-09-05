// Import Dependencies
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Skeleton } from "components/ui";
import { useThemeContext } from "app/contexts/theme/context";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Schema } from "app/components/form/schema";
import { Page } from "components/shared/Page";
import { Button, Card } from "components/ui";
import DynamicForms from 'app/components/form/dynamicForms';

import { useAuthContext } from "app/contexts/auth/context";
import { useInfo, useAddData, useFeachSingle, useUpdateData } from "hooks/useApiHook";

const pageName = "Quotation List"
const doctype = "Quotation"
const fields_list = ['quotation_to', 'transaction_date', 'order_type', 'company', 'custom_site', 'items']

const tableFields = {
  "items": { "item_name": true, "qty": true, "uom": true, "custom_bom_no": true, "custom_produced_qty": true, "custom_cumulative_qty": true },
  "ignorFields": { }
}

// ----------------------------------------------------------------------

// const initialState = Object.fromEntries(
//   [...fields, ...subFields].map(field => [field, ""])
// );

export default function AddEditFrom() {
  const { isDark, darkColorScheme, lightColorScheme } = useThemeContext();
  const navigate = useNavigate();
  const [fields, setFields] = useState(null)
  const [initialState, setInitialState] = useState({})
  const { user } = useAuthContext();
  const { id } = useParams();
  const branch = user?.settings?.is_enable_branch ? ['custom_branch'] : []
  const { data: info, isFetching: isFetchingInfo } = useInfo({ doctype, fields: JSON.stringify([...branch, ...fields_list, ...fields_list]) });
  const { data, isFetching: isFetchingData } = useFeachSingle({ doctype, id, fields: JSON.stringify(fields) });


  useEffect(() => {
    if (info?.fields) {
      let fields = info?.fields.map(item => item.fieldname)
      setFields(fields)
      setInitialState(Object.fromEntries(fields.map(field => [field, ""])))
    }
  }, [info?.fields])

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
            {info?.is_submittable ? (
              <>
                <Button
                  className="min-w-[7rem]"
                  color="primary"
                  type="submit"
                  form="new-post-form"
                  disabled={data?.docstatus > 1}
                  onClick={() => setValue('docstatus', 0)}
                >
                  Save
                </Button>
                {data?.docstatus === 1 ? <Button
                  className="min-w-[7rem]"
                  color="error"
                  type="submit"
                  form="new-post-form"
                  onClick={() => setValue('docstatus', 2)}
                >
                  Cancel
                </Button> : <Button
                  className="min-w-[7rem]"
                  color="success"
                  type="submit"
                  form="new-post-form"
                  disabled={data?.docstatus > 1}
                  onClick={() => setValue('docstatus', 1)}
                >
                  Submit
                </Button>
                }

              </>
            ) : (
              <Button
                className="min-w-[7rem]"
                color="primary"
                type="submit"
                form="new-post-form"
              >
                Save
              </Button>
            )}
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
                    tables={tableFields}
                    register={register}
                    control={control}
                    errors={errors}
                  />
                </div>
              </Card>
            </div>
            <div className="col-span-12 space-y-4 sm:space-y-5 lg:col-span-4 lg:space-y-6">
              <Card className="space-y-5 p-4 sm:px-5">
                <DynamicForms
                  infos={info}
                  fields={branch}
                  register={register}
                  control={control}
                  errors={errors}
                />
                {/* <DynamicForms
                  infos={info}
                  fields={subFields}
                  register={register}
                  control={control}
                  errors={errors}
                /> */}
              </Card>
            </div>
          </div>
        </form>
      </div>
    </Page>
  );
};
