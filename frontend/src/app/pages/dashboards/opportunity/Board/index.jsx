// Local Imports
import { FaMicroscope, FaCheckDouble, FaRegClock, FaSpinner, FaClosedCaptioning, FaCircleMinus } from "react-icons/fa6";
import { useBoardContext } from "../Board.context";
import { AddColumnButton } from "./AddColumnButton";
import { useState, useEffect } from "react";
import { Column } from "./Column";
import { NoBoardsFound } from "./NoBoardsFound";
import { useFeachData } from "hooks/useApiHook";

// ----------------------------------------------------------------------
const columns = {
  "Open": {
    color: "info",
    Icon: FaSpinner,
  },
  "Quotation": {
    color: "warning",
    Icon: FaRegClock,
  },
  "Converted": {
    color: "secondary",
    Icon: FaMicroscope,
  },
  "Lost": {
    color: "success",
    Icon: FaCheckDouble,
  },
  "Replied": {
    color: "secondary",
    Icon: FaClosedCaptioning,
  },
  "Closed": {
    color: "warning",
    Icon: FaCircleMinus,
  },
}

export function Board() {
  const { infos, searchQuery, doctype, fields } = useBoardContext();

  const [lists, setLists] = useState(null);

  const [search, setSearch] = useState({ doctype, page: 1, page_length: 100, fields: JSON.stringify(fields) });
  const { data } = useFeachData(search);


  useEffect(() => {
    if (searchQuery) {
      let filters = []
      if (searchQuery.title) {
        filters.push([doctype, "title", "=", searchQuery.title])
      }
      if (searchQuery.source) {
        filters.push([doctype, "source", "=", searchQuery.source])
      }
      if (searchQuery.opportunity_type) {
        filters.push([doctype, "opportunity_type", "=", searchQuery.opportunity_type])
      }
      setSearch({ ...search, filters: JSON.stringify(filters), order_by: searchQuery?.order_by })
    }
  }, [searchQuery])

  useEffect(() => {
    if (data?.data && infos) {
      let status = infos.find(item => item.fieldname === "status")
      let options = status ? status.options.split("\n") : []
      const lists = options.map((item, key) => {
        return {
          id: String(key + 1),
          name: item,
          slug: item,
          color: columns[item]?.color,
          Icon: columns[item]?.Icon,
          tasks: data?.data.filter(it => it.status === item)
        }
      })
      setLists(lists)
    }
  }, [data, infos])

  if (!lists) {
    return <NoBoardsFound />;
  }

  return (
    <div className="grid h-[calc(100vh-7.25rem)] grid-cols-1 supports-[width:1dvh]:h-[calc(100dvh-7.25rem)]">
      <div
        className="custom-scrollbar sm:pt-4 transition-content flex w-full items-start gap-x-4 overflow-x-auto overflow-y-hidden px-(--margin-x)"
        style={{
          "--scrollbar-size": "0.625rem",
          "--margin-scroll": "var(--margin-x)",
        }}
      >
        {lists.map((column, i) => (
          <Column
            lists={lists}
            data={column}
            key={column.id}
            index={i}
          />
        ))}
        {/* <AddColumnButton /> */}
      </div>
    </div>
  );
}
