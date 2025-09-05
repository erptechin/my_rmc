// Import Dependencies
import { Fragment, useRef, useState, useEffect } from "react";
import clsx from "clsx";
import { PlusIcon } from "@heroicons/react/24/outline";

// Local Imports
import { useTodoContext } from "../../Todo.context";
import { useThemeContext } from "app/contexts/theme/context";
import { Button, ScrollShadow } from "components/ui";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { Labels } from "./Labels";
import { NewTask } from "../../Modals/NewTask";
import { useDisclosure } from "hooks";
import { useInfo } from "hooks/useApiHook";

// ----------------------------------------------------------------------

export function SidebarPanel() {
  const { setInfo, doctype, fields } = useTodoContext();
  const { cardSkin } = useThemeContext();
  const [isOpen, { open, close }] = useDisclosure();
  const { data } = useInfo({ doctype, fields: JSON.stringify(fields) });


  useEffect(() => {
    if (data?.fields) {
      setInfo(data?.fields)
    }
  }, [data])


  return (
    <>
      <div
        className={clsx(
          "prime-panel flex flex-col",
          cardSkin === "shadow-sm"
            ? "shadow-soft dark:shadow-dark-900/60"
            : "dark:border-dark-600/80 ltr:border-r rtl:border-l",
        )}
      >
        <div
          className={clsx(
            "flex h-full grow flex-col bg-white ltr:pl-(--main-panel-width) rtl:pr-(--main-panel-width)",
            cardSkin === "shadow-sm" ? "dark:bg-dark-750" : "dark:bg-dark-900",
          )}
        >
          <Header />
          {/* Sidebar Content */}
          <ScrollShadow className="hide-scrollbar grow overflow-y-auto">
            <div className="px-4 pt-2">
              <Button
                onClick={open}
                variant="outlined"
                className="w-full gap-2 rounded-full"
              >
                <PlusIcon className="size-4" />
                <span>Add Task</span>
              </Button>
            </div>
            <Navigation />
            <div className="mx-4 my-4 h-px bg-gray-200 dark:bg-dark-500" />
            <Labels />
          </ScrollShadow>
        </div>
      </div>

      <NewTask isOpen={isOpen} close={close} />
    </>
  );
}
