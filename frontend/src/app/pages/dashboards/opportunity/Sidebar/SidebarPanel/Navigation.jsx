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
import { useBoardContext } from "../../Board.context";

// ----------------------------------------------------------------------

const navigation = {
  "Walk In": {
    id: "1",
    link: "#",
    messageCount: 0,
    icon: SunIcon,
    color: "neutral",
  },
  "Campaign": {
    id: "2",
    link: "#",
    messageCount: 0,
    icon: StarIcon,
    color: "neutral",
  },
  "Customer's Vendor": {
    id: "3",
    link: "#",
    messageCount: 0,
    icon: HomeIcon,
    color: "neutral",
  },
  "Mass Mailing": {
    id: "4",
    link: "#",
    messageCount: 0,
    icon: UserIcon,
    color: "neutral",
  },
  "Supplier Reference": {
    id: "5",
    link: "#",
    messageCount: 0,
    icon: StarIcon,
    color: "neutral",
  },
  "Exhibition": {
    id: "6",
    link: "#",
    messageCount: 0,
    icon: HomeIcon,
    color: "neutral",
  },
  "Cold Calling": {
    id: "1",
    link: "#",
    messageCount: 0,
    icon: SunIcon,
    color: "neutral",
  },
  "Advertisement": {
    id: "2",
    link: "#",
    messageCount: 0,
    icon: StarIcon,
    color: "neutral",
  },
  "Reference": {
    id: "3",
    link: "#",
    messageCount: 0,
    icon: HomeIcon,
    color: "neutral",
  },
  "Existing Customer": {
    id: "4",
    link: "#",
    messageCount: 0,
    icon: UserIcon,
    color: "neutral",
  },
};

export function Navigation() {
  const { infos, searchQuery, setSearchQuery } = useBoardContext();

  // sources
  const sources = infos.find(info => info.fieldname === "source");

  return (
    <div className="mt-4">
      <div className="flex min-w-0 items-center justify-between px-4">
        <span className="truncate text-tiny-plus font-medium uppercase">
          Sources
        </span>
      </div>
      <ul className="space-y-1.5 px-2 pt-4 font-medium">
        {sources?.options_list && sources.options_list.map((item, key) => (
          <li key={key}>
            <Button
              color={item.value === searchQuery?.source ? "primary" : navigation[item.value]?.color}
              variant={item.value === searchQuery?.source ? "soft" : "flat"}
              className="group w-full justify-between gap-2 p-2 text-xs-plus"
              onClick={() => setSearchQuery({
                ...searchQuery,
                source: searchQuery?.source === item.value ? null : item.value
              })}
            >
              <div className="flex gap-2">
                {navigation[item.value]?.icon && React.createElement(navigation[item.value].icon, {
                  className: clsx(
                    "size-4.5 transition-colors",
                    item.value !== searchQuery?.source &&
                    "text-gray-400 group-hover:text-gray-500 group-focus:text-gray-500 dark:text-dark-300 dark:group-hover:text-dark-200 dark:group-focus:text-dark-200"
                  )
                })}
                <span className="truncate">{item.label}</span>
              </div>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
