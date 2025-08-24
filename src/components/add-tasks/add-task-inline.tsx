import React from "react";
import { Button } from "../ui/button";

interface AddTaskInlineProps {
  setShowAddTask: (show: boolean) => void;
}

export default function AddTaskInline({ setShowAddTask }: AddTaskInlineProps){
    return (
        <div>
            <div className="flex gap-3 self-end">
            <Button className="bg-gray-300/40 text-gray-950 px-6 hover:bg-gray-300"
             variant="outline" onClick={() => setShowAddTask(false)}>Cancel</Button>
            <Button className="px-6" type="submit">Add Task</Button>
            </div>
        </div>
    )
}