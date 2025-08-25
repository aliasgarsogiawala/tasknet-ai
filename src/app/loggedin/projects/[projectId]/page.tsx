"use client";
import { AddTaskWrapper } from "@/components/add-tasks/add-task-button";
import MobileNav from "@/components/nav/mobile-nav";
import SideBar from "@/components/nav/side-bar";
import CompletedTodos from "@/components/todos/completed-todos";
import Todos from "@/components/todos/todos";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import SuggestMissingTasks from "@/components/add-tasks/suggest-tasks";

export default function ProjectIdPage() {
  const { projectId } = useParams<{ projectId: Id<"projects"> }>();

  const inCompletedTodosByProject =
    useQuery(api.todos.getInCompleteTodosByProjectId, {
      projectId,
    }) ?? [];
  const completedTodosByProject =
    useQuery(api.todos.getCompletedTodosByProjectId, {
      projectId,
    }) ?? [];

  const project = useQuery(api.projects.getProjectByProjectId, {
    projectId,
  });
  const projectTodosTotal = useQuery(api.todos.getTodosTotalByProjectId, {
    projectId,
  });

  const projectName = project?.name || "";

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SideBar />
      <div className="flex flex-col">
        <MobileNav />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-2 lg:gap-0">
            <h1 className="text-lg font-semibold md:text-2xl">{projectName}</h1>
            <div className="flex gap-6 lg:gap-12 items-center">
            <SuggestMissingTasks projectId={projectId} />
          </div>
          </div>
          
          <Todos items={inCompletedTodosByProject} />

          <div className="pb-6">
            <AddTaskWrapper />
          </div>

          <Todos items={completedTodosByProject} />
          <div className="flex items-center space-x-4 gap-2 border-b-2 p-2 border-gray-100 text-sm text-foreground/80">
            <CompletedTodos totalTodos={projectTodosTotal} />
          </div>
        </main>
      </div>
    </div>
  );
}