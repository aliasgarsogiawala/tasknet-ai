"use client";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import Todos from "../todos/todos";
import CompletedTodos from "../todos/completed-todos";
import { AddTaskWrapper } from "../add-tasks/add-task-button";

export default function LabelTasksContainer({ labelId }: { labelId: Id<"labels"> }) {
  const incompleteTodos = useQuery(api.todos.getTodosByLabelId, { labelId }) ?? [];
  const completedTodos = useQuery(api.todos.getCompletedTodosByLabelId, { labelId }) ?? [];
  const label = useQuery(api.labels.getLabelByLabelId, { labelId });

  // Combine incomplete and completed todos, sorting by completion status and creation time
  const allTodos = [...incompleteTodos, ...completedTodos].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    return a._creationTime - b._creationTime;
  });

  const isLoading = incompleteTodos === undefined || 
                   completedTodos === undefined;

  if (isLoading) {
    return (
      <div className="xl:px-40">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold md:text-2xl">
            Loading...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="xl:px-40">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">
          {label?.name || "Label"}
        </h1>
      </div>
      
      <AddTaskWrapper />

      <div className="flex flex-col gap-1 py-4">
        <Todos items={allTodos} />
        {completedTodos.length > 0 && (
          <CompletedTodos totalTodos={completedTodos.length} />
        )}
      </div>
    </div>
  );
}
