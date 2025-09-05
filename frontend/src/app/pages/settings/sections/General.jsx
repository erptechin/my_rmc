// Import Dependencies
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { HiPencil } from "react-icons/hi";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { JWT_HOST_API } from 'configs/auth.config';

// Local Imports
import { PreviewImg } from "components/shared/PreviewImg";
import { Avatar, Button, Upload } from "components/ui";
import DynamicForms from 'app/components/form/dynamicForms';
import { useAuthContext } from "app/contexts/auth/context";

import { schema_profile } from "./schema";
import { useUpdProfile } from "hooks/useAuthHook";
import { useInfo } from "hooks/useApiHook";

// ----------------------------------------------------------------------
const doctype = "User"
const field1 = ['first_name', 'email', 'birth_date']
const field2 = ['last_name', 'mobile_no']

export default function General() {
  const { user } = useAuthContext();
  const { data: info } = useInfo({ doctype, fields: JSON.stringify([...field1, ...field2]) });
  const [avatar, setAvatar] = useState("/images/200x200.png");

  useEffect(() => {
    if (user?.user_image) {
      setAvatar(user?.user_image)
    }
  }, [user])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(schema_profile),
    defaultValues: user,
  });

  const mutation = useUpdProfile();

  const onSubmit = (data) => {
    data['user'] = user?.id
    if (avatar) {
      data['user_image'] = avatar
    }
    mutation.mutate(data);
  };

  return (
    <form className="mt-2" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="w-full max-w-3xl 2xl:max-w-5xl">
        <h5 className="text-lg font-medium text-gray-800 dark:text-dark-50">
          General
        </h5>
        <p className="mt-0.5 text-balance text-sm text-gray-500 dark:text-dark-200">
          Update your account settings.
        </p>
        <div className="my-5 h-px bg-gray-200 dark:bg-dark-500" />
        <div className="mt-4 flex flex-col space-y-1.5">
          <span className="text-base font-medium text-gray-800 dark:text-dark-100">
            Profile
          </span>
          <Avatar
            size={20}
            imgComponent={PreviewImg}
            src={`${JWT_HOST_API}${avatar}`}
            classNames={{
              root: "rounded-xl ring-primary-600 ring-offset-[3px] ring-offset-white transition-all hover:ring-3 dark:ring-primary-500 dark:ring-offset-dark-700",
              display: "rounded-xl",
            }}
            indicator={
              <div className="absolute bottom-0 right-0 -m-1 flex items-center justify-center rounded-full bg-white dark:bg-dark-700">
                {avatar ? (
                  <Button
                    onClick={() => setAvatar(null)}
                    isIcon
                    className="size-6 rounded-full"
                  >
                    <XMarkIcon className="size-4" />
                  </Button>
                ) : (
                  <Upload name="avatar" onChange={setAvatar} accept="image/*">
                    {({ ...props }) => (
                      <Button isIcon className="size-6 rounded-full" {...props}>
                        <HiPencil className="size-3.5" />
                      </Button>
                    )}
                  </Upload>
                )}
              </div>
            }
          />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 [&_.prefix]:pointer-events-none">
          <div className="space-y-4">
            <DynamicForms
              infos={info}
              fields={field1}
              register={register}
              control={control}
              errors={errors}
              tables={{}}
            />
          </div>
          <div className="space-y-4">
            <DynamicForms
              infos={info}
              fields={field2}
              register={register}
              control={control}
              errors={errors}
              tables={{}}
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-3 ">
          <Button className="min-w-[7rem]" type="submit" color="primary">
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
