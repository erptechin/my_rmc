// Import Dependencies
import { useEffect } from "react";
import clsx from "clsx";
import { ViewColumnsIcon } from "@heroicons/react/24/outline";

// Local Imports
import { useBoardContext } from "../../Board.context";
import { useThemeContext } from "app/contexts/theme/context";
import { Button, ScrollShadow } from "components/ui";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { Labels } from "./Labels";
import { useInfo } from "hooks/useApiHook";

// ----------------------------------------------------------------------

export function SidebarPanel() {
  const { setInfo, doctype, fields } = useBoardContext();
  const { cardSkin } = useThemeContext();
  const { data } = useInfo({ doctype, fields: JSON.stringify([...fields, ["notes"]]) });

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
                variant="outlined"
                className="w-full gap-2 rounded-full"
              >
                <ViewColumnsIcon className="size-4" />
                <span>Opportunity</span>
              </Button>
            </div>
            <Navigation />
            <div className="mx-4 my-4 h-px bg-gray-200 dark:bg-dark-500" />
            <Labels />
          </ScrollShadow>
        </div>
      </div>
    </>
  );
}
