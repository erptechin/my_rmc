// Import Dependencies
import PropTypes from "prop-types";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
  CheckCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useFeachSingle, useUpdateData, useDeleteData } from "hooks/useApiHook";

// Local Imports
import { Button } from "components/ui";
import { useThemeContext } from "app/contexts/theme/context";
import { useBoardContext } from "../../Board.context";
import DynamicForms from 'app/components/form/dynamicForms';
import { TitleField } from "./TitleField";
import { Schema } from "app/components/form/schema";

// ----------------------------------------------------------------------

const tableFields = {
  "notes": { "note": true },
  "ignorFields": { naming_series: true, title: true }
}

export function EditTask({ isOpen, close, data, columnData }) {
  const { doctype, fields } = useBoardContext();
  const { data: newData } = useFeachSingle({ doctype, id: data.id, fields: JSON.stringify([...fields]) });

  return (
    <Transition
      appear
      show={isOpen}
      as={Dialog}
      className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden sm:px-5 sm:py-6"
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
        className="absolute inset-0 bg-gray-900/50 transition-opacity dark:bg-black/40"
      />

      <TransitionChild
        as={DialogPanel}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="hide-scrollbar relative flex h-full w-full max-w-4xl flex-col overflow-y-auto bg-white p-4 transition-opacity duration-300 dark:bg-dark-700 sm:rounded-lg sm:px-5"
      >
        {newData && <EditTaskForm close={close} data={newData} columnData={columnData} />}
      </TransitionChild>
    </Transition>
  );
}

function EditTaskForm({ close, data, columnData }) {
  const { infos, doctype, fields } = useBoardContext();

  const mutationUpd = useUpdateData((data) => {
    if (data) {
      close();
    }
  });

  const mutationDel = useDeleteData((data) => {
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
    defaultValues: data,
  });

  const onSubmit = (formData) => {
    mutationUpd.mutate({ doctype, body: { ...formData, id: data.id } })
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="flex grow flex-col"
    >
      <div className="flex gap-3">
        <div className="pt-1">
          <CheckCircleIcon className="size-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <TitleField
              register={register}
              error={errors?.title?.message}
              listName={columnData.name}
            />
            <Button onClick={close} className="px-3 py-1.5 text-xs">
              ESC
            </Button>
          </div>
        </div>
      </div>

      <DynamicForms
        infos={{ fields: infos }}
        fields={[...fields]}
        // fields={[...fields, "notes"]}
        tables={tableFields}
        register={register}
        control={control}
        errors={errors}
      />

      <div className="grow"></div>

      <div className="mt-6 flex justify-between">
        <Button
          onClick={() => mutationDel.mutate({ doctype, ids: [data.id] })}
          color="error"
          className="gap-2 md:min-w-[8rem]"
        >
          <TrashIcon className="size-4.5" />
          <div className="max-md:hidden">Delete</div>
        </Button>

        <div className="flex justify-end gap-4">
          <Button onClick={close} variant="flat" className="min-w-[8rem]">
            Cancel
          </Button>
          <Button type="submit" color="primary" className="min-w-[8rem]">
            Update Task
          </Button>
        </div>
      </div>
    </form>
  );
}

EditTask.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  columnData: PropTypes.object.isRequired,
};

EditTaskForm.propTypes = {
  close: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  columnData: PropTypes.object.isRequired,
};
