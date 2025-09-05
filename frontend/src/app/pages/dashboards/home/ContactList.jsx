// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { useNavigate } from "react-router";
import {
  ChevronDownIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment, useRef, useState, useEffect } from "react";
import {
  FaComment,
  FaEllipsisH,
  FaEnvelope,
  FaPhoneAlt,
  FaVideo,
} from "react-icons/fa";

// Local Imports
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Button,
  Card,
} from "components/ui";

import { useInfo, useFeachData } from "hooks/useApiHook";
// ----------------------------------------------------------------------

const doctype = "Quotation"
const fields = ['quotation_to', 'transaction_date', 'order_type', 'company', 'custom_site']

export function ContactList() {
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);

  const { data: info } = useInfo({ doctype, fields: JSON.stringify(fields) });
  const [search, setSearch] = useState({ doctype, page: 1, page_length: 10, fields: null });
  const { data } = useFeachData(search);

  useEffect(() => {
    if (info?.fields) {
      const fieldnames = info?.fields.map(field => field.fieldname);
      setSearch({ ...search, fields: JSON.stringify([...fieldnames, "name"]) })
    }
  }, [info])

  useEffect(() => {
    if (data?.data) {
      setLists(data?.data)
    }
  }, [data])

  return (
    <Card className="px-4 pb-4 sm:px-5">
      <div className="flex h-14 items-center justify-between py-3">
        <h2 className="truncate text-sm-plus font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Contact List
        </h2>
        <a
          onClick={() => navigate('/sales/quotation')}
          className="border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary-600 outline-hidden transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
        >
          View All
        </a>
      </div>

      <Accordion className="space-y-4" defaultValue="contact-1">
        {lists.map((contact) => (
          <AccordionItem key={contact.id} value={`contact-${contact.id}`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 gap-3">
                <Avatar
                  size={10}
                  name={contact.name}
                  src={contact.company}
                  initialColor="auto"
                />
                <div className="min-w-0">
                  <h3 className="truncate font-medium text-gray-800 dark:text-dark-100">
                    {contact.name}
                  </h3>
                  <p className="mt-1 truncate text-xs">{contact.company}</p>
                </div>
              </div>
              <AccordionButton
                component={Button}
                variant="flat"
                isIcon
                className="size-7 rounded-full ltr:-mr-1 rtl:-ml-1"
              >
                {({ open }) => (
                  <div
                    className={clsx(
                      "transition-transform duration-300",
                      open && "-rotate-180",
                    )}
                  >
                    <ChevronDownIcon className="size-4.5" />
                  </div>
                )}
              </AccordionButton>
            </div>
            <AccordionPanel>
              <div className="flex justify-between pt-3">
                <Button
                  variant="soft"
                  color="success"
                  className="size-7 rounded-full"
                  isIcon
                >
                  <FaPhoneAlt className="size-3" />
                </Button>
                <Button
                  variant="soft"
                  color="warning"
                  className="size-7 rounded-full"
                  isIcon
                >
                  <FaVideo className="size-3" />
                </Button>
                <Button
                  variant="soft"
                  color="secondary"
                  className="size-7 rounded-full"
                  isIcon
                >
                  <FaComment className="size-3" />
                </Button>
                <Button
                  variant="soft"
                  color="info"
                  className="size-7 rounded-full"
                  isIcon
                >
                  <FaEnvelope className="size-3" />
                </Button>
                <Button className="size-7 rounded-full" isIcon>
                  <FaEllipsisH className="size-3" />
                </Button>
              </div>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}

function ActionMenu() {
  return (
    <Menu
      as="div"
      className="relative inline-block text-left ltr:-mr-1.5 rtl:-ml-1.5"
    >
      <MenuButton
        as={Button}
        variant="flat"
        isIcon
        className="size-8 rounded-full"
      >
        <EllipsisHorizontalIcon className="size-5" />
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <MenuItems className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0">
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                  focus &&
                  "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                <span>Action</span>
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                  focus &&
                  "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                <span>Another action</span>
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                  focus &&
                  "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                <span>Other action</span>
              </button>
            )}
          </MenuItem>

          <hr className="mx-3 my-1.5 h-px border-gray-150 dark:border-dark-500" />

          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                  focus &&
                  "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                <span>Separated action</span>
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
