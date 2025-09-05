// Import Dependencies
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
// Local Imports
import { useTodoContext } from "../Todo.context";
import { TodoCard } from "./TodoCard";
import { getItemPosition } from "../utils";
import { useFeachData } from "hooks/useApiHook";

// ----------------------------------------------------------------------

export function Todos() {
  const { todos, doctype, fields, searchQuery } = useTodoContext();
  const [parent] = useAutoAnimate();
  const [lists, setLists] = useState([]);
  const [search, setSearch] = useState({ doctype, page: 1, page_length: 10, fields: JSON.stringify(fields) });
  const { data } = useFeachData(search);

  useEffect(() => {
    if (searchQuery) {
      let filters = []
      if (searchQuery.subject) {
        filters.push([doctype, "subject", "=", searchQuery.subject])
      }
      if (searchQuery.priority) {
        filters.push([doctype, "priority", "=", searchQuery.priority])
      }
      if (searchQuery.status) {
        filters.push([doctype, "status", "=", searchQuery.status])
      }
      setSearch({ ...search, filters: JSON.stringify(filters), order_by: searchQuery?.order_by })
    }
  }, [searchQuery])

  useEffect(() => {
    if (data?.data) {
      setLists(data?.data)
    }
  }, [data])


  return (
    <div ref={parent} className="relative flex flex-col pt-4">
      {lists.map((todo, key) => {
        return (
          <TodoCard
            key={todo.name}
            todo={todo}
            index={key}
            position={getItemPosition({
              index: key,
              items: todos,
            })}
          />
        );
      })}
    </div>
  );
}
