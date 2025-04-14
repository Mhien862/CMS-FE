import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
const ProjectTasksChart = ({ data, viewMode, toggleView }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [animation, setAnimation] = useState("");

  const handleToggleView = () => {
    if (isFlipping) return;

    setAnimation("flipOut");
    setIsFlipping(true);

    setTimeout(() => {
      toggleView();
      setAnimation("flipIn");
      setTimeout(() => {
        setAnimation("");
        setIsFlipping(false);
      }, 300);
    }, 300);
  };

  const renderTable = (data) => {
    return (
      <div className="table-container">
        <DataTable
          value={data}
          showGridlines
          stripedRows
          scrollable
          scrollHeight="500px"
        >
          <Column field="name" header="Project Name"></Column>
          <Column field="new" header="New"></Column>
          <Column field="assigned" header="Assigned"></Column>
          <Column field="inProgress" header="In Progress"></Column>
          <Column field="close" header="Close"></Column>
        </DataTable>
      </div>
    );
  };

  return (
    <div className="chart-wrapper">
      <div className="chart-header">
        <h4>Theo dõi task dự án</h4>
        <i
          className={`pi pi-refresh ${isFlipping ? "spinning" : ""}`}
          style={{ fontSize: "2rem", cursor: "pointer" }}
          onClick={handleToggleView}
        ></i>
      </div>

      <div className={`content-container ${animation}`}>
        {viewMode === "chart" ? (
          <div
            style={{ maxHeight: "500px", overflowX: "auto", overflowY: "auto" }}
          >
            <BarChart
              // eslint-disable-next-line react/prop-types
              width={Math.max(600, data.length * 100)}
              height={400}
              data={data}
              margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis type="number" />
              <Tooltip />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar dataKey="new" stackId="a" fill="#BBDEFB" name="New" />
              <Bar
                dataKey="assigned"
                stackId="a"
                fill="#64B5F6"
                name="Assigned"
              />
              <Bar
                dataKey="inProgress"
                stackId="a"
                fill="#1976D2"
                name="In Progress"
              />
              <Bar dataKey="close" stackId="a" fill="#0D47A1" name="Close" />
            </BarChart>
          </div>
        ) : (
          renderTable(data)
        )}
      </div>
    </div>
  );
};

export default ProjectTasksChart;
