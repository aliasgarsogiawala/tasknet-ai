"use client";
import { useMemo, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Button } from "../ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Trash2, Loader } from "lucide-react";
import { useToast } from "../ui/use-toast";

export default function ManageLabelsDialog() {
  const labels = useQuery(api.labels.getLabels) ?? [];
  const deleteLabel = useMutation(api.labels.deleteLabel);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { toast } = useToast();

  const userLabels = useMemo(() => labels.filter(l => l.type === "user"), [labels]);
  const systemLabels = useMemo(() => labels.filter(l => l.type === "system"), [labels]);

  const onDelete = async (id: string) => {
    try {
      setBusyId(id);
      const res = await deleteLabel({ labelId: id as any });
      if (res) {
        toast({
          title: "Label deleted",
          description: "The label was removed successfully.",
        });
      }
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Filters & Labels</DialogTitle>
        <DialogDescription>Manage your labels. System labels are read-only.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-2">System Labels</h4>
          <ul className="space-y-2">
            {systemLabels.map(l => (
              <li key={l._id} className="flex items-center justify-between rounded-md border border-foreground/10 px-3 py-2">
                <span>{l.name}</span>
                <span className="text-xs text-muted-foreground">read-only</span>
              </li>
            ))}
            {systemLabels.length === 0 && (
              <p className="text-sm text-muted-foreground">None</p>
            )}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Your Labels</h4>
          <ul className="space-y-2">
            {userLabels.map(l => (
              <li key={l._id} className="flex items-center justify-between rounded-md border border-foreground/10 px-3 py-2">
                <span>{l.name}</span>
                <Button variant="ghost" size="icon" onClick={() => onDelete(l._id as any)} disabled={busyId === (l._id as any)}>
                  {busyId === (l._id as any) ? <Loader className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4"/>}
                </Button>
              </li>
            ))}
            {userLabels.length === 0 && (
              <p className="text-sm text-muted-foreground">No labels yet.</p>
            )}
          </ul>
        </div>
      </div>
    </DialogContent>
  );
}
