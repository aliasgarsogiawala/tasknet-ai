'use client';

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Checkbox } from "../ui/checkbox";
import Task from "./task";

export default function TodoList() {
    const todos= useQuery(api.todos.get) ?? [];

    if(todos === undefined){
        return <p>Loading..</p>
    }
  return <div className="xl:px-40" >
    <div className="text-lg font-semibold md:text-2xl">
        <h1 className="text-lg font-semibold md:text-2xl">
            Inbox
        </h1>
    </div>

    <div className="flex flex-col gap-1 py-4">
            {todos.map((task, idx)=>(
                <Task {...task} key={task._id} />
            ))}
        
    </div>
  </div>
    
  
}
