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

// eslint-disable-next-line react/prop-types
const SupportTicketsChart = ({ data, viewMode, toggleView }) => {
  const renderTable = (data) => {
    return (
      <div className="table-container">
        <DataTable value={data} showGridlines stripedRows>
          <Column field="name" header="Project Name"></Column>
          <Column field="New" header="New"></Column>
          <Column field="Resolved" header="Resolved"></Column>
          <Column field="Close" header="Close"></Column>
        </DataTable>
      </div>
    );
  };

  return (
    <>
      <div className="chart-header">
        <h4>Theo dõi phiếu hỗ trợ dự án</h4>
        <i
          className="pi pi-refresh"
          style={{ fontSize: "2rem", cursor: "pointer" }}
          onClick={toggleView}
        ></i>
      </div>

      {viewMode === "chart" ? (
        <BarChart
          width={window.innerWidth * 0.82}
          height={400}
          data={data}
          margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis type="number" />
          <Tooltip />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Bar dataKey="New" stackId="a" fill="#BBDEFB" name="New" />
          <Bar dataKey="Resolved" stackId="a" fill="#64B5F6" name="Resolved" />
          <Bar dataKey="Close" stackId="a" fill="#0D47A1" name="Close" />
        </BarChart>
      ) : (
        renderTable(data)
      )}
    </>
  );
};

export default SupportTicketsChart;
