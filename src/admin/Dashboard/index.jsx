import { useState, useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";
import {
  taskData,
  timeData,
  projectTaskData,
  personnelData,
  bugData,
  supportTicketData,
} from "./data";

import TaskProgressChart from "./TaskProgressChart";
import TimeProgressChart from "./TimeProgressChart";
import ProjectTasksChart from "./ProjectTasksChart";
import PersonnelChart from "./PersonnelChart";
import BugsChart from "./BugsChart";
import SupportTicketsChart from "./SupportTicketsChart";

import "./style.scss";

export const Dashboard = () => {
  const [viewModes, setViewModes] = useState({
    taskProgress: "chart",
    timeProgress: "chart",
    projectTasks: "chart",
    personnel: "chart",
    bugs: "chart",
    supportTickets: "chart",
  });

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const allProjects = [
    ...new Set([
      ...taskData.map((item) => item.name),
      ...timeData.map((item) => item.name),
      ...projectTaskData.map((item) => item.name),
      ...personnelData.map((item) => item.name),
      ...bugData.map((item) => item.name),
      ...supportTicketData.map((item) => item.name),
    ]),
  ];

  const [selectedProjects, setSelectedProjects] = useState([]);
  const [filteredData, setFilteredData] = useState({
    taskData: taskData,
    timeData: timeData,
    projectTaskData: projectTaskData,
    personnelData: personnelData,
    bugData: bugData,
    supportTicketData: supportTicketData,
  });

  useEffect(() => {
    if (selectedProjects.length === 0) {
      setFilteredData({
        taskData: taskData,
        timeData: timeData,
        projectTaskData: projectTaskData,
        personnelData: personnelData,
        bugData: bugData,
        supportTicketData: supportTicketData,
      });
    } else {
      setFilteredData({
        taskData: taskData.filter((item) =>
          selectedProjects.includes(item.name)
        ),
        timeData: timeData.filter((item) =>
          selectedProjects.includes(item.name)
        ),
        projectTaskData: projectTaskData.filter((item) =>
          selectedProjects.includes(item.name)
        ),
        personnelData: personnelData.filter((item) =>
          selectedProjects.includes(item.name)
        ),
        bugData: bugData.filter((item) => selectedProjects.includes(item.name)),
        supportTicketData: supportTicketData.filter((item) =>
          selectedProjects.includes(item.name)
        ),
      });
    }
  }, [selectedProjects]);

  const toggleView = (section) => {
    setViewModes((prevModes) => ({
      ...prevModes,
      [section]: prevModes[section] === "chart" ? "table" : "chart",
    }));
  };

  const projectFilterTemplate = () => {
    return (
      <div className="project-filter">
        <MultiSelect
          value={selectedProjects}
          options={allProjects}
          onChange={(e) => setSelectedProjects(e.value)}
          placeholder="Tất cả dự án"
          display="chip"
          className="w-full"
          panelClassName="project-dropdown-panel"
          showSelectAll
          selectAll={true}
          selectAllLabel="Tất cả dự án"
        />
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <div className="tag success">
          <div className="tag-content">
            <div className="number_tag">{taskData.length}</div>
            <div className="number_tag">Dự án</div>
          </div>
        </div>
        <div className="tag warning">
          <div className="tag-content">
            <div className="number_tag">{timeData.length}</div>
            <div className="number_tag">Dự án chậm tiến độ</div>
          </div>
        </div>
        <div className="title">{projectFilterTemplate()}</div>
      </div>

      <div className="chart-section">
        <TaskProgressChart
          data={filteredData.taskData}
          viewMode={viewModes.taskProgress}
          toggleView={() => toggleView("taskProgress")}
          windowWidth={windowWidth}
        />

        <TimeProgressChart
          data={filteredData.timeData}
          viewMode={viewModes.timeProgress}
          toggleView={() => toggleView("timeProgress")}
          windowWidth={windowWidth}
        />
      </div>

      <div className="bottom-chart">
        <ProjectTasksChart
          data={filteredData.projectTaskData}
          viewMode={viewModes.projectTasks}
          toggleView={() => toggleView("projectTasks")}
          windowWidth={windowWidth}
        />
      </div>

      <div className="bottom-chart">
        <PersonnelChart
          data={filteredData.personnelData}
          viewMode={viewModes.personnel}
          toggleView={() => toggleView("personnel")}
          windowWidth={windowWidth}
        />
      </div>

      <div className="bottom-chart">
        <BugsChart
          data={filteredData.bugData}
          viewMode={viewModes.bugs}
          toggleView={() => toggleView("bugs")}
          windowWidth={windowWidth}
        />
      </div>

      <div className="bottom-chart">
        <SupportTicketsChart
          data={filteredData.supportTicketData}
          viewMode={viewModes.supportTickets}
          toggleView={() => toggleView("supportTickets")}
          windowWidth={windowWidth}
        />
      </div>
    </div>
  );
};

export default Dashboard;
