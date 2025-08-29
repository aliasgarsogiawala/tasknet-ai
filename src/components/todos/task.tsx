import { Doc, Id } from "../../../convex/_generated/dataModel";
import clsx from "clsx";
import AddTaskDialog from "../add-tasks/add-task-dialog";
import EditTaskDialog from "../add-tasks/edit-task-dialog";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Calendar, GitBranch, Tag, Trash2, Edit3, Check, X } from "lucide-react";
import moment from "moment";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useToast } from "../ui/use-toast";
import { useState } from "react";

function isSubTodo(
  data: Doc<"todos"> | Doc<"subTodos">
): data is Doc<"subTodos"> {
  return "parentId" in data;
}

export default function Task({
  data,
  isCompleted,
  handleOnChange,
  showDetails = false,
}: {
  data: Doc<"todos"> | Doc<"subTodos">;
  isCompleted: boolean;
  handleOnChange: any;
  showDetails?: boolean;
}) {
  const { taskName, dueDate } = data;
  const deleteSubTodo = useMutation(api.subTodos.deleteASubTodo);
  const updateSubTodo = useMutation(api.subTodos.updateSubTodo);
  const { toast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(taskName);

  const handleDeleteSubtask = async () => {
    if (isSubTodo(data)) {
      await deleteSubTodo({ taskId: data._id as Id<"subTodos"> });
      toast({ title: "🗑️ Subtask deleted", duration: 2000 });
    }
  };

  const handleSaveTitle = async () => {
    if (isSubTodo(data) && editedTitle.trim() !== taskName) {
      try {
        await updateSubTodo({ 
          taskId: data._id as Id<"subTodos">, 
          taskName: editedTitle.trim() 
        });
        toast({ title: "✅ Subtask updated", duration: 2000 });
      } catch (error) {
        toast({ title: "❌ Failed to update subtask", duration: 2000 });
        setEditedTitle(taskName); 
      }
    }
    setIsEditingTitle(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(taskName);
    setIsEditingTitle(false);
  };

  const handleTitleClick = () => {
    if (isSubTodo(data)) {
      setIsEditingTitle(true);
    }
  };

  return (
    <div
      key={data._id}
      className="group flex items-center space-x-2 border-b-2 p-2 border-gray-100 animate-in fade-in"
    >
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
            <div className="flex flex-col items-start flex-1">
              {!isSubTodo(data) ? (
                <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                  <DialogTrigger asChild>
                    <button
                      className={clsx(
                        "text-sm font-normal text-left hover:text-primary transition-colors cursor-pointer",
                        isCompleted && "line-through text-foreground/30"
                      )}
                    >
                      {taskName}
                    </button>
                  </DialogTrigger>
                  <AddTaskDialog data={data} />
                </Dialog>
              ) : (
                <div className="flex items-center gap-2 w-full">
                  {isEditingTitle ? (
                    <>
                      <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveTitle();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        onBlur={handleSaveTitle}
                        autoFocus
                        className="text-sm h-6 px-1 py-0 border-primary"
                      />
                      <button
                        onClick={handleSaveTitle}
                        className="p-1 rounded hover:bg-muted"
                        aria-label="Save"
                      >
                        <Check className="w-3 h-3 text-green-600" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 rounded hover:bg-muted"
                        aria-label="Cancel"
                      >
                        <X className="w-3 h-3 text-red-600" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleTitleClick}
                      className={clsx(
                        "text-sm font-normal text-left hover:text-primary transition-colors cursor-pointer flex-1",
                        isCompleted && "line-through text-foreground/30"
                      )}
                    >
                      {taskName}
                    </button>
                  )}
                </div>
              )}
              {showDetails && (
                <div className="flex gap-2">
                  <div className="flex items-center justify-center gap-1">
                    <GitBranch className="w-3 h-3 text-foreground/70" />
                    <p className="text-xs text-foreground/70"></p>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="w-3 h-3 text-primary" />
                    <p className="text-xs text-primary">
                      {moment(dueDate).format("LL")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {!isSubTodo(data) && (
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <button
                    aria-label="Edit task"
                    className="p-1 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit3 className="w-4 h-4 text-foreground/60 hover:text-blue-600" />
                  </button>
                </DialogTrigger>
                <EditTaskDialog 
                  data={data} 
                  onClose={() => setIsEditOpen(false)} 
                />
              </Dialog>
            )}

            {isSubTodo(data) && (
              <button
                aria-label="Delete subtask"
                onClick={handleDeleteSubtask}
                className="p-1 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4 text-foreground/60 hover:text-red-600" />
              </button>
            )}
          </div>
        </div>
    </div>
  );
}