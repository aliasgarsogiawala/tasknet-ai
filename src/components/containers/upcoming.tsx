"use client";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Dot } from "lucide-react";
import moment from "moment";
import { AddTaskWrapper } from "../add-tasks/add-task-button";
import Todos from "../todos/todos";
import CompletedTodos from "../todos/completed-todos";

export default function Upcoming() {
  const groupTodosByDate = useQuery(api.todos.groupTodosByDate) ?? [];
  const groupCompletedTodosByDate = useQuery(api.todos.groupCompletedTodosByDate) ?? [];
  const overdueTodos = useQuery(api.todos.overdueTodos) ?? [];

  if (groupTodosByDate === undefined || overdueTodos === undefined) {
    <p>Loading...</p>;
  }

  const allDates = new Set([
    ...Object.keys(groupTodosByDate || {}),
    ...Object.keys(groupCompletedTodosByDate || {})
  ]);
  const sortedDates = Array.from(allDates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return (
    <div className="xl:px-40">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Upcoming</h1>
      </div>
      <div className="flex flex-col gap-1 py-4">
        <p className="font-bold flex text-sm">Overdue</p>
        {overdueTodos.length > 0 ? (
          <Todos showDetails={true} items={overdueTodos} />
        ) : (
          <div className="text-gray-500 text-sm py-2">No overdue tasks</div>
        )}
      </div>
      <div className="pb-6">
        <AddTaskWrapper />
      </div>
      <div className="flex flex-col gap-1 py-4">
        {sortedDates.map((dueDate) => {
          const incompleteTodos = groupTodosByDate[dueDate] || [];
          const completedTodos = groupCompletedTodosByDate[dueDate] || [];
          
          // Combine incomplete and completed tasks for this date
          const allTodos = [...incompleteTodos, ...completedTodos].sort((a, b) => {
            // Sort by completion status (incomplete first), then by creation time
            if (a.isCompleted !== b.isCompleted) {
              return a.isCompleted ? 1 : -1;
            }
            return a._creationTime - b._creationTime;
          });
          
          return (
            <div key={dueDate} className="mb-6">
              <p className="font-bold flex text-sm items-center">
                {moment(dueDate).format("LL")} <Dot />
                {moment(dueDate).format("dddd")}
              </p>
              <ul>
                <Todos items={allTodos} />
                {completedTodos.length > 0 && (
                  <CompletedTodos totalTodos={completedTodos.length} />
                )}
                <AddTaskWrapper />
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}