import React, { useRef } from 'react';
import {
  GanttComponent,
  Inject,
  Selection,
  DayMarkers,
  Resize,
  Sort,
  Edit,
  Toolbar
} from '@syncfusion/ej2-react-gantt';
import { Card } from "@/components/ui/card";
import { registerLicense } from '@syncfusion/ej2-base';

// Register Syncfusion license
registerLicense('Mgo+DSMBaFt+QHJqVk1hXk5Hd0BLVGpAblJ3T2ZQdVt5ZDU7a15RRnVfR1xjSXdTc0VnWHteeQ==;Mgo+DSMBPh8sVXJ1S0R+X1pFdEBBXHxAd1p/VWJYdVt5flBPcDwsT3RfQF5jS39Td0VmW3pfeXNVRw==;ORg4AjUWIQA/Gnt2VFhiQlJPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXtScURmWXtadHFdRWg=');

interface Task {
  id: string;
  title: string;
  completed: boolean;
  assignedTo?: string;
  startDate?: Date;
  endDate?: Date;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed";
  dueDate: Date;
  progress: number;
  tasks: Task[];
}

interface TimelineViewProps {
  goals: Goal[];
  onTaskUpdate?: (taskData: any) => void;
}

export function TimelineView({ goals, onTaskUpdate }: TimelineViewProps) {
  const ganttRef = useRef<GanttComponent>(null);

  const taskFields = {
    id: 'id',
    name: 'title',
    startDate: 'startDate',
    endDate: 'endDate',
    duration: 'duration',
    progress: 'progress',
    dependency: 'dependency',
    child: 'subtasks'
  };

  const timelineData = goals.length > 0 ? goals.map(goal => {
    const startDate = new Date();
    const endDate = goal.dueDate;

    return {
      id: goal.id,
      title: goal.title,
      startDate: startDate,
      endDate: endDate,
      progress: goal.progress,
      duration: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
      subtasks: goal.tasks.map(task => ({
        id: task.id,
        title: task.title,
        startDate: startDate,
        endDate: endDate,
        duration: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
        progress: task.completed ? 100 : 0,
      }))
    };
  }) : [{
    id: 'sample',
    title: 'No goals yet',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    progress: 0,
    duration: 7,
    subtasks: []
  }];

  const editSettings = {
    allowTaskbarEditing: true,
    allowEditing: true,
    allowDeleting: true
  };

  const toolbarOptions = ['Add', 'Edit', 'Delete', 'Search', 'ZoomIn', 'ZoomOut'];

  return (
    <Card className="p-4">
      <GanttComponent
        ref={ganttRef}
        dataSource={timelineData}
        taskFields={taskFields}
        height="600px"
        editSettings={editSettings}
        toolbar={toolbarOptions}
        allowSelection={true}
        allowResizing={true}
        allowSorting={true}
        highlightWeekends={true}
        timelineSettings={{
          timelineViewMode: 'Month',
          topTier: {
            unit: 'Week',
            format: 'MMM dd, yyyy'
          },
          bottomTier: {
            unit: 'Day',
            format: 'dd'
          }
        }}
        labelSettings={{
          leftLabel: 'title',
          rightLabel: 'progress'
        }}
        splitterSettings={{
          position: '35%'
        }}
        projectStartDate={new Date()}
        projectEndDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
        gridLines="Both"
        rowHeight={50}
      >
        <Inject services={[Selection, DayMarkers, Resize, Sort, Edit, Toolbar]} />
      </GanttComponent>
    </Card>
  );
}
