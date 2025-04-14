import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
const TaskProgressChart = ({ data, viewMode, toggleView }) => {
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
          <Column field="completed" header="Số task đã hoàn thiện"></Column>
          <Column field="totalTasks" header="Tổng số task"></Column>
        </DataTable>
      </div>
    );
  };

  return (
    <div className="chart-wrapper">
      <div className="chart-header">
        <h4>Theo dõi tiến độ dự án theo tasks</h4>
        <i
          className={`pi pi-refresh ${isFlipping ? "spinning" : ""}`}
          style={{ fontSize: "2rem", cursor: "pointer" }}
          onClick={handleToggleView}
        ></i>
      </div>

      <Button
        className="button_sort"
        label="Sắp xếp theo"
        severity="secondary"
        outlined
      />

      <div className={`content-container ${animation}`}>
        {viewMode === "chart" ? (
          <div className="chart-scroll-container">
            <BarChart
              layout="vertical"
              width={600}
              // eslint-disable-next-line react/prop-types
              height={data.length * 40}
              data={data}
              margin={{ top: 20, right: 30, left: 90, bottom: 5 }}
            >
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar
                dataKey="completed"
                stackId="a"
                fill="#42A5F5"
                name="Số task đã hoàn thiện"
              />
              <Bar
                dataKey="totalTasks"
                stackId="a"
                fill="#1976D2"
                name="Tổng số task"
              />
            </BarChart>
          </div>
        ) : (
          renderTable(data)
        )}
      </div>
    </div>
  );
};

export default TaskProgressChart;
