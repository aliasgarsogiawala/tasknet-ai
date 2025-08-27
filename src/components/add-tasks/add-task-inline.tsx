"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast, useToast } from "@/components/ui/use-toast";
import { CalendarIcon, Text } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { CardFooter } from "../ui/card";
import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import moment from "moment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { GET_STARTED_PROJECT_ID } from "@/utils";

const FormSchema = z.object({
  taskName: z.string().min(2, {
    message: "Task name must be at least 2 characters.",
  }),
  description: z.string(),
  dueDate: z.date({ message: "A due date is required" }),
  priority: z.string().min(1, { message: "Please select a priority" }),
  projectId: z.string().min(1, { message: "Please select a Project" }),
  labelId: z.string().min(1, { message: "Please select a Label" }),
});

type FormData = z.infer<typeof FormSchema>;

export default function AddTaskInline({
  setShowAddTask,
  parentTask,
  projectId: myProjectId,
}: {
  setShowAddTask: Dispatch<SetStateAction<boolean>>;
  parentTask?: Doc<"todos">;
  projectId?: Id<"projects">;
}) {
  const projectId =
    myProjectId ||
    parentTask?.projectId ||
    (GET_STARTED_PROJECT_ID as Id<"projects">);

  const labelId =
    parentTask?.labelId || ("k97c9ksh51jar1jh1c0k4azj4n7pavyy" as Id<"labels">);
  const priority = parentTask?.priority?.toString() || "1";
  const parentId = parentTask?._id;

  const { toast } = useToast();
  const projects = useQuery(api.projects.getProjects) ?? [];
  const labels = useQuery(api.labels.getLabels) ?? [];

  const createASubTodoEmbeddings = useAction(
    api.subTodos.createSubTodoAndEmbeddings
  );

  const createTodoEmbeddings = useAction(api.todos.createTodoAndEmbeddings);

  const defaultValues: FormData = {
    taskName: "",
    description: "",
    priority,
    dueDate: new Date(),
    projectId: projectId || GET_STARTED_PROJECT_ID,
    labelId: labelId || "",
  };

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  async function onSubmit(data: FormData) {
    const { taskName, description, priority, dueDate, projectId, labelId } =
      data;

    if (projectId) {
      if (parentId) {
        //subtodo
        const mutationId = createASubTodoEmbeddings({
          parentId,
          taskName,
          description,
          priority: parseInt(priority),
          dueDate: moment(dueDate).valueOf(),
          projectId: projectId as Id<"projects">,
          labelId: labelId as Id<"labels">,
        });

        if (mutationId !== undefined) {
          toast({
            title: "🛠️ Created a task!",
            duration: 3000,
          });
          form.reset({ ...defaultValues });
          setShowAddTask(false);
        }
      } else {
        const mutationId = createTodoEmbeddings({
          taskName,
          description,
          priority: parseInt(priority),
          dueDate: moment(dueDate).valueOf(),
          projectId: projectId as Id<"projects">,
          labelId: labelId as Id<"labels">,
        });

        if (mutationId !== undefined) {
          toast({
            title: "🛠️ Created a task!",
            duration: 3000,
          });
          form.reset({ ...defaultValues });
          setShowAddTask(false);
        }
      }
    }
  }
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 border-2 p-2 border-gray-200 my-2 rounded-xl px-3 pt-4 border-foreground/20"
        >
          <FormField
            control={form.control}
            name="taskName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    id="taskName"
                    type="text"
                    placeholder="Enter your Task name"
                    required
                    className="border-0 font-semibold text-lg"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    id="description"
                    placeholder="Description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
        <FormItem className="flex flex-col min-w-0">
      <FormLabel>Due date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
              "flex gap-2 w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
        <FormItem className="min-w-0">
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={priority}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4].map((item, idx) => (
                        <SelectItem key={idx} value={item.toString()}>
                          Priority {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="labelId"
              render={({ field }) => (
        <FormItem className="min-w-0">
                  <FormLabel>Label</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={labelId || field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Label" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {labels.map((label: Doc<"labels">, idx: number) => (
                        <SelectItem key={idx} value={label._id}>
                          {label?.name}
                        </SelectItem>
                      ))}
                      <div className="border-t my-1" />
                      <div className="px-2 py-1 text-xs text-muted-foreground">Can't find a label?</div>
                      <div className="px-2 pb-2">
                        <button
                          type="button"
                          className="text-primary text-sm underline"
                          onClick={() => document.getElementById("mobileAddLabelTrigger")?.click() || document.getElementById("closeDialog")?.click()}
                        >
                          + Create a new label
                        </button>
                      </div>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={projectId || field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projects.map((project: Doc<"projects">, idx: number) => (
                      <SelectItem key={idx} value={project._id}>
                        {project?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <CardFooter className="flex flex-col lg:flex-row lg:justify-between gap-2 border-t-2 pt-3">
            <div className="w-full lg:w-1/4"></div>
            <div className="flex gap-3 self-end">
              <Button
                className="bg-gray-300/40 text-gray-950 px-6 hover:bg-gray-300"
                variant={"outline"}
                onClick={() => setShowAddTask(false)}
              >
                Cancel
              </Button>
              <Button className="px-6" type="submit">
                Add task
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}