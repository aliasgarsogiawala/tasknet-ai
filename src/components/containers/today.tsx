"use client";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { AddTaskWrapper } from "../add-tasks/add-task-button";
import Todos from "../todos/todos";
import CompletedTodos from "../todos/completed-todos";
import { Dot } from "lucide-react";
import moment from "moment";

export default function Today() {
  const todayTodos = useQuery(api.todos.todayTodos) ?? [];
  const completedTodayTodos = useQuery(api.todos.completedTodayTodos) ?? [];
  const overdueTodos = useQuery(api.todos.overdueTodos) ?? [];

  const allTodayTodos = [...todayTodos, ...completedTodayTodos].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    return a._creationTime - b._creationTime;
  });

  if (todayTodos === undefined || completedTodayTodos === undefined) {
    return <p>Loading...</p>;
  }
  return (
    <div className="xl:px-40">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Today</h1>
      </div>
      <div className="flex flex-col gap-1 py-4">
        <p className="font-bold flex text-sm">Overdue</p>
        {overdueTodos.length > 0 ? (
          <Todos showDetails={true} items={overdueTodos} />
        ) : (
          <div className="text-gray-500 text-sm py-2">No overdue tasks</div>
        )}
      </div>
      <AddTaskWrapper />
      <div className="flex flex-col gap-1 py-4">
        <p className="font-bold flex text-sm items-center border-b-2 p-2 border-gray-100">
          {moment(new Date()).format("LL")}
          <Dot />
          Today
          <Dot />
          {moment(new Date()).format("dddd")}
        </p>
        <Todos items={allTodayTodos} />
        {completedTodayTodos.length > 0 && (
          <CompletedTodos totalTodos={completedTodayTodos.length} />
        )}
        <AddTaskWrapper />
      </div>
    </div>
  );
}