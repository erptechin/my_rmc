// Import Dependencies
import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import clsx from "clsx";
import { StarIcon as StarIconFilled } from "@heroicons/react/20/solid";
import {
  BellAlertIcon,
  StarIcon as StarIconOutline,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { createPortal } from "react-dom";

// Local Imports
import { Avatar, Box, Button, Card, Checkbox } from "components/ui";
import { useTodoContext } from "../Todo.context";
import { useLocaleContext } from "app/contexts/locale/context";
import { useDisclosure } from "hooks";
import { EditTask } from "../Modals/EditTask";
import { Highlight } from "components/shared/Highlight";
import { getTodoData, todoKey, isItemData } from "../utils";
import { DropIndicator } from "components/shared/DropIndicator";
import { getUserAgentBrowser } from "utils/dom/getUserAgentBrowser";
import { useUpdateData } from "hooks/useApiHook";

// ----------------------------------------------------------------------

const idleState = { type: "idle" };
const draggingState = { type: "dragging" };

const isSafari = getUserAgentBrowser() === "Safari";

const doctype = "Task"

export const labels = {
  'Low': {
    color: 'success',
  },
  'Medium': {
    color: 'warning',
  },
  'High': {
    color: 'error',
  },
  'Urgent': {
    color: 'info',
  }
}

export function TodoCard({ todo, index }) {
  const { locale } = useLocaleContext();
  const [isDone, setIsDone] = useState(todo.status === "Completed" ? true : false)
  const [isOpen, { open, close }] = useDisclosure();
  const { setIsImportant, searchQuery, registerTodo, instanceId } = useTodoContext();

  const { id, subject, exp_end_date, priority, color, assignedTo, isImportant } = todo;

  const [draggableState, setDraggableState] = useState(idleState);

  const [closestEdge, setClosestEdge] = useState(null);

  const cardRef = useRef(null);


  const mutationUpd = useUpdateData((data) => {
    if (data) {
      setIsDone(data.status === "Completed" ? true : false)
    }
  });

  useEffect(() => {
    const element = cardRef.current;
    const dragHandle = cardRef.current; // May You want to add handler buttom later
    invariant(element); // Ensure the card element exists
    invariant(dragHandle);

    const data = getTodoData({ todo, index, instanceId });

    return combine(
      registerTodo({ itemId: data.todo.id, element }),
      draggable({
        element,
        dragHandle,
        getInitialData: () => data,
        onGenerateDragPreview({ nativeSetDragImage }) {
          if (!isSafari) return;

          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: "16px",
              y: "8px",
            }),
            render({ container }) {
              setDraggableState({ type: "preview-safari", container });
              return () => setDraggableState(draggingState);
            },
          });
        },
        onDragStart() {
          setDraggableState(draggingState);
        },
        onDrop() {
          setDraggableState(idleState);
        },
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          return (
            isItemData(source.data, todoKey) &&
            source.data.instanceId === instanceId
          );
        },
        getData({ input }) {
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ["top", "bottom"],
          });
        },
        onDrag({ self, source }) {
          const isSource = source.element === element;

          if (isSource) {
            setClosestEdge(null);
            return;
          }

          const closestEdge = extractClosestEdge(self.data);

          const sourceIndex = source.data.index;
          invariant(typeof sourceIndex === "number");

          const isItemBeforeSource = index === sourceIndex - 1;
          const isItemAfterSource = index === sourceIndex + 1;

          const isDropIndicatorHidden =
            (isItemBeforeSource && closestEdge === "bottom") ||
            (isItemAfterSource && closestEdge === "top");

          if (isDropIndicatorHidden) {
            setClosestEdge(null);
            return;
          }

          setClosestEdge(closestEdge);
        },
        onDragLeave() {
          setClosestEdge(null);
        },
        onDrop() {
          setClosestEdge(null);
        },
      }),
    );
  }, [index, instanceId, registerTodo, todo]);

  return (
    <>
      <div className={clsx(index !== 0 && "pt-4")} ref={cardRef}>
        <Card onClick={open}>
          <div
            className={clsx(
              "cursor-pointer rounded-lg px-4 py-3",
              draggableState.type === "dragging" && "bg-primary-500/15",
            )}
          >
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <Checkbox
                checked={isDone}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => mutationUpd.mutate({ doctype, body: { id, status: e.target.checked ? "Completed" : "Open" } })}
                className="rounded-full"
              />
              <h2
                className={clsx(
                  isDone && "line-through",
                  "cursor-pointer truncate font-medium text-gray-800 dark:text-dark-100",
                )}
              >
                <Highlight query={searchQuery?.subject}>{subject}</Highlight>
              </h2>
            </div>
            <div className="mt-1 flex items-end justify-between">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {exp_end_date && (
                  <>
                    <p>{dayjs(exp_end_date).locale(locale).format("DD MMM")}</p>
                    <div className="my-0.5 w-px self-stretch bg-gray-200 dark:bg-dark-500"></div>
                    <div className="flex items-center gap-1">
                      <BellAlertIcon className="size-3.5" />
                      <span>
                        {dayjs(exp_end_date).locale(locale).format("HH:mm")}
                      </span>
                    </div>
                  </>
                )}
                {priority &&
                  <Fragment>
                    {(exp_end_date) && (
                      <div className="my-0.5 w-px self-stretch bg-gray-200 dark:bg-dark-500" />
                    )}
                    <span
                      className={`inline-flex items-center gap-2 leading-none text-${labels[priority]?.color}`}
                    >
                      <span className="size-2 rounded-full bg-this dark:bg-this-lighter"></span>
                      <span className="text-this dark:text-this-lighter">
                        {priority}
                      </span>
                    </span>
                  </Fragment>
                }
              </div>
              <div className="flex items-center gap-1">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsImportant(id, !isImportant);
                  }}
                  isIcon
                  variant="flat"
                  className="size-6 rounded-full"
                >
                  {isImportant ? (
                    <StarIconFilled className="size-4 text-primary-600 dark:text-primary-400" />
                  ) : (
                    <StarIconOutline className="size-4" />
                  )}
                </Button>
                {assignedTo && assignedTo.length > 0 && (
                  <div className="flex -space-x-1 ">
                    {assignedTo.length > 3 ? (
                      <>
                        <Avatar
                          size={6}
                          src={assignedTo[0]?.avatar}
                          name={assignedTo[0]?.name}
                          initialColor="auto"
                          classNames={{
                            root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                            display:
                              "text-tiny-plus ring-1 ring-white dark:ring-dark-700",
                          }}
                        />

                        <Avatar
                          size={6}
                          src={assignedTo[1]?.avatar}
                          name={assignedTo[1]?.name}
                          classNames={{
                            root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                            display:
                              "text-tiny-plus ring-1 ring-white dark:ring-dark-700",
                          }}
                        />

                        <Avatar
                          size={6}
                          classNames={{
                            root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                            display:
                              "text-tiny-plus ring-1 ring-white dark:ring-dark-700",
                          }}
                          initialColor="primary"
                        >
                          +{assignedTo.length - 2}
                        </Avatar>
                      </>
                    ) : (
                      assignedTo.map((user) => (
                        <Avatar
                          key={user.uid}
                          size={6}
                          src={user.avatar}
                          name={user.name}
                          classNames={{
                            root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                            display:
                              "text-tiny-plus ring-1 ring-white dark:ring-dark-700",
                          }}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {closestEdge && <DropIndicator edge={closestEdge} gap="19px" />}
        </Card>
      </div>

      {draggableState.type === "preview-safari" &&
        createPortal(
          <Box className="h-5 max-w-sm rounded-sm bg-gray-200 px-1 py-0.5 text-black dark:bg-dark-800 dark:text-white">
            {todo.subject}
          </Box>,
          draggableState.container,
        )}

      <EditTask isOpen={isOpen} close={close} data={todo} />
    </>
  );
}

TodoCard.propTypes = {
  todo: PropTypes.object,
  index: PropTypes.number,
  position: PropTypes.string,
};
