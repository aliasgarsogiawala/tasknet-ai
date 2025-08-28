import { Id } from "./_generated/dataModel";
import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { handleUserId } from "./auth";
import { getEmbeddingsWithAI } from "./openai";
import { api } from "./_generated/api";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      return await ctx.db
        .query("subTodos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();
    }
    return [];
  },
});

export const getSubTodosByParentId = query({
  args: {
    parentId: v.id("todos"),
  },
  handler: async (ctx, { parentId }) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      return await ctx.db
        .query("subTodos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("parentId"), parentId))
        .collect();
    }
    return [];
  },
});

export const checkASubTodo = mutation({
  args: { taskId: v.id("subTodos") },
  handler: async (ctx, { taskId }) => {
    const newTaskId = await ctx.db.patch(taskId, { isCompleted: true });
    return newTaskId;
  },
});

export const unCheckASubTodo = mutation({
  args: { taskId: v.id("subTodos") },
  handler: async (ctx, { taskId }) => {
    const newTaskId = await ctx.db.patch(taskId, { isCompleted: false });
    return newTaskId;
  },
});

export const createASubTodo = mutation({
  args: {
    taskName: v.string(),
    description: v.optional(v.string()),
    priority: v.number(),
    dueDate: v.number(),
    projectId: v.id("projects"),
    labelId: v.id("labels"),
    parentId: v.id("todos"),
    embedding: v.optional(v.array(v.float64())),
  },
  handler: async (
    ctx,
    {
      taskName,
      description,
      priority,
      dueDate,
      projectId,
      labelId,
      parentId,
      embedding,
    }
  ) => {
    try {
      const userId = await handleUserId(ctx);
      if (userId) {
        const newTaskId = await ctx.db.insert("subTodos", {
          userId,
          parentId,
          taskName,
          description,
          priority,
          dueDate,
          projectId,
          labelId,
          isCompleted: false,
          embedding,
        });
        return newTaskId;
      }
      return null;
    } catch (err) {
      console.log("Error occurred during createASubTodo mutation", err);

      return null;
    }
  },
});

export const createSubTodoAndEmbeddings = action({
  args: {
    taskName: v.string(),
    description: v.optional(v.string()),
    priority: v.number(),
    dueDate: v.number(),
    projectId: v.id("projects"),
    labelId: v.id("labels"),
    parentId: v.id("todos"),
  },
  handler: async (
    ctx,
    { taskName, description, priority, dueDate, projectId, labelId, parentId }
  ) => {
    const embedding = await getEmbeddingsWithAI(taskName);
    await ctx.runMutation(api.subTodos.createASubTodo, {
      taskName,
      description,
      priority,
      dueDate,
      projectId,
      labelId,
      parentId,
      embedding,
    });
  },
});

export const completedSubTodos = query({
  args: {
    parentId: v.id("todos"),
  },
  handler: async (ctx, { parentId }) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      const todos = await ctx.db
        .query("subTodos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("parentId"), parentId))
        .filter((q) => q.eq(q.field("isCompleted"), true))
        .collect();

      return todos;
    }
    return [];
  },
});

export const inCompleteSubTodos = query({
  args: {
    parentId: v.id("todos"),
  },
  handler: async (ctx, { parentId }) => {
    const userId = await handleUserId(ctx);
    // if (userId) {
    const todos = await ctx.db
      .query("subTodos")
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("parentId"), parentId))
      .filter((q) => q.eq(q.field("isCompleted"), false))
      .collect();
    return todos;
    // }
    // return [];
  },
});

export const deleteASubTodo = mutation({
  args: {
    taskId: v.id("subTodos"),
  },
  handler: async (ctx, { taskId }) => {
    try {
      const userId = await handleUserId(ctx);
      if (userId) {
        const deletedTaskId = await ctx.db.delete(taskId);
        //query todos and map through them and delete

        return deletedTaskId;
      }

      return null;
    } catch (err) {
      console.log("Error occurred during deleteASubTodo mutation", err);

      return null;
    }
  },
});

export const getSubTodosByLabelId = query({
  args: {
    labelId: v.id("labels"),
  },
  handler: async (ctx, { labelId }) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      return await ctx.db
        .query("subTodos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("labelId"), labelId))
        .filter((q) => q.eq(q.field("isCompleted"), false))
        .collect();
    }
    return [];
  },
});

export const getCompletedSubTodosByLabelId = query({
  args: {
    labelId: v.id("labels"),
  },
  handler: async (ctx, { labelId }) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      return await ctx.db
        .query("subTodos")
        .filter((q) => q.eq(q.field("userId"), userId))
        .filter((q) => q.eq(q.field("labelId"), labelId))
        .filter((q) => q.eq(q.field("isCompleted"), true))
        .collect();
    }
    return [];
  },
});

export const updateSubTodo = mutation({
  args: {
    taskId: v.id("subTodos"),
    taskName: v.optional(v.string()),
    description: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    priority: v.optional(v.float64()),
    projectId: v.optional(v.id("projects")),
    labelId: v.optional(v.id("labels")),
  },
  handler: async (ctx, { taskId, taskName, description, dueDate, priority, projectId, labelId }) => {
    try {
      const userId = await handleUserId(ctx);
      if (!userId) return null;

      const subTodo = await ctx.db.get(taskId);
      if (!subTodo || subTodo.userId !== userId) return null;

      const updateData: any = {};
      if (taskName !== undefined) updateData.taskName = taskName;
      if (description !== undefined) updateData.description = description;
      if (dueDate !== undefined) updateData.dueDate = dueDate;
      if (priority !== undefined) updateData.priority = priority;
      if (projectId !== undefined) updateData.projectId = projectId;
      if (labelId !== undefined) updateData.labelId = labelId;

      await ctx.db.patch(taskId, updateData);
      return taskId;
    } catch (err) {
      console.log("Error occurred during updateSubTodo mutation", err);
      return null;
    }
  },
});