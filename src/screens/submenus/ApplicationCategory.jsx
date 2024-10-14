import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Button, Form, Table } from "react-bootstrap";
import { useSearchExport } from "../../context/SearchExportContext";
import { ShowContext } from "../../context/ShowContext";
import NewResuableForm from "../../components/form/NewResuableForm";
import SearchInput from "../../components/search/SearchInput";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TablePagination from "../../components/pagination/TablePagination";
import instance from "../../api/AxiosInstance";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const ApplicationCategory = () => {
    const { searchQuery, handleSearch, handleExport, setData, filteredData } =
      useSearchExport();
    const { shows, toggleShows } = useContext(ShowContext);
    const [team, setTeam] = useState([]);
    const [errors, setErrors] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});
    const [eyeVisibilityById, setEyeVisibilityById] = useState({});
  
    const tableColumns = [
      {
        key: "srNo",
        label: "Sr. No.",
        render: (value, index) => index + 1, // Adding serial number starting from 1
      },
      { key: "title", label: "Application Category" }
    ];
  
    useEffect(() => {
      fetchTeam();
    }, []);
  
    const fetchTeam = async () => {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const response = await instance.get(
          "ServiceName/find",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const reversedData = response.data.responseData.reverse();
        setTeam(reversedData);
        setData(reversedData);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
  
    const validateForm = (formData) => {
      let errors = {};
      let isValid = true;
  
      if (!formData.title?.trim()) {
        errors.title = "Application Category is required";
        isValid = false;
      }
  
      setErrors(errors);
      return isValid;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (validateForm(formData)) {
        const accessToken = localStorage.getItem("accessToken");
  
        try {
          if (editMode) {
            await instance.put(
              `ServiceName/update/${editingId}`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
              }
            );
            toast.success("Data Updated Successfully");
            // Update the specific entry in the team array
            const updatedTeam = team.map((member) =>
              member.id === editingId ? { ...member, ...formData } : member
            );
            setTeam(updatedTeam);
            setData(updatedTeam);
          } else {
            await instance.post("ServiceName/add", formData, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            });
            toast.success("Data Submitted Successfully");
            fetchTeam();
          }
          setEditMode(false);
          setFormData({});
          toggleShows();
        } catch (error) {
          console.error("Error handling form submission:", error);
        }
      }
    };
  
    const handleDelete = async (id) => {
      confirmAlert({
        title: "Confirm to delete",
        message: "Are you sure you want to delete this data?",
        customUI: ({ onClose }) => (
          <div
            style={{
              textAlign: "left",
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(5, 5, 5, 0.2)",
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            <h2>Confirm to delete</h2>
            <p>Are you sure you want to delete this data?</p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <button
                style={{ marginRight: "10px" }}
                className="btn btn-primary"
                onClick={async () => {
                  const accessToken = localStorage.getItem("accessToken");
                  try {
                    await instance.delete(`ServiceName/isdelete/${id}`, {
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                      },
                    });
                    toast.success("Data Deleted Successfully");
                    fetchTeam();
                  } catch (error) {
                    console.error("Error deleting data:", error);
                    toast.error("Error deleting data");
                  }
                  onClose();
                }}
              >
                Yes
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => onClose()}
              >
                No
              </button>
            </div>
          </div>
        ),
      });
    };
  
    const handleIsActive = async (id, isVisible) => {
      confirmAlert({
        title: "Confirm to change visibility",
        customUI: ({ onClose }) => (
          <div
            style={{
              textAlign: "left",
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(5, 5, 5, 0.2)",
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            <h2>Confirm to change visibility</h2>
            <p>Are you sure you want to {isVisible ? "hide" : "show"} this data?</p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <button
                style={{ marginRight: "10px" }}
                className="btn btn-primary"
                onClick={async () => {
                  const accessToken = localStorage.getItem("accessToken");
                  try {
                    await instance.put(
                      `ServiceName/isactive/${id}`,
                      { isVisible },
                      {
                        headers: {
                          Authorization: `Bearer ${accessToken}`,
                          "Content-Type": "application/json",
                        },
                      }
                    );
                    toast.success(
                      `Data ${isVisible ? "hidden" : "shown"} successfully`
                    );
                    setEyeVisibilityById((prev) => ({
                      ...prev,
                      [id]: isVisible,
                    }));
                    fetchTeam();
                  } catch (error) {
                    console.error("Error updating visibility:", error);
                    toast.error("Error updating visibility");
                  }
                  onClose();
                }}
              >
                Yes
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => onClose()}
              >
                No
              </button>
            </div>
          </div>
        ),
      });
    };
  
    const toggleEdit = (leaderId) => {
      const memberToEdit = team.find((item) => item.id === leaderId);
      if (memberToEdit) {
        setEditingId(leaderId);
        setEditMode(true);
        toggleShows();
        setFormData(memberToEdit);
      }
    };
  
    useEffect(() => {
      if (!shows) {
        setEditMode(false);
        setEditingId(null);
        setFormData({});
      }
    }, [shows]);
  
    const handleChange = (name, value) => {
      setFormData({ ...formData, [name]: value });
    };
  
    const handleAdd = () => {
      setFormData({});
      setEditMode(false);
      toggleShows();
    };
  
    return (
      <Container>
        <Row>
          <Col>
            {!shows && !editMode && (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <SearchInput
                    searchQuery={searchQuery}
                    onSearch={handleSearch}
                    onExport={handleExport}
                    showExportButton={false}
                  />
                  <Button variant="outline-primary" onClick={handleAdd}>
                    Add
                  </Button>
                </div>
              </>
            )}
          </Col>
        </Row>
  
        <Row>
          <Col>
            {!shows && !editMode ? (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    {tableColumns.map((col) => (
                      <th key={col.key}>{col.label}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(searchQuery.trim() ? filteredData : team).map((item, index) => (
                    <tr key={item.id}>
                      {tableColumns.map((col) => (
                        <td key={col.key}>
                          {col.key === "srNo"
                            ? index + 1
                            : col.render
                            ? col.render(item[col.key], index)
                            : item[col.key]}
                        </td>
                      ))}
                      <td>
                        <div className="d-flex">
                          <Button className="ms-1" onClick={() => toggleEdit(item.id)}>
                            <FaEdit />
                          </Button>
                          <Button className="ms-1  btn-danger" onClick={() => handleDelete(item.id)}>
                            <FaTrash />
                          </Button>
                          <Button
                            className="ms-1 btn-success"
                            onClick={() =>
                              handleIsActive(item.id, !eyeVisibilityById[item.id])
                            }
                          >
                            {eyeVisibilityById[item.id] ? (
                              <FaEyeSlash />
                            ) : (
                              <FaEye />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              
              <Card className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <NewResuableForm
                        label="Application Category"
                        placeholder="Enter Application Category"
                        name="title"
                        type="text"
                        onChange={handleChange}
                        initialData={formData}
                      />
                      {errors.title && (
                        <p className="text-danger">{errors.title}</p>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col className="d-flex justify-content-end">
                      <div className="mt-3 d-flex justify-content-end">
                        <Button
                          type="submit"
                          variant={editMode ? "success" : "primary"}
                        >
                          {editMode ? "Update" : "Submit"}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Card>
            )}
          </Col>
        </Row>
  
        <Row>
          {!shows && !editMode && (
            <Col className="mt-3">
              <TablePagination />
            </Col>
          )}
        </Row>
      </Container>
    );
  };
  

export default ApplicationCategory;
