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
const SupportTicketsChart = ({ data, viewMode, toggleView, windowWidth }) => {
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
          <Column field="New" header="New"></Column>
          <Column field="Resolved" header="Resolved"></Column>
          <Column field="Close" header="Close"></Column>
        </DataTable>
      </div>
    );
  };

  const chartWidth = windowWidth
    ? windowWidth <= 768
      ? windowWidth * 0.9
      : windowWidth * 0.82
    : window.innerWidth * 0.82;

  const chartHeight = windowWidth && windowWidth <= 480 ? 300 : 400;

  const minWidth = data.length * 100;
  const finalChartWidth = Math.max(minWidth, chartWidth);

  return (
    <>
      <div className="chart-header">
        <h4>Theo dõi phiếu hỗ trợ dự án</h4>
        <i
          className={`pi pi-refresh ${isFlipping ? "spinning" : ""}`}
          style={{ fontSize: "2rem", cursor: "pointer" }}
          onClick={handleToggleView}
        ></i>
      </div>

      <div className={`content-container ${animation}`}>
        {viewMode === "chart" ? (
          <div style={{ overflowX: "auto", overflowY: "auto" }}>
            <BarChart
              width={finalChartWidth}
              height={chartHeight}
              data={data}
              margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis type="number" />
              <Tooltip />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar dataKey="New" stackId="a" fill="#BBDEFB" name="New" />
              <Bar
                dataKey="Resolved"
                stackId="a"
                fill="#64B5F6"
                name="Resolved"
              />
              <Bar dataKey="Close" stackId="a" fill="#0D47A1" name="Close" />
            </BarChart>
          </div>
        ) : (
          renderTable(data)
        )}
      </div>
    </>
  );
};

export default SupportTicketsChart;
