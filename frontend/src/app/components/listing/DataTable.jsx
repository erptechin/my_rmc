import { useNavigate } from "react-router";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { Fragment, useRef, useState, useEffect } from "react";
import { Page } from "components/shared/Page";
import { PlusIcon } from "@heroicons/react/20/solid";

import { TableSortIcon } from "components/shared/table/TableSortIcon";
import { ColumnFilter } from "components/shared/table/ColumnFilter";
import { PaginationSection } from "components/shared/table/PaginationSection";
import { Button, Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import {
  useBoxSize,
  useLockScrollbar,
  useLocalStorage,
  useDidUpdate,
} from "hooks";
import { fuzzyFilter } from "utils/react-table/fuzzyFilter";
import { useSkipper } from "utils/react-table/useSkipper";
import { SelectedRowsActions } from "app/components/listing/SelectedRowsActions";
import { SubRowComponent } from "app/components/listing/SubRowComponent";
import { Columns } from "app/components/listing/columns";
import { Toolbar } from "app/components/listing/Toolbar";
import { useThemeContext } from "app/contexts/theme/context";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";
import PropTypes from "prop-types";

const isSafari = getUserAgentBrowser() === "Safari";

export function DataTable({ 
  pageName, 
  doctype, 
  fields, 
  addNewRoute = "add-new",
  storageKey = "default",
  isPrint = false,
  data = [],
  info = null,
  search = { doctype, page: 1, page_length: 10, fields: null },
  setSearch = () => {},
  onDeleteRow = () => {},
  onDeleteRows = () => {}
}) {
  const { cardSkin } = useThemeContext();
  const navigate = useNavigate();
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const [tableSettings, setTableSettings] = useState({
    enableSorting: true,
    enableColumnFilters: true,
    enableFullScreen: false,
    enableRowDense: false,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    `column-visibility-${storageKey}`,
    {},
  );

  const [columnPinning, setColumnPinning] = useLocalStorage(
    `column-pinning-${storageKey}`,
    {},
  );

  const cardRef = useRef();
  const { width: cardWidth } = useBoxSize({ ref: cardRef });

  const table = useReactTable({
    data: data,
    columns: Columns(info?.fields, [], isPrint),
    doctype,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
      columnPinning,
      tableSettings,
    },
    meta: {
      setTableSettings,
      deleteRow: (row) => {
        skipAutoResetPageIndex();
        onDeleteRow(row);
      },
      deleteRows: (rows) => {
        skipAutoResetPageIndex();
        onDeleteRows(rows);
      },
    },

    filterFns: {
      fuzzy: fuzzyFilter,
    },
    enableSorting: tableSettings.enableSorting,
    enableColumnFilters: tableSettings.enableColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,

    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,

    autoResetPageIndex,
  });

  useDidUpdate(() => table.resetRowSelection(), [data]);
  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <Page title={pageName}>
      <div className="transition-content grid grid-cols-1 grid-rows-[auto_auto_1fr] px-(--margin-x) py-4">
        <div className="flex items-center justify-between space-x-2">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-medium text-gray-800 dark:text-dark-50">
              {pageName}
            </h2>
          </div>
          <Button
            className="h-7 space-x-1 rounded-md px-2 text-xs"
            color="primary"
            onClick={() => navigate(addNewRoute)}
          >
            <PlusIcon className="size-4" />
            <span>New {doctype}</span>
          </Button>
        </div>
        <div
          className={clsx(
            "flex flex-col pt-2",
            tableSettings.enableFullScreen &&
            "fixed inset-0 z-61 h-full w-full bg-white pt-2 dark:bg-dark-900",
          )}
        >
          <Toolbar table={table} />
          <Card
            className={clsx(
              "relative mt-2 flex grow flex-col",
              tableSettings.enableFullScreen && "overflow-hidden",
            )}
            ref={cardRef}
          >
            <div className="table-wrapper min-w-full grow overflow-x-auto">
              <Table
                hoverable
                dense={tableSettings.enableRowDense}
                sticky={tableSettings.enableFullScreen}
                className="w-full text-left rtl:text-right"
              >
                <THead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <Th
                          key={header.id}
                          className={clsx(
                            "bg-gray-200 font-bold text-xs uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100 first:ltr:rounded-tl-lg last:ltr:rounded-tr-lg first:rtl:rounded-tr-lg last:rtl:rounded-tl-lg px-3 py-3 max-w-xs",
                            header.column.getCanPin() && [
                              header.column.getIsPinned() === "left" &&
                              "sticky z-2 ltr:left-0 rtl:right-0",
                              header.column.getIsPinned() === "right" &&
                              "sticky z-2 ltr:right-0 rtl:left-0",
                            ],
                          )}
                        >
                          {header.column.getCanSort() ? (
                            <div
                              className="flex cursor-pointer select-none items-center space-x-2"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <span className="flex-1 text-xs font-bold truncate">
                                {header.isPlaceholder
                                  ? null
                                  : (() => {
                                      const headerText = flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                      );
                                      return typeof headerText === 'string' && headerText.length > 15
                                        ? headerText.substring(0, 15) + '...'
                                        : headerText;
                                    })()}
                              </span>
                              <TableSortIcon
                                sorted={header.column.getIsSorted()}
                              />
                            </div>
                          ) : header.isPlaceholder ? null : (
                            <span className="text-xs font-bold truncate">
                              {(() => {
                                const headerText = flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                );
                                return typeof headerText === 'string' && headerText.length > 15
                                  ? headerText.substring(0, 15) + '...'
                                  : headerText;
                              })()}
                            </span>
                          )}
                          {header.column.getCanFilter() ? (
                            <ColumnFilter column={header.column} />
                          ) : null}
                        </Th>
                      ))}
                    </Tr>
                  ))}
                </THead>
                <TBody>
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <Fragment key={row.id}>
                        <Tr
                          className={clsx(
                            "relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500",
                            row.getIsExpanded() && "border-dashed",
                            row.getIsSelected() && !isSafari &&
                            "row-selected after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500",
                          )}
                        >
                          {row.getVisibleCells().map((cell) => {
                            return (
                              <Td
                                key={cell.id}
                                className={clsx(
                                  "relative text-xs px-2 py-1",
                                  cell.column.id === "actions" ? "overflow-visible" : "truncate max-w-xs",
                                  cardSkin === "shadow-sm"
                                    ? "dark:bg-dark-700"
                                    : "dark:bg-dark-900",

                                  cell.column.getCanPin() && [
                                    cell.column.getIsPinned() === "left" &&
                                    "sticky z-2 ltr:left-0 rtl:right-0",
                                    cell.column.getIsPinned() === "right" &&
                                    "sticky z-2 ltr:right-0 rtl:left-0",
                                  ],
                                )}
                              >
                                {cell.column.getIsPinned() && (
                                  <div
                                    className={clsx(
                                      "pointer-events-none absolute inset-0 border-gray-200 dark:border-dark-500",
                                      cell.column.getIsPinned() === "left"
                                        ? "ltr:border-r rtl:border-l"
                                        : "ltr:border-l rtl:border-r",
                                    )}
                                  ></div>
                                )}
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </Td>
                            );
                          })}
                        </Tr>
                        {row.getIsExpanded() && (
                          <tr>
                            <td
                              colSpan={row.getVisibleCells().length}
                              className="p-0"
                            >
                              <SubRowComponent row={row} cardWidth={cardWidth} />
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </TBody>
              </Table>
            </div>
            <SelectedRowsActions table={table} />
            {table.getCoreRowModel().rows.length > 0 && (
              <div
                className={clsx(
                  "px-2 pb-2 sm:px-3 sm:pt-2",
                  tableSettings.enableFullScreen && "bg-gray-50 dark:bg-dark-800",
                  !(
                    table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()
                  ) && "pt-2",
                )}
              >
                <PaginationSection table={table} count={search?.counts ?? 0} search={search} setSearch={setSearch} />
              </div>
            )}
          </Card>
        </div>
      </div>
    </Page>
  );
}

DataTable.propTypes = {
  pageName: PropTypes.string.isRequired,
  doctype: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  addNewRoute: PropTypes.string,
  storageKey: PropTypes.string,
  isPrint: PropTypes.bool,
  data: PropTypes.array,
  info: PropTypes.object,
  search: PropTypes.object,
  setSearch: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onDeleteRows: PropTypes.func,
};
