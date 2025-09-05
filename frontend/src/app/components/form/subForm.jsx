// Import Dependencies
import { useEffect, useState } from "react";
import { Skeleton } from "components/ui";
import { useThemeContext } from "app/contexts/theme/context";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

// Local Imports
import { Schema } from "app/components/form/schema";
import { Page } from "components/shared/Page";
import { Button, Card } from "components/ui";
import DynamicForms from 'app/components/form/dynamicForms';
import { useInfo, useAddData, useFeachSingle, useUpdateData } from "hooks/useApiHook";

// ----------------------------------------------------------------------

export default function AddEditSubFrom({ onClose, id, rootData }) {
  const { isDark, darkColorScheme, lightColorScheme } = useThemeContext();
  const doctype = rootData.options
  const [fields, setFields] = useState([])
  const initialState = Object.fromEntries(
    [...fields].map(field => [field, ""])
  );
  const { data: info, isLoading: isLoadingInfo } = useInfo({ doctype });
  const { data, isLoading } = useFeachSingle({ doctype, id, fields: JSON.stringify(fields) });

  useEffect(() => {
    if (info?.fields) {
      const fields = (info.fields).filter(item => item.read_only === 0).map(item => item.fieldname)
      setFields(fields)
    }
  }, [info])

  const mutationAdd = useAddData((data) => {
    if (data) {
      onClose({
        'value': data.name,
        'label': data[rootData?.title_field],
      })
    }
  });

  const mutationUpdate = useUpdateData((data) => {
    if (data) {
      onClose({
        'value': data.name,
        'label': data[rootData?.title_field],
      })
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
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

  if (id && isLoading || isLoadingInfo) {
    return <Skeleton
      style={{
        "--sk-color": isDark ? darkColorScheme[700] : lightColorScheme[300],
      }}
    />
  }

  return (
    <Page title="New Post Form">
      <div className="transition-content px-10 pb-6">
        <div className="space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
          <div className="items-center gap-1">
            <h2 className="line-clamp-1 text-xl mb-5 font-medium text-gray-700 dark:text-dark-50">
              Add New {doctype}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              className="min-w-[7rem]"
              variant="outlined"
              color="error"
              onClick={() => onClose()}
            >
              Close
            </Button>
            <Button
              className="min-w-[7rem]"
              color="primary"
              type="button"
              onClick={handleSubmit(onSubmit)}
              form="new-sub-post-form"
            >
              Save
            </Button>
          </div>
        </div>
        <form
          autoComplete="off"
          id="new-sub-post-form"
        >
          <div className="grid grid-cols-12 place-content-start gap-4 sm:gap-5 lg:gap-6">
            <div className="col-span-12 lg:col-span-12">
              <Card className="p-4 sm:px-5 overflow-y-auto max-h-screen">
                <div className="mt-5 space-y-5">
                  <DynamicForms
                    infos={info}
                    ignorFields={[]}
                    fields={fields}
                    register={register}
                    control={control}
                    errors={errors}
                  />
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </Page>
  );
};
