import BackButtonComponent from "@/components/shared/BackButtonComponent/BackButtonComponent";
import DashboardHeader from "@/components/shared/DashboardHeader/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TaskProgressTracker } from "@/datasource/localstore.api";
import { TaskData, TaskDataIdentifier, TaskManagerStatus, TaskTrackerData } from "@/datasource/schema";
import { useEffect, useState } from "react";
import { v4 } from "uuid";
import bookmarkIcon from "../../../assets/share.png";
import "./ExportBookmarkPage.css";
import ExportErrorComponent from "./Components/ExportErrorComponent/ExportErrorComponent";
import ExportSuccessComponent from "./Components/ExportSuccessComponent/ExportSuccessComponent";
import ExportingComponent from "./Components/ExportingComponent/ExportingComponent";
import HeaderMobileDashboard from "@/components/shared/MobileHeaderDashboardComponent/MobileHeaderDashboardComponent";

export default function ExportBookmarkPage() {
  const taskUUID = v4();
  const [task, setTask] = useState<TaskTrackerData>();

  useEffect(() => {
    const subscription = TaskProgressTracker.getInstance()
      .listen(taskUUID)
      .subscribe((data) => {
        setTask(data);
      });

    return () => subscription.unsubscribe();
  }, []);

  // Start export
  const startExport = () => {
    const task = new TaskData(TaskDataIdentifier.EXPORT_BOOKMARK, {}, taskUUID);
    TaskProgressTracker.getInstance().setTask(task);
  }

  return (
    <>
      <DashboardHeader />
      <HeaderMobileDashboard />
      <section className="export-bookmark-page-style page-content">
        <BackButtonComponent />
        {task !== undefined && task.status === TaskManagerStatus.Error ? <ExportErrorComponent clicked={() => setTask(undefined)} /> : null}
        {task !== undefined && task.status === TaskManagerStatus.Success ? <ExportSuccessComponent clicked={() => setTask(undefined)} /> : null}
        {task !== undefined && task.status !== TaskManagerStatus.Success && task.status !== TaskManagerStatus.Error ? <ExportingComponent /> : null}

        {task === undefined ? (
          <Card className="export-bookmark-card">
            <div>
              <img src={bookmarkIcon} alt="" />
            </div>
            <div>Export Bookmark Now</div>
            <div>
              <Button onClick={startExport}>Start Export</Button>
            </div>
          </Card>
        ) : null}
      </section>
    </>
  );
}
