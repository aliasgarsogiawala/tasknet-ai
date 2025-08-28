"use client";
import SideBar from "@/components/nav/side-bar";
import MobileNav from "@/components/nav/mobile-nav";
import { useParams } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import LabelTasksContainer from "../../../../components/containers/label-tasks";

export default function LabelPage() {
  const { labelId } = useParams<{ labelId: string }>();
  const label = useQuery(api.labels.getLabelByLabelId, { 
    labelId: labelId as Id<"labels"> 
  });

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SideBar />
      <div className="flex flex-col">
        <MobileNav 
          navTitle={label?.name ? `Label: ${label.name}` : "Label"} 
          navLink={`/loggedin/labels/${labelId}`} 
        />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <LabelTasksContainer labelId={labelId as Id<"labels">} />
        </main>
      </div>
    </div>
  );
}
