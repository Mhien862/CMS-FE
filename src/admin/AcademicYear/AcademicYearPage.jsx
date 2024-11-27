import { useState } from "react";
import { Tabs } from "antd";
import CreateAcademicYear from "./CreateAcademicYear";
import ManageSemesters from "./ManageSemesters";

const AcademicYearPage = () => {
  const [activeTab, setActiveTab] = useState("createYear");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Academic Year Management</h1>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <Tabs.TabPane tab="Create Academic Year" key="createYear">
          <CreateAcademicYear />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Manage Semesters" key="manageSemesters">
          <ManageSemesters />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default AcademicYearPage;
