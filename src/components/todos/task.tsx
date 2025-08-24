import clsx from "clsx";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { ChangeEvent } from "react";
import AddTaskDialog from "../add-tasks/add-task-dialog";

export default function Task({
  data,
  isCompleted,
  handleOnChange,
}: {
  data: Doc<"todos"> | Doc<"subTodos">;
  isCompleted: boolean;
  handleOnChange: any;
}) {
  const { taskName } = data;
  return (
    <div
      key={data._id}
      className="flex items-center space-x-2 border-b-2 p-2 border-gray-100 animate-in fade-in"
    >
      <Dialog>
        <div className="flex gap-2 items-center justify-end w-full">
          <div className="flex gap-2 w-full">
            <Checkbox
              id="todo"
              className={clsx(
                "w-5 h-5 rounded-xl",
                isCompleted &&
                  "data-[state=checked]:bg-gray-300 border-gray-300"
              )}
              checked={isCompleted}
              onCheckedChange={handleOnChange}
            />
            <DialogTrigger asChild>
              <div className="flex flex-col items-start">
                <button
                  className={clsx(
                    "text-sm font-normal text-left",
                    isCompleted && "line-through text-foreground/30"
                  )}
                >
                  {taskName}
                </button>
                <div></div>
              </div>
            </DialogTrigger>
          </div>
          {!data?.parentId && <AddTaskDialog data={data} />}
        </div>
      </Dialog>
    </div>
  );
}