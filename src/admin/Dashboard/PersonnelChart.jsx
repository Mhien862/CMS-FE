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
const PersonnelChart = ({ data, viewMode, toggleView }) => {
  const renderTable = (data) => {
    return (
      <div className="table-container">
        <DataTable value={data} showGridlines stripedRows>
          <Column field="name" header="Project Name"></Column>
          <Column field="PM" header="PM"></Column>
          <Column field="BA" header="BA"></Column>
          <Column field="Dev" header="Dev"></Column>
          <Column field="Tester" header="Tester"></Column>
        </DataTable>
      </div>
    );
  };

  return (
    <>
      <div className="chart-header">
        <h4>Thống kê nhân sự của dự án</h4>
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
          <Bar dataKey="PM" stackId="a" fill="#BBDEFB" name="PM" />
          <Bar dataKey="BA" stackId="a" fill="#64B5F6" name="BA" />
          <Bar dataKey="Dev" stackId="a" fill="#1976D2" name="Dev" />
          <Bar dataKey="Tester" stackId="a" fill="#0D47A1" name="Tester" />
        </BarChart>
      ) : (
        renderTable(data)
      )}
    </>
  );
};

export default PersonnelChart;
