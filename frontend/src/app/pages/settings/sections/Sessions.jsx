// Import Dependencies
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

// Local Imports
import { Button, Input } from "components/ui";
import { useAuthContext } from "app/contexts/auth/context";

// ----------------------------------------------------------------------

import { schema } from "./schema";
import { useChangePassword } from "hooks/useAuthHook";

export default function Sessions() {
  const { user } = useAuthContext();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const mutation = useChangePassword((data) => {
    if (data) {
      reset();
    }
  });

  const onSubmit = (data) => {
    data['user'] = user?.id
    mutation.mutate(data);
  };

  return (
    <div className="w-full max-w-3xl 2xl:max-w-5xl">
      <h5 className="text-lg font-medium text-gray-800 dark:text-dark-50">
        Active Sessions & Password
      </h5>
      <p className="mt-0.5 text-balance text-sm">
        Active sessions and update password section. You can terminate them by
        clicking on the remove button.
      </p>
      <div className="my-5 h-px bg-gray-200 dark:bg-dark-500" />
      <form className="mt-2" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div>
          <p className="text-base font-medium text-gray-800 dark:text-dark-100">
            Password Reset
          </p>
          <p className="mt-0.5 text-balance text-sm">
            Update your password here. Enter your current and new password.
          </p>
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <p className="my-auto font-medium">Current Password:</p>
              <Input
                type="password"
                classNames={{ root: "mt-1.5 flex-1 md:col-span-2 md:mt-0" }}
                placeholder="********"
                {...register("old_password")}
                error={errors?.old_password?.message}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3">
              <p className="my-auto font-medium">New Password:</p>
              <Input
                type="password"
                classNames={{ root: "mt-1.5 flex-1 md:col-span-2 md:mt-0" }}
                placeholder="********"
                {...register("new_password")}
                error={errors?.new_password?.message}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3">
              <p className="my-auto font-medium">Confirm Password:</p>
              <Input
                type="password"
                classNames={{ root: "mt-1.5 flex-1 md:col-span-2 md:mt-0" }}
                placeholder="********"
                {...register("confirm_password")}
                error={errors?.confirm_password?.message}
              />
            </div>
          </div>
          <div className="text-end mt-4">
            <Button type="submit" color="primary">
              Update password
            </Button>
          </div>
        </div>
      </form>

    </div>
  );
}
