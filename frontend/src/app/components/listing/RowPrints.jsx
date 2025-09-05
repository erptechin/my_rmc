// Import Dependencies
import { useNavigate } from "react-router";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  EllipsisHorizontalIcon,
  PrinterIcon
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import PropTypes from "prop-types";

// Local Imports
import { Button } from "components/ui";

import { getListData } from 'utils/apis';
// ----------------------------------------------------------------------

export function RowPrints({ row, table }) {

  const printChallan = () => {
    let doctype = table.options.doctype
    window.open(`/printview?doctype=${doctype}&name=${row.original.id}&no_letterhead=1&letterhead=No%20Letterhead&settings=%7B%7D&_lang=en`, "_new")
  };

  const printInstallationNote = async () => {
    let doctype = 'Installation Note'
    let res = await getListData({ doctype, filters: JSON.stringify([[doctype, "custom_delivery_note", "=", row.original.id]]), fields: JSON.stringify(["name"]) })
    if (res.data[0]) {
      window.open(`/printview?doctype=${doctype}&name=${res.data[0].id}&no_letterhead=1&letterhead=No%20Letterhead&settings=%7B%7D&_lang=en`, "_new")
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton
            as={Button}
            variant="flat"
            isIcon
            className="size-7 rounded-full"
          >
            <EllipsisHorizontalIcon className="size-4.5" />
          </MenuButton>
          <Transition
            as={MenuItems}
            enter="transition ease-out"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2"
            className="absolute min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-750 dark:shadow-none ltr:right-0 rtl:left-0 z-500 top-[-45px] right-[45px]"
          >
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={() => printChallan()}
                  className={clsx(
                    "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                    focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                  )}
                >
                  <PrinterIcon className="size-4.5 stroke-1" />
                  <span>Delivery Challan</span>
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={() => printInstallationNote()}
                  className={clsx(
                    "this:error flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-hidden transition-colors dark:text-this-light ",
                    focus && "bg-this/10 dark:bg-this-light/10",
                  )}
                >
                  <PrinterIcon className="size-4.5 stroke-1" />
                  <span>Installation Note</span>
                </button>
              )}
            </MenuItem>
          </Transition>
        </Menu>
      </div>
    </>
  );
}

RowPrints.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};
