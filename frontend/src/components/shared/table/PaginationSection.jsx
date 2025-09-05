// Import Dependencies
import PropTypes from "prop-types";

// Local Imports
import {
  Pagination,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
  Select,
} from "components/ui";

// ----------------------------------------------------------------------
const numbers = [10, 20, 30, 40, 50, 100];

export function PaginationSection({ table, count, search, setSearch }) {
  const total = count / search.page_length
  const totalCounts = count / (10 * search.page)
  return (
    <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
      <div className="flex items-center space-x-2 text-xs-plus ">
        <span>Show</span>
        <Select
          data={numbers.slice(0, Math.ceil(totalCounts))}
          value={search.page_length}
          onChange={(e) => {
            setSearch({ ...search, page_length: Number(e.target.value) });
          }}
          classNames={{
            root: "w-fit",
            select: "h-7 rounded-full py-1 text-xs ltr:pr-7! rtl:pl-7!",
          }}
        />
        <span>entries</span>
      </div>
      <div>
        <Pagination
          total={Math.ceil(total)}
          value={search.page}
          onChange={(page) => setSearch({ ...search, page })}
        >
          <PaginationPrevious />
          <PaginationItems />
          <PaginationNext />
        </Pagination>
      </div>
      <div className="truncate text-xs-plus">
        {search.page_length * search.page} - {" "}
        {table?.getRowModel().rows.length ?? count}  of{" "}
        {table?.getCoreRowModel().rows.length} entries
      </div>
    </div>
  );
}

PaginationSection.propTypes = {
  table: PropTypes.object,
};
