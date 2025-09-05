// Local Imports
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

// Import Dependencies
import { DatePicker } from "components/shared/form/Datepicker";
import { Listbox } from "components/shared/form/Listbox";
import { PhoneDialCode } from "./PhoneDialCode";
import DashboardMeet from "assets/illustrations/dashboard-meet.svg?react";
import { Button, Checkbox, Input } from "components/ui";
import { useThemeContext } from "app/contexts/theme/context";

import { schema } from "./schema";
import { useSignUp } from "hooks/useAuthHook";

// ----------------------------------------------------------------------

const genders = [
  {
    label: "Male",
    value: "male",
  },
  {
    label: "Female",
    value: "female",
  },
  {
    label: "Other",
    value: "other",
  },
];

export default function SignUp() {
  const navigate = useNavigate();
  const {
    primaryColorScheme: primary,
    lightColorScheme: light,
    darkColorScheme: dark,
    isDark,
  } = useThemeContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      mobile_no: "",
      gender: "Male",
      birth_date: "",
      password: "",
      cPassword: "",
      agree: false,
    },
  });

  const mutation = useSignUp((data) => {
    if (data) {
      reset();
      navigate(-1)
    }
  });

  const onSubmit = (data) => {
    if (data?.birth_date) {
      const date = new Date(data?.birth_date[0]);
      date.setDate(date.getDate() + 1);
      const formatted = new Date(date).toISOString().split('T')[0];
      data.birth_date = formatted
    }
    mutation.mutate(data);
  };

  return (
    <main className="min-h-100vh flex">
      <div className="fixed top-0 hidden p-6 lg:block lg:px-12">
        <div className="flex items-center gap-2">
          <img src={"/assets/erptech_rcm/images/logo.png"} alt="" className="w-30" />
        </div>
      </div>
      <div className="hidden w-full place-items-center lg:grid">
        <div className="w-full max-w-lg p-6">
          <DashboardMeet
            style={{
              "--primary": primary[500],
              "--dark-600": isDark ? dark[600] : light[700],
              "--dark-450": dark[450],
            }}
            className="w-full"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center border-gray-150 bg-white dark:border-transparent dark:bg-dark-700 lg:max-w-md ltr:border-l rtl:border-r">
        <div className="flex w-full max-w-sm grow flex-col justify-center p-5">
          <div className="text-center">
            <img src={"/assets/erptech_rcm/images/logo.png"} alt="" className="w-30 mx-auto lg:hidden" />
            <div className="mt-4 lg:mt-0">
              <h2 className="text-2xl font-semibold text-gray-600 dark:text-dark-100">
                Welcome To Brand
              </h2>
              <p className="text-gray-400 dark:text-dark-300">
                Please sign up to continue
              </p>
            </div>
          </div>
          {/* <div className="mt-10 flex gap-4">
            <Button className="h-10 flex-1 gap-3" variant="outlined">
              <img
                className="size-5.5"
                src="/images/logos/google.svg"
                alt="logo"
              />
              <span>Google</span>
            </Button>
            <Button className="h-10 flex-1 gap-3" variant="outlined">
              <img
                className="size-5.5"
                src="/images/logos/github.svg"
                alt="logo"
              />
              <span>Github</span>
            </Button>
          </div>
          <div className="my-7 flex items-center text-tiny-plus">
            <div className="h-px flex-1 bg-gray-200 dark:bg-dark-500"></div>
            <p className="mx-3">OR SIGN UP WITH EMAIL</p>
            <div className="h-px flex-1 bg-gray-200 dark:bg-dark-500"></div>
          </div> */}
          <form className="mt-2" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="space-y-4">
              <Input
                unstyled
                placeholder="First Name"
                className="rounded-lg bg-gray-150 px-3 py-2 transition-colors placeholder:text-gray-400 focus:ring-3 focus:ring-primary-500/50 dark:bg-dark-900 dark:placeholder:text-dark-200/70"
                prefix={
                  <UserIcon
                    className="size-5 transition-colors duration-200"
                    strokeWidth="1"
                  />
                }
                {...register("first_name")}
                error={errors?.first_name?.message}
              />
              <Input
                unstyled
                placeholder="Last Name"
                className="rounded-lg bg-gray-150 px-3 py-2 transition-colors placeholder:text-gray-400 focus:ring-3 focus:ring-primary-500/50 dark:bg-dark-900 dark:placeholder:text-dark-200/70"
                prefix={
                  <UserIcon
                    className="size-5 transition-colors duration-200"
                    strokeWidth="1"
                  />
                }
                {...register("last_name")}
                error={errors?.last_name?.message}
              />
              <Input
                unstyled
                placeholder="Email"
                type="email"
                className="rounded-lg bg-gray-150 px-3 py-2 transition-colors placeholder:text-gray-400 focus:ring-3 focus:ring-primary-500/50 dark:bg-dark-900 dark:placeholder:text-dark-200/70"
                prefix={
                  <EnvelopeIcon
                    className="size-5 transition-colors duration-200"
                    strokeWidth="1"
                  />
                }
                {...register("email")}
                error={errors?.email?.message}
              />

              <div className="flex flex-col">
                <div className="mt-1.5 flex -space-x-px ">
                  <Controller
                    render={({ field: { onChange, value, name } }) => (
                      <PhoneDialCode
                        onChange={onChange}
                        value={value}
                        name={name}
                        error={Boolean(errors?.dialCode)}
                      />
                    )}
                    control={control}
                    name="dialCode"
                  />
                  <Input
                    classNames={{
                      root: "flex-1",
                      input:
                        "hover:z-1 focus:z-1 ltr:rounded-l-none rtl:rounded-r-none",
                    }}

                    placeholder="Phone number"
                    {...register("mobile_no")}
                    error={errors?.mobile_no?.message}
                  />
                </div>
              </div>

              <Controller
                render={({ field }) => (
                  <Listbox
                    data={genders}
                    value={
                      genders.find((gender) => gender.value === field.value) || null
                    }
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    placeholder="Select Gender"
                    displayField="label"
                    error={errors?.gender?.message}
                  />
                )}
                control={control}
                {...register("gender")}
                name="gender"
              />

              <Controller
                render={({ field: { onChange, value, ...rest } }) => (
                  <DatePicker
                    onChange={onChange}
                    value={value || ""}
                    error={errors?.birth_date?.message}
                    options={{ disableMobile: true }}
                    placeholder="Choose date..."
                    {...rest}
                  />
                )}
                control={control}
                {...register("birth_date")}
                name="birth_date"
              />

              <Input
                unstyled
                type="password"
                placeholder="Password"
                className="rounded-lg bg-gray-150 px-3 py-2 transition-colors placeholder:text-gray-400 focus:ring-3 focus:ring-primary-500/50 dark:bg-dark-900 dark:placeholder:text-dark-200/70"
                prefix={
                  <LockClosedIcon
                    className="size-5 transition-colors duration-200"
                    strokeWidth="1"
                  />
                }
                {...register("password")}
                error={errors?.password?.message}
              />
              <Input
                unstyled
                type="password"
                placeholder="Repeat Password"
                className="rounded-lg bg-gray-150 px-3 py-2 transition-colors placeholder:text-gray-400 focus:ring-3 focus:ring-primary-500/50 dark:bg-dark-900 dark:placeholder:text-dark-200/70"
                prefix={
                  <LockClosedIcon
                    className="size-5 transition-colors duration-200"
                    strokeWidth="1"
                  />
                }
                {...register("cPassword")}
                error={errors?.cPassword?.message}
              />

              <div className="flex gap-1">
                <Checkbox label="I agree with"
                  {...register("agree")}
                  error={errors?.agree?.message}
                />
                <a
                  target="_blank"
                  href="https://erptech.in/privacy-policy"
                  className="text-gray-400 transition-colors hover:text-gray-800 focus:text-gray-800 dark:text-dark-300 dark:hover:text-dark-100 dark:focus:text-dark-100"
                >
                  privacy policy
                </a>
              </div>
            </div>
            <Button type="submit" color="primary" className="mt-8 h-10 w-full">
              Sign Up
            </Button>
          </form>
          <div className="mt-4 text-center text-xs-plus">
            <p className="line-clamp-1">
              <span>Already have an account?</span>{" "}
              <Link
                className="text-primary-600 transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600"
                to="/login"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <div className="mb-3 mt-5 flex justify-center text-xs text-gray-400 dark:text-dark-300">
          <a target="_blank" href="https://erptech.in/privacy-policy">Privacy Notice</a>
          <div className="mx-2.5 my-0.5 w-px bg-gray-200 dark:bg-dark-500"></div>
          <a target="_blank" href="https://erptech.in/terms">Term of service</a>
        </div>
      </div>
    </main>
  );
}
