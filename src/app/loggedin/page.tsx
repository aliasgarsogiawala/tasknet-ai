'use client';

import Tasks from "@/components/planify/tasks";


export default function Home() {
  return (
      <main className="flex flex-col items-center justify-between p-24">
        <h1>Tasknest</h1>

        <Tasks />
      </main>
      
     
  );
}
