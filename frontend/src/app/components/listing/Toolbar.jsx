// Import Dependencies
import clsx from "clsx";
import { TbUpload } from "react-icons/tb";
import PropTypes from "prop-types";
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { jsPDF } from 'jspdf';

// Local Imports
import { TableConfig } from "./TableConfig";
import { Button, Input } from "components/ui";

export function Toolbar({ table }) {
  const enableFullScreen = table.getState().tableSettings.enableFullScreen;

  const tableData = table.getRowModel().rows.map(row =>
    row.getVisibleCells().reduce((acc, cell) => {
      if (cell.column.id != 'select' && cell.column.id != 'actions') {
        acc[cell.column.id] = cell.getValue();
      }
      return acc;
    }, {})
  );

  const exportPDF = () => {
    const doc = new jsPDF();

    if (!tableData || tableData.length === 0) {
      doc.text("No data available.", 10, 10);
      doc.save('data.pdf');
      return;
    }

    const keys = Object.keys(tableData[0]);
    let y = 10;

    // Header row
    doc.setFont(undefined, 'bold');
    keys.forEach((key, i) => {
      doc.text(key, 10 + i * 50, y); // adjust spacing (50) as needed
    });

    doc.setFont(undefined, 'normal');
    y += 10;

    // Data rows
    tableData.forEach(row => {
      keys.forEach((key, i) => {
        const value = String(row[key] ?? '');
        doc.text(value, 10 + i * 50, y);
      });
      y += 10;
    });

    doc.save('data.pdf');
  };

  const exportCSV = () => {
    if (!tableData || tableData.length === 0) return;
    const keys = Object.keys(tableData[0]);
    const csvRows = [];

    // Header
    csvRows.push(keys.join(','));

    // Rows
    tableData.forEach(obj => {
      const row = keys.map(key => {
        let val = obj[key] ?? '';
        if (typeof val === 'string') val = val.replace(/"/g, '""');
        return `"${val}"`;
      });
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={clsx(
        "flex items-center justify-between",
        enableFullScreen && "px-4 sm:px-5",
      )}
    >
      <SearchInput table={table} />
      <div className={clsx("flex", enableFullScreen && "ltr:-mr-2 rtl:-ml-2")}>
        <TableConfig table={table} />
        <Menu
          as="div"
          className="relative inline-block whitespace-nowrap text-left ml-2"
        >
          <MenuButton
            as={Button}
            variant="outlined"
            className="h-8 space-x-2 rounded-md px-3 text-xs "
          >
            <TbUpload className="size-4" />
            <span>Export</span>
            <ChevronUpDownIcon className="size-4" />
          </MenuButton>
          <Transition
            as={MenuItems}
            enter="transition ease-out"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2"
            className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0"
          >
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={exportPDF}
                  className={clsx(
                    "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                    focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                  )}
                >
                  <span>Export as PDF</span>
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={exportCSV}
                  className={clsx(
                    "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                    focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                  )}
                >
                  <span>Export as CSV</span>
                </button>
              )}
            </MenuItem>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}


function SearchInput({ table }) {
  return (
    <Input
      value={table.getState().globalFilter}
      onChange={(e) => table.setGlobalFilter(e.target.value)}
      prefix={<MagnifyingGlassIcon className="size-4" />}
      classNames={{
        input: "h-8 text-xs ring-primary-500/50 focus:ring-3",
        root: "shrink-0",
      }}
      placeholder="Search ..."
    />
  );
}

SearchInput.propTypes = {
  table: PropTypes.object,
};


Toolbar.propTypes = {
  table: PropTypes.object,
};
