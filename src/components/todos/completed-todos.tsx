import { CircleCheckBig } from "lucide-react";
import React from "react";

interface CompletedTodosProps {
  totalTodos: number;
}

export default function CompletedTodos({ totalTodos }: CompletedTodosProps) {
  return (
    <div className="flex items-center gap-1 border-b-2 p-2 border-gray-100  text-sm text-foreground/80">
      <>
        <CircleCheckBig />
        <span>+ {totalTodos}</span>
        <span className="capitalize">completed tasks</span>
      </>
    </div>
  );
}