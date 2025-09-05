// Import Dependencies
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
  Transition,
  TransitionChild,
  DialogPanel,
  Dialog
} from "@headlessui/react";
import { useDisclosure } from "hooks";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Button } from "components/ui";
import clsx from "clsx";
import { forwardRef, Fragment, useEffect, useMemo, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";

// Local Imports
import { Input } from "components/ui";
import AddEditSubFrom from "./subForm";

// ----------------------------------------------------------------------

const SearchSelect = forwardRef(({ lists, onChange, value, name, error, label, placeholder, isAddNew, rootItem, readOnly }, ref) => {
  const [isOpen, { open, close }] = useDisclosure(false);
  const [query, setQuery] = useState("");
  const [newValue, setNewValue] = useState(value);

  useEffect(() => {
    setNewValue(value)
  }, [value]);

  const filteredData = useMemo(() => {
    if (!lists || lists.length === 0) return [];

    return query === ""
      ? lists
      : lists.filter((list) =>
        list.label
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.toLowerCase().replace(/\s+/g, "")),
      );
  }, [query, lists]);

  const closePopup = (data) => {
    if (data) {
      setNewValue(data.value)
      onChange(data.value)
    }
    close()
  }

  return (
    <>
      <Combobox
        as="div"
        value={lists.find((list) => list.value === newValue) || null}
        onChange={(value) => {
          if (!readOnly) {
            onChange(value);
            setNewValue(value);
          }
        }}
        name={name}
        ref={ref}
      >
        {({ open: openArrow, value: selectedValue }) => (
          <>
            <div className="flex items-center">
              <Label>{label}</Label>
              {isAddNew && !readOnly && (<Button onClick={open} color="secondary" isIcon className="size-6 rounded-full ml-auto"><FaPlusCircle className="size-3" /></Button>)}
            </div>

            <div className="relative mt-1.5">
              <div className="relative w-full cursor-pointer overflow-hidden">
                <ComboboxInput
                  as={Input}
                  autoComplete="new"
                  className={clsx(
                    selectedValue && "ltr:pl-4 ltr:pr-8 rtl:pl-8 rtl:pr-12",
                  )}
                  error={error}
                  displayValue={(val) => val?.label}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={placeholder}
                  suffix={
                    !readOnly && (
                      <ComboboxButton>
                        <ChevronDownIcon
                          className={clsx(
                            "size-5 transition-transform",
                            openArrow && "rotate-180",
                          )}
                          aria-hidden="true"
                        />
                      </ComboboxButton>
                    )
                  }
                />
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-2"
                afterLeave={() => setQuery("")}
              >
                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto overflow-x-hidden rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-750 dark:shadow-none">
                  {filteredData.length === 0 && query !== "" ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-gray-800 dark:text-dark-100">
                      Nothing found for {query}
                    </div>
                  ) : (
                    filteredData.map((item) => (
                      <ComboboxOption
                        key={item.value}
                        className={({ selected, active }) =>
                          clsx(
                            "relative cursor-pointer select-none px-4 py-2 outline-hidden transition-colors",
                            active && !selected && "bg-gray-100 dark:bg-dark-600",
                            selected
                              ? "bg-primary-600 text-white dark:bg-primary-500"
                              : "text-gray-800 dark:text-dark-100",
                          )
                        }
                        value={item.value}
                      >
                        <>
                          <div className="flex items-center space-x-3 ">
                            <span>{item.label}</span>
                          </div>
                        </>
                      </ComboboxOption>
                    ))
                  )}
                </ComboboxOptions>
              </Transition>

            </div>
          </>
        )}
      </Combobox>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-100" onClose={close}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity dark:bg-black/40" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="ease-out transform-gpu transition-transform duration-200"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="ease-in transform-gpu transition-transform duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="fixed right-0 top-0 flex h-full sm:w-[95%] md:w-[600px] transform-gpu flex-col bg-white transition-transform duration-200 dark:bg-dark-700">
              {isOpen && (<AddEditSubFrom onClose={(data) => closePopup(data)} id={null} rootData={rootItem} />)}
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
});

SearchSelect.displayName = "SearchSelect";

export { SearchSelect };
