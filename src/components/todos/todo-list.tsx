'use client';

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Checkbox } from "../ui/checkbox";

export default function TodoList() {
    const todos= useQuery(api.todos.get) ?? [];

    if(todos === undefined){
        <p>Loading..</p>
    }
  return <div className="xl:px-40" >
    <div className="text-lg font-semibold md:text-2xl">
        <h1 className="text-lg font-semibold md:text-2xl">
            Inbox
        </h1>
    </div>

    <div className="flex flex-col gap-1 py-4">
        <div className="flex items-center space-x-2">
            {todos.map(({taskName},idx)=>(
                <div key={idx}>
                    <Checkbox id="todo"/>
                    <label
                    htmlFor="todo"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed
                    peer-disabled:opacity-70"
                    >{taskName}</label>
                </div>
            ))}
        </div>
    </div>
  </div>
    
  
}
