import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Tooltip, OverlayTrigger,  
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx"; // Import xlsx for exporting
import { useSearchExport } from "../../context/SearchExportContext";
import { ShowContext } from "../../context/ShowContext";
import NewResuableForm from "../../components/form/NewResuableForm";
import SearchInput from "../../components/search/SearchInput";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import instance from "../../api/AxiosInstance";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ThreeDots  } from 'react-loader-spinner'; 

import "../../App.scss";
const Office = () => {
  const { searchQuery, handleSearch, handleExport, setData, filteredData } =
  useSearchExport();

  const [team, setTeam] = useState([]);
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [eyeVisibilityById, setEyeVisibilityById] = useState({});
  const [showTable, setShowTable] = useState(true); // New state for toggling form and table view
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const CustomHeader = ({ name }) => (
    <div style={{ fontWeight: "bold", color: "black", fontSize: "16px" }}>
      {name}
    </div>
  );

  const tableColumns = (currentPage, rowsPerPage) => [
    {
      name: <CustomHeader name="Sr. No." />,
      selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
    },
    {
      name: <CustomHeader name="Name" />,
      cell: (row) => <span>{row.name}</span>,
    },
    {
      name: <CustomHeader name="Company_name" />,
      cell: (row) => <span>{row.company_name}</span>,
    },
    {
      name: <CustomHeader name="Phone" />,
      cell: (row) => <span>{row.phone}</span>,
    },
    {
      name: <CustomHeader name="Email" />,
      cell: (row) => <span>{row.email}</span>,
    },
    {
      name: <CustomHeader name="Message" />,
      cell: (row) => <span>{row.msg}</span>,
    },
    {
      name: <CustomHeader name="Date" />,
      cell: (row) => {
        const formattedDate = new Date(row.createdAt).toLocaleDateString();
        return <span className="d-flex justify-content-center">{formattedDate}</span>;
      },
    },
    {
      name: <CustomHeader name="Actions" />,
      cell: (row) => (
        <div className="d-flex">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="delete-tooltip">Delete</Tooltip>}
          >
            <Button
              className="ms-1"
              style={{ backgroundColor: "red", color: "white", borderColor: "red" }}
              onClick={() => handleDelete(row.id)}
            >
              <FaTrash />
            </Button>
          </OverlayTrigger>
          {/* <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="visibility-tooltip">{eyeVisibilityById[row.id] ? 'Hide' : 'Show'}</Tooltip>}
          >
            <Button
              className="ms-1"
              style={{
                backgroundColor: eyeVisibilityById[row.id] ? 'red' : 'green',
                borderColor: eyeVisibilityById[row.id] ? 'red' : 'green',
                color: 'white',
              }}
              onClick={() => handleIsActive(row.id, !eyeVisibilityById[row.id])}
            >
              {eyeVisibilityById[row.id] ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </OverlayTrigger> */}
        </div>
      ),
    },
  ];
  const exportToExcel = () => {
    const dataToExport = searchQuery.trim() ? filteredData : team;
    const worksheet = XLSX.utils.json_to_sheet(dataToExport); // Convert JSON data to worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Team Data"); // Append worksheet to workbook
    XLSX.writeFile(workbook, "Feedback.xlsx"); // Download as Excel file
  };

  useEffect(() => {
    fetchTeam();
    const storedVisibility = JSON.parse(localStorage.getItem('eyeVisibilityById')) || {};
    setEyeVisibilityById(storedVisibility);
  }, []);

  useEffect(() => {
    localStorage.setItem('eyeVisibilityById', JSON.stringify(eyeVisibilityById));
  }, [eyeVisibilityById]);

  const fetchTeam = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await instance.get("feedback/find", {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      });
      const reversedData = response.data.responseData.reverse();
      setTeam(reversedData);
      setData(reversedData);
    } catch (error) {
      console.error("Error fetching team:", error.response || error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (formData) => {
    let errors = {};
    let isValid = true;

    if (!formData.name?.trim()) {
      errors.name = "name is required";
    }

    if (!formData.company_name?.trim()) {
      errors.company_name = "company_name is required";
    }

    setErrors(errors);
    return isValid;
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm(formData)) {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      try {
        if (editMode) {
          await instance.put(`feedback/update/${editingId}`, data, {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          });
          toast.success("Data Updated Successfully");
          const updatedTeam = team.map((member) =>
            member.id === editingId ? formData : member
          );
          setTeam(updatedTeam);
        } else {
          await instance.post("feedback/add", data, {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          });
          toast.success("Data Submitted Successfully");
        }
        fetchTeam();

        setEditMode(false);
        setFormData({});
        setShowTable(true);
      } catch (error) {
        console.error("Error handling form submission:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id) => {
    confirmAlert({
      name: "Confirm to delete",
      message: "Are you sure you want to delete this data?",
      customUI: ({ onClose }) => (
        <div style={{ padding: "20px", backgroundColor: "white", borderRadius: "8px", maxWidth: "400px", margin: "0 auto" }}>
          <h2>Confirm to delete</h2>
          <p>Are you sure you want to delete this data?</p>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
            <button  style={{ marginRight: "10px" }}
                className="btn btn-primary" onClick={async () => {
              setLoading(true);
              const accessToken = localStorage.getItem("accessToken");
              try {
                await instance.delete(`feedback/isdelete/${id}`, {
                  headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
                });
                toast.success("Data Deleted Successfully");
                fetchTeam();
              } catch (error) {
                console.error("Error deleting data:", error);
                toast.error("Error deleting data");
              } finally {
                setLoading(false);
              }
              onClose();
            }}>
              Yes
            </button>
            <button className="btn btn-secondary" onClick={() => onClose()}>
              No
            </button>
          </div>
        </div>
      ),
    });
  };

  const handleIsActive = async (id, isVisible) => {
    confirmAlert({
      name: "Confirm to change visibility",
      customUI: ({ onClose }) => (
        <div style={{ padding: "20px", backgroundColor: "white", borderRadius: "8px", maxWidth: "400px", margin: "0 auto" }}>
          <h2>Confirm to change visibility</h2>
          <p>Are you sure you want to {isVisible ? "hide" : "show"} this data?</p>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
            <button className="btn btn-primary" onClick={async () => {
              setLoading(true);
              const accessToken = localStorage.getItem("accessToken");
              try {
                await instance.put(
                  `feedback/isactive/${id}`,
                  { isVisible },
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                      "Content-Type": "application/json",
                    },
                  }
                );
                setEyeVisibilityById((prev) => ({ ...prev, [id]: isVisible }));
                fetchTeam();
              } catch (error) {
                console.error("Error changing visibility:", error);
              } finally {
                setLoading(false);
              }
              onClose();
            }}>
              Yes
            </button>
            <button className="btn btn-secondary" onClick={() => onClose()}>
              No
            </button>
          </div>
        </div>
      ),
    });
  };

  const filteredTeams = searchQuery
    ? team.filter((member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : team;

  const paginatedTeams = filteredTeams.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Container>
        <Row>
      <Col className="d-flex justify-content-end align-items-center">
        <Button 
                    variant="outline-success"
                    onClick={exportToExcel} // Trigger Excel export
                    className="ms-2 mb-3"
                  >
                    Export to Excel
                  </Button>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card>
            {/* <Card.Header>
              <h5>Manage Office Team</h5>
              <Button
                className="btn btn-primary"
                onClick={() => setShowTable(!showTable)}
              >
                {showTable ? "Add New" : "Show Table"}
              </Button>
            </Card.Header> */}
            <Card.Body>
              {!showTable ? (
                <NewResuableForm
                  formData={formData}
                  setFormData={setFormData}
                  handleSubmit={handleSubmit}
                  handleChange={handleChange}
                  errors={errors}
                  editMode={editMode}
                  loading={loading}
                />
              ) : (
                <>
                  {/* <SearchInput onSearch={handleSearch} /> */}
                  {loading ? (
                    <ThreeDots 
                    height="80" 
                    width="80" 
                    radius="9"
                    color="#4fa94d" 
                    ariaLabel="three-dots-loading"
                    visible={true}/>
                  ) : (
                    <DataTable
                      columns={tableColumns(currentPage, rowsPerPage)}
                      data={paginatedTeams}
                      pagination
                      paginationTotalRows={filteredTeams.length}
                      paginationPerPage={rowsPerPage}
                      paginationComponentOptions={{
                        noRowsPerPage: true,
                      }}
                      paginationServer
                      onChangePage={setCurrentPage}
                      onChangeRowsPerPage={setRowsPerPage}
                    />
                  )}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Office;
