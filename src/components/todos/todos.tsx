import React from "react";
import Task from "./task";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import { useToast } from "../ui/use-toast";

interface TodosProps {
  items: Doc<"todos">[];
}

export default function Todos({ items }: TodosProps) {
  const { toast } = useToast();

  const checkATodo = useMutation(api.todos.checkATodo);
  const unCheckATodo = useMutation(api.todos.unCheckATodo);

  const handleOnChangeTodo = (task: Doc<"todos">) => {
    if (task.isCompleted) {
      unCheckATodo({ taskId: task._id });
    } else {
      checkATodo({ taskId: task._id });
      toast({
        title: "✅ Task completed",
        description: "Nice work",
        duration: 3000,
      });
    }
  };
  return items.map((task: Doc<"todos">, idx) => (
    <Task
      key={task._id}
      data={task}
      isCompleted={task.isCompleted}
      handleOnChange={() => handleOnChangeTodo(task)}
    />
  ));
}