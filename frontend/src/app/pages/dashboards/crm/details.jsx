
// Import Dependencies
import { useState } from "react";
import clsx from "clsx";
import { FcViewDetails } from "react-icons/fc";
import { LuTextQuote } from "react-icons/lu";
import { RxBorderSplit } from "react-icons/rx";
import { Page } from "components/shared/Page";
import { useNavigate, useParams } from "react-router";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Lists from "./lists";
import {
  HomeIcon,
  EnvelopeIcon,
  UserIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

const pageName = "CRM Details"
const doctype = "Customer"

const tabs = [
  {
    id: 0,
    title: "Opportunity",
    doctype: "Opportunity",
    filterName: "customer_name",
    icon: LuTextQuote
  },
  {
    id: 1,
    title: "Quotation",
    doctype: "Quotation",
    filterName: "customer_name",
    icon: LuTextQuote
  },
  {
    id: 2,
    title: "Sales Order",
    doctype: "Sales Order",
    filterName: "customer",
    icon: RxBorderSplit
  },
  {
    id: 3,
    title: "Project",
    doctype: "Project",
    filterName: "customer",
    icon: RxBorderSplit
  },
];

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Page title={pageName}>
      <div className="transition-content px-(--margin-x) pb-6">
        <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-3">
          <div className="flex items-center gap-1">
            <FcViewDetails className="size-6" />
            <h2 className="line-clamp-1 text-xl font-medium text-gray-700 dark:text-dark-50">
              {pageName}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              className="min-w-[7rem]"
              variant="outlined"
              color="error"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </div>
        </div>


        <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <div className="hide-scrollbar overflow-x-auto">
            <div className="w-max min-w-full border-b-2 border-gray-150 dark:border-dark-500">
              <TabList className="-mb-0.5 flex">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.id}
                    className={({ selected }) =>
                      clsx(
                        "shrink-0 space-x-2 whitespace-nowrap border-b-2 px-3 py-2 font-medium ",
                        selected
                          ? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400"
                          : "border-transparent hover:text-gray-800 focus:text-gray-800 dark:hover:text-dark-100 dark:focus:text-dark-100"
                      )
                    }
                    as={Button}
                    unstyled
                  >
                    <tab.icon className="size-4.5" />
                    <span>{tab.title}</span>
                  </Tab>
                ))}
              </TabList>
            </div>
          </div>
          <TabPanels className="mt-3">
            {tabs.map((tab) => (
              <TabPanel key={tab.id}>
                {selectedIndex === tab.id && <Lists tabData={tab} customer={id} />}
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </Page>
  );
};

