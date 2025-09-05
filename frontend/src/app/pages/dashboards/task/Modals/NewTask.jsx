// Import Dependencies
import PropTypes from "prop-types";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Schema } from "app/components/form/schema";
import {
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import DynamicForms from 'app/components/form/dynamicForms';
import { useTodoContext } from "../Todo.context";

// Local Imports
import {
  Button
} from "components/ui";

import { useAddData } from "hooks/useApiHook";

const tableFields = {
  "depends_on": { "task": true, "subject": true },
  "ignorFields": { naming_series: true }
}

// ----------------------------------------------------------------------

export function NewTask({ isOpen, close }) {

  return (
    <Transition
      appear
      show={isOpen}
      as={Dialog}
      className="relative z-100"
      onClose={close}
    >
      <TransitionChild
        as="div"
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity dark:bg-black/40"
      />

      <TransitionChild
        as={DialogPanel}
        enter="ease-out transform-gpu transition-transform duration-200"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="ease-in transform-gpu transition-transform duration-200"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
        className="fixed right-0 top-0 flex h-full w-full max-w-3xl transform-gpu flex-col bg-white transition-transform duration-200 dark:bg-dark-700"
      >
        <NewTaskForm close={close} />
      </TransitionChild>
    </Transition>
  );
}
function NewTaskForm({ close }) {
  const { infos, doctype, fields } = useTodoContext();
  // const [fields, setFields] = useState(null)
  const [initialState, setInitialState] = useState({})

  useEffect(() => {
    if (infos) {
      setInitialState(Object.fromEntries(fields.map(field => [field, ""])))
    }
  }, [infos])

  const mutationAdd = useAddData((data) => {
    if (data) {
      close();
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setFocus,
  } = useForm({
    resolver: yupResolver(Schema(infos)),
    defaultValues: initialState,
  });

  const onSubmit = (data) => {
    mutationAdd.mutate({ doctype, body: data })
  };

  useEffect(() => {
    setFocus("subject");
  }, [setFocus]);

  return (
    <form
      className="flex h-full flex-col"
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
    >
      <header className="flex h-14 items-center justify-between bg-gray-100 px-4 dark:bg-dark-800">
        <h3 className="text-base font-medium text-gray-800 dark:text-dark-100 p-2">
          New Todo
        </h3>
        <div className="flex items-center">
          <Button
            onClick={close}
            isIcon
            variant="flat"
            className="size-7 rounded-full"
          >
            <XMarkIcon className="size-4.5" />
          </Button>
        </div>
      </header>

      <div className="place-content-start gap-4 overflow-y-auto p-4 sm:grid-cols-2">
        <DynamicForms
          infos={{ fields: infos }}
          fields={fields}
          tables={tableFields}
          register={register}
          control={control}
          errors={errors}
        />
      </div>

      <div className="flex justify-end gap-4 border-t border-gray-200 p-4 dark:border-dark-500">
        <Button onClick={close} variant="flat" className="min-w-[8rem]">
          Cancel
        </Button>
        <Button type="submit" color="primary" className="min-w-[8rem]">
          Save
        </Button>
      </div>


    </form>
  );
}

NewTask.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
};

NewTaskForm.propTypes = {
  close: PropTypes.func,
};
