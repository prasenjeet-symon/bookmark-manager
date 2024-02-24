import BackButtonComponent from "@/components/shared/BackButtonComponent/BackButtonComponent";
import DashboardHeader from "@/components/shared/DashboardHeader/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TaskProgressTracker } from "@/datasource/localstore.api";
import { TaskData, TaskDataIdentifier, TaskManagerStatus, TaskTrackerData } from "@/datasource/schema";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import bookmarkIcon from "../../../assets/import.png";
import AddTagComponent from "./Components/AddTagComponent/AddTagComponent";
import ImportErrorComponent from "./Components/ImportErrorComponent/ImportErrorComponent";
import ImportSuccessComponent from "./Components/ImportSuccessComponent/ImportSuccessComponent";
import ImportingComponent from "./Components/ImportingComponent/ImportingComponent";
import "./ImportBookmarkPage.css";
import HeaderMobileDashboard from "@/components/shared/MobileHeaderDashboardComponent/MobileHeaderDashboardComponent";

export default function ImportBookmarkPage() {
  const taskUUID = v4();
  const [task, setTask] = useState<TaskTrackerData>();

  // Import now
  const importNow = (file: File, tags: string[]) => {
    const task = new TaskData(TaskDataIdentifier.IMPORT_BOOKMARK, { file: file, tags }, taskUUID);
    TaskProgressTracker.getInstance().setTask(task);
  };

  useEffect(() => {
    const subscription = TaskProgressTracker.getInstance()
      .listen(taskUUID)
      .subscribe((data) => {
        setTask(data);
      });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <DashboardHeader />
      <HeaderMobileDashboard />
      <section className="import-bookmark-page-style page-content">
        <BackButtonComponent />

        {task !== undefined && task.status === TaskManagerStatus.Error ? <ImportErrorComponent clicked={() => setTask(undefined)} /> : null}
        {task !== undefined && task.status === TaskManagerStatus.Success ? <ImportSuccessComponent clicked={() => setTask(undefined)} /> : null}
        {task !== undefined && task.status !== TaskManagerStatus.Success && task.status !== TaskManagerStatus.Error ? <ImportingComponent /> : null}

        {task === undefined ? (
          <Card className="import-bookmark-card">
            <div>
              <img src={bookmarkIcon} alt="" />
            </div>
            <div>Import Bookmark Now</div>
            <div>
              <AddTagComponent tagsInput={(file, tags) => importNow(file, tags)} />
            </div>
          </Card>
        ) : null}
      </section>
    </>
  );
}
