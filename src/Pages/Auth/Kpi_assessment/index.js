import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Modal, Button, Form } from "react-bootstrap";
import { useAuthUser } from "react-auth-kit";
import Select from "react-select";
import DataTable from "react-data-table-component";

function EmployeePage() {
  const [kpiData, setKpiData] = useState([]);
  const [kpiTeamData, setKpiTeamData] = useState([]);
  const [kpiTeamMemberData, setKpiTeamMemberData] = useState([]);
  const [newPeriod, setNewPeriod] = useState("");
  const [showMemberKpiModal, setShowMemberKpiModal] = useState(false);
  const [showDetailKpiModal, setShowDetailKpiModal] = useState(false);
  const [showAddKpiModal, setShowAddKpiModal] = useState(false);
  const full = true;
  const [selectedRubric, setSelectedRubric] = useState(null);

  let i = 1;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "UTC",
    };
    return date.toLocaleDateString("en-US", options);
  };
  const fetchKpiData = async () => {
    try {
      // const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/kpi/open`,
        config
      );
      setKpiData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchKpiTeamData = async (userId, duedateId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/kpi/open/${userId}/${duedateId}/list`,
        config
      );
      setKpiTeamData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchKpiAssessmentForm = async (userId, duedateId, category) => {
    try {
      // const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.get(
        `http://localhost:3000/kpi/open/${userId}/${duedateId}/${category}/form`,
        config
      );
      setKpiTeamMemberData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchKpiData();
  }, []);

  const handleMemberKpiClick = (row) => {
    fetchKpiAssessmentForm(
      row.user_id,
      row.assessment_due_date_uuid,
      row.category
    );
    setShowMemberKpiModal(true);
  };

  const handleDetailKpiClick = (row) => {
    setSelectedRubric(row);
    fetchKpiTeamData(row.user_id, row.assessment_due_date_uuid);
    setShowDetailKpiModal(true);
  };

  const handleAddKpiClick = (row) => {
    setSelectedRubric(row);
    setShowAddKpiModal(true);
  };

  const handleNewPeriodChange = (event) => {
    setNewPeriod(event.target.value);
  };

  const handleSubmitKpi = async (event) => {
    event.preventDefault();
    try {
      // const orgId = "71152531-e247-467f-8839-b78c14d7f71e";
      const config = {
        headers: {
          Authorization: `Bearer ${Cookies.get("_auth")}`,
        },
      };
      const response = await axios.post(
        `http://localhost:3000/kpi/period`,
        {
          kpi_duedate: newPeriod,
        },
        config
      );
      setShowAddKpiModal(false);
      setNewPeriod("");
      // fetchAllRubric();
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      name: "Team Member Name",
      selector: "user_name",
      sortable: true,
    },
    {
      name: "Team Name",
      selector: "team_name",
      sortable: true,
    },
    {
      name: "Assessment Progress",
      selector: "team_members_count",
      sortable: true,
      cell: (row) => (
        <>
          <div>{`${row.num_rubrics} Rubric / ${row.num_assessments_with_score} Assess`}</div>
        </>
      ),
    },
    {
      name: "Assessment Due Date",
      selector: "assessment_period_due_date",
      sortable: true,
      cell: (row) => (
        <>
          <div>{formatDate(row.assessment_due_date)}</div>
        </>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {row.status_approval !== "approve" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleDetailKpiClick(row)}
            >
              Detail
            </Button>
          )}
        </>
      ),
      button: true,
      width: "100px",
      style: {
        width: "20%",
        minWidth: "100px",
        textAlign: "center",
      },
    },
  ];

  const columnsDetail = [
    {
      name: "Assessment Category",
      selector: "category",
      sortable: true,
    },
    {
      name: "Assessment Progress",
      selector: "num_assessments_with_score",
      sortable: true,
      cell: (row) => (
        <>
          <div>{`${row.num_assessments_with_score} / ${row.num_rubrics} Assess`}</div>
        </>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {row.status_approval !== "approve" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleMemberKpiClick(row)}
            >
              Detail
            </Button>
          )}
        </>
      ),
      button: true,
      width: "100px",
      style: {
        width: "20%",
        minWidth: "100px",
        textAlign: "center",
      },
    },
  ];

  const columnsAssessment = [
    {
      name: "No.",
      selector: "id",
      sortable: true,
      subHeader: <span rowSpan={2}>No.</span>,
    },
    {
      name: "Key Responsibilities",
      selector: "keyResponsibilities",
      sortable: true,
      subHeader: <span rowSpan={2}>Key Responsibilities</span>,
    },
    {
      name: "Key Performance Indicator(KPI)",
      selector: "kpi",
      sortable: true,
    },
    {
      name: "Weight %",
      selector: "weight",
      sortable: true,
    },
    {
      name: "Tracking Source",
      selector: "trackingSource",
      sortable: true,
    },
    {
      name: "Work Order",
      selector: "workOrder",
      sortable: true,
    },
    {
      name: "Measurement",
      selector: "measurement",
      sortable: true,
    },
    {
      name: "Assessment",
      selector: "assessment",
      sortable: true,
    },
    {
      name: "Score",
      selector: "score",
      sortable: true,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        border: "1px dotted black",
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
    cells: {
      style: {
        border: "1px dotted black",
      },
    },
  };
  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">KPI Assessment</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">KPI Assessment</li>
              </ol>
            </div>
            {/* /.col */}
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </div>
      {/* /.content-header */}
      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <DataTable
                    columns={columns}
                    data={kpiData}
                    noHeader
                    pagination
                    customStyles={customStyles}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Modal
        size="xl"
        show={showDetailKpiModal}
        onHide={() => setShowDetailKpiModal(false)}
      >
        <Modal.Header>
          <Modal.Title>KPI Assessment</Modal.Title>
          <Button variant="text" onClick={() => setShowDetailKpiModal(false)}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <DataTable
            columns={columnsDetail}
            data={kpiTeamData}
            noHeader
            pagination
            customStyles={customStyles}
          />
        </Modal.Body>
      </Modal>

      <Modal
        size="xl"
        fullscreen={full}
        show={showMemberKpiModal}
        onHide={() => setShowMemberKpiModal(false)}
      >
        <Modal.Header>
          <Modal.Title>
            {" "}
            {selectedRubric?.name && (
              <span>{selectedRubric.name} Assessment Progress</span>
            )}
          </Modal.Title>
          <Button variant="text" onClick={() => setShowMemberKpiModal(false)}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <table border={"1"} cellPadding={"5"} width={"100%"}>
            <thead>
              <tr>
                <th rowSpan={"2"} style={{ textAlign: "center" }}>
                  No.
                </th>
                <th rowSpan={"2"} style={{ textAlign: "center" }}>
                  Key Responsibilities
                </th>
                <th colSpan={"2"} style={{ textAlign: "center" }}>
                  Key Performance Indicator(KPI)
                </th>
                <th rowSpan={"2"} style={{ textAlign: "center" }}>
                  Weight %
                </th>
                <th rowSpan={"2"} style={{ textAlign: "center" }}>
                  Tracking Source
                </th>
                <th colSpan={"2"} style={{ textAlign: "center" }}>
                  Assessment
                </th>
              </tr>
              <tr>
                <th style={{ textAlign: "center" }}>Work Order</th>
                <th style={{ textAlign: "center" }} width={"300px"}>
                  Measurement
                </th>
                <th style={{ textAlign: "center" }}>
                  A Brief Description of Work Results
                </th>
                <th style={{ textAlign: "center" }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {kpiTeamMemberData.map((data) => (
                <tr>
                  <td style={{ textAlign: "center" }}>{i++}</td>
                  <td>{data.performance_metric}</td>
                  <td>{data.description}</td>
                  <td>{data.criteria}</td>
                  <td>{data.weight}</td>
                  <td>{data.data_source}</td>
                  <td>{data.uraian_kinerja}</td>
                  <td>{data.score ? data.score : "Test nilai"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default EmployeePage;