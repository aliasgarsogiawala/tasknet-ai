import { api } from "../../../convex/_generated/api";
import { useAction } from "convex/react";
import React, { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { Loader } from "lucide-react";
import { Button } from "../ui/button";

export default function SuggestMissingTasks({
  projectId,
}: {
  projectId: Id<"projects">;
}) {
  const [isLoadingSuggestMissingTasks, setIsLoadingSuggestMissingTasks] =
    useState(false);

  const suggestMissingTasks =
    useAction(api.openai.suggestMissingItemsWithAi) || [];

  const handleMissingTasks = async () => {
    setIsLoadingSuggestMissingTasks(true);
    try {
      await suggestMissingTasks({ projectId });
    } catch (error) {
      console.log("Error in suggestMissingTasks", error);
    } finally {
      setIsLoadingSuggestMissingTasks(false);
    }
  };

  return (
    <>
      <Button
        variant={"outline"}
        disabled={isLoadingSuggestMissingTasks}
        onClick={handleMissingTasks}
      >
        {isLoadingSuggestMissingTasks ? (
          <div className="flex gap-2">
            Loading Tasks (AI)
            <Loader className="h-5 w-5 text-primary" />
          </div>
        ) : (
          "Suggest Missing Tasks (AI) 🤖"
        )}
      </Button>
    </>
  );
}