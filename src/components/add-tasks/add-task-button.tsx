import { Plus } from 'lucide-react';
import React , { useState } from 'react'

export const AddTaskWrapper = () => {
    const [showAddTask , setShowAddTask] = useState(false);

    return showAddTask ? <>Inline add task</> : <AddTaskButton />;
}

export default function AddTaskButton(){
    return <button className="pl-2 flex mt2 flex-1" onClick={
        () => {}
    }>
        <div className="flex flex-col items-center justify-center gap-1 text-center">
            <div className="flex items-center gap-2 justify-center">
            <Plus className="h-8 w-8 text-primary hover:bg-primary hover:rounded-xl 
            hover:text-white " />
            <span className="text-base font-light tracking-tight text-foreground/70">
                Add Task
            </span>
            </div>
        </div>
    </button>;
}