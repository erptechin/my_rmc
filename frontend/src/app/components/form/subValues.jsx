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
import { useInfo } from "hooks/useApiHook";

// ----------------------------------------------------------------------

export default function SubValues({ onClose, data, doctype }) {
  const { isDark, darkColorScheme, lightColorScheme } = useThemeContext();
  const [fields, setFields] = useState([])
  const initialState = Object.fromEntries(
    [...fields].map(field => [field, ""])
  );
  const { data: info, isLoading: isLoadingInfo } = useInfo({ doctype });

  useEffect(() => {
    if (info?.fields) {
      const fields = (info.fields).filter(item => item.read_only === 0 && item.reqd === 1).map(item => item.fieldname)
      setFields(fields)
    }
  }, [info])

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(Schema(info?.fields)),
    values: data ? data : initialState,
  });

  const onSubmit = (data) => {
    onClose(data)
  };

  if (isLoadingInfo) {
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
              <Card className="p-4 sm:px-5">
                <div className="mt-5 space-y-5 h-[75vh] overflow-y-auto">
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
          </div>
        </form>
      </div>
    </Page>
  );
};
