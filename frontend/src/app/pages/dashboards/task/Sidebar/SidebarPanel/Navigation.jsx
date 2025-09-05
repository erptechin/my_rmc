// Import Dependencies
import {
  TrashIcon,
  SunIcon,
  StarIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import React from "react";

// Local Imports
import { Button } from "components/ui";
import { useTodoContext } from "../../Todo.context";

// ----------------------------------------------------------------------

const navigation = {
  "Open": {
    id: "1",
    link: "#",
    messageCount: 0,
    icon: SunIcon,
    color: "neutral",
  },
  "Working": {
    id: "2",
    link: "#",
    messageCount: 0,
    icon: StarIcon,
    color: "neutral",
  },
  "Pending Review": {
    id: "3",
    link: "#",
    messageCount: 0,
    icon: HomeIcon,
    color: "neutral",
  },
  "Overdue": {
    id: "4",
    link: "#",
    messageCount: 0,
    icon: UserIcon,
    color: "neutral",
  },
  "Template": {
    id: "5",
    link: "#",
    messageCount: 0,
    icon: StarIcon,
    color: "neutral",
  },
  "Completed": {
    id: "6",
    link: "#",
    messageCount: 0,
    icon: HomeIcon,
    color: "neutral",
  },
  "Cancelled": {
    id: "7",
    link: "#",
    messageCount: 0,
    icon: TrashIcon,
    color: "error",
  },
};

export function Navigation() {
  const { infos, searchQuery, setSearchQuery } = useTodoContext();

  // status
  const status = infos.find(info => info.fieldname === "status");
  const options = status?.options.split("\n");

  return (
    <ul className="space-y-1.5 px-2 pt-4 font-medium">
      {options && options.map((item, key) => (
        <li key={key}>
          <Button
            color={item === searchQuery?.status ? "primary" : navigation[item]?.color}
            variant={item === searchQuery?.status ? "soft" : "flat"}
            className="group w-full justify-between gap-2 p-2 text-xs-plus"
            onClick={() => setSearchQuery({
              ...searchQuery,
              status: searchQuery?.status === item ? null : item
            })}
          >
            <div className="flex gap-2">
              {navigation[item]?.icon && React.createElement(navigation[item].icon, {
                className: clsx(
                  "size-4.5 transition-colors",
                  item !== searchQuery?.status &&
                  "text-gray-400 group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200"
                )
              })}
              <span className="truncate">{item}</span>
            </div>
          </Button>
        </li>
      ))}
    </ul>
  );
}
