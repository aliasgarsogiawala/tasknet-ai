'use client';
import { Hash, Menu, PlusIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GET_STARTED_PROJECT_ID, primaryNavItems } from "@/utils";
import Image from "next/image";
import SearchForm from "./search-form";
import UserProfile from "./user-profile";

import todoist from "@/public/logo/todoist.png";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Doc } from "../../../convex/_generated/dataModel";
import AddProjectDialog from "../projects/add-project-dialog";
import { Dialog, DialogTrigger } from "../ui/dialog";
import ManageLabelsDialog from "../labels/manage-labels-dialog";
import AddLabelDialog from "../labels/add-label-dialog";

export default function MobileNav({
  navTitle = "",
  navLink = "#",
}: {
  navTitle?: string;
  navLink?: string;
}) {
  const projectList = useQuery(api.projects.getProjects);

  const renderProjectItems = (projects: Array<Doc<"projects">>) => {
    return projects.map(({ _id, name }, idx) => (
      <Link
        key={_id.toString()}
        href={`/loggedin/projects/${_id.toString()}`}
        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground"
      >
        <Hash className="w-4 h-4" />
        {name}
      </Link>
    ));
  };

  const hasGetStarted = (projectList || []).some(
    (p) => p._id.toString() === GET_STARTED_PROJECT_ID
  );

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <UserProfile />

            {primaryNavItems.map(({ name, icon, link, id }, idx) => (
              id === "filters" ? (
                <div key={`${name}-${idx}`} className="flex items-center justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="flex-1 text-left mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground">
                        {icon}
                        {name}
                      </button>
                    </DialogTrigger>
                    <ManageLabelsDialog />
                  </Dialog>
                  <Dialog>
                    <DialogTrigger id="mobileAddLabelTrigger">
                      <PlusIcon className="h-5 w-5" aria-label="Add a Label" />
                    </DialogTrigger>
                    <AddLabelDialog />
                  </Dialog>
                </div>
              ) : (
                <Link
                  key={`${name}-${idx}`}
                  href={link}
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground"
                >
                  {icon}
                  {name}
                </Link>
              )
            ))}

            <div className="flex items-center mt-6 mb-2">
              <p className="flex flex-1 text-base">My Projects</p>
              <AddProjectDialog />
            </div>

            {/* Dynamic project list (system + user) */}
            {projectList && renderProjectItems(projectList)}

            {/* Ensure Get Started project is present for mobile users */}
            {!hasGetStarted && (
              <Link
                href={`/loggedin/projects/${GET_STARTED_PROJECT_ID}`}
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground"
              >
                <Hash className="w-4 h-4" />
                Get Started
              </Link>
            )}
          </nav>
          <div className="mt-auto">
            <Card>
              <CardHeader>
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                  Unlock all features and get unlimited access to our support
                  team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm" className="w-full">
                  Upgrade
                </Button>
              </CardContent>
            </Card>
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex items-center md:justify-between w-full gap-1 md:gap-2 py-2">
        <div className="lg:flex-1">
          <Link href={navLink}>
            <p className="text-sm font-semibold text-foreground/70 w-24">
              {navTitle}
            </p>
          </Link>
        </div>
        <div className="place-content-center w-full flex-1">
          <SearchForm />
        </div>
        <div className="place-content-center w-12 h-12 lg:w-16 lg:h-20">
          <Image alt="logo" src={todoist} />
        </div>
      </div>
    </header>
  );
}