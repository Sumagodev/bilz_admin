// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Form,
//   Tooltip,
//   OverlayTrigger,
// } from "react-bootstrap";
// import DataTable from "react-data-table-component";
// import { useSearchExport } from "../../context/SearchExportContext";
// import NewResuableForm from "../../components/form/NewResuableForm";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import instance from "../../api/AxiosInstance";
// import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
// import { ThreeDots } from 'react-loader-spinner';
// import "../../App.scss";
// import { confirmAlert } from "react-confirm-alert";
// import 'react-confirm-alert/src/react-confirm-alert.css';

// const HeaderContact = () => {
//   const { searchQuery, handleSearch, setData, filteredData } = useSearchExport();
//   const [team, setTeam] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [editMode, setEditMode] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [showTable, setShowTable] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [loading, setLoading] = useState(false);
//   const [eyeVisibilityById, setEyeVisibilityById] = useState({});

//   const CustomHeader = ({ name }) => (
//     <div style={{ fontWeight: "bold", color: "black", fontSize: "16px" }}>
//       {name}
//     </div>
//   );

//   const tableColumns = (currentPage, rowsPerPage) => [
//     {
//       name: <CustomHeader name="Sr. No." />,
//       selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
//     },
//     {
//       name: <CustomHeader name="Title" />,
//       cell: (row) => <span>{row.title}</span>,
//     },
//     {
//       name: <CustomHeader name="descriptionription" />,
//       cell: (row) => <span>{row.descriptionription}</span>,
//     },
//     {
//       name: <CustomHeader name="Actions" />,
//       cell: (row) => (
//         <div className="d-flex">
//           <OverlayTrigger
//             placement="top"
//             overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}
//           >
//             <Button className="ms-1" onClick={() => handleEdit(row.id)}>
//               <FaEdit />
//             </Button>
//           </OverlayTrigger>
//           <OverlayTrigger
//             placement="top"
//             overlay={<Tooltip id="delete-tooltip">Delete</Tooltip>}
//           >
//             <Button
//               className="ms-1"
//               style={{ backgroundColor: "red", color: "white", borderColor: "red" }}
//               onClick={() => handleDelete(row.id)}
//             >
//               <FaTrash />
//             </Button>
//           </OverlayTrigger>
//           <OverlayTrigger
//             placement="top"
//             overlay={<Tooltip id="visibility-tooltip">{eyeVisibilityById[row.id] ? 'Hide' : 'Show'}</Tooltip>}
//           >
//             <Button
//               className="ms-1"
//               style={{
//                 backgroundColor: eyeVisibilityById[row.id] ? 'red' : 'green',
//                 borderColor: eyeVisibilityById[row.id] ? 'red' : 'green',
//                 color: 'white',
//               }}
//               onClick={() => handleIsActive(row.id, !eyeVisibilityById[row.id])}
//             >
//               {eyeVisibilityById[row.id] ? <FaEyeSlash /> : <FaEye />}
//             </Button>
//           </OverlayTrigger>
//         </div>
//       ),
//     },
//   ];

//   useEffect(() => {
//     fetchTeam();
//     const storedVisibility = JSON.parse(localStorage.getItem('eyeVisibilityById')) || {};
//     setEyeVisibilityById(storedVisibility);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('eyeVisibilityById', JSON.stringify(eyeVisibilityById));
//   }, [eyeVisibilityById]);

//   const fetchTeam = async () => {
//     setLoading(true);
//     const accessToken = localStorage.getItem("accessToken");
//     try {
//       const response = await instance.get("home_about/find", {
//         headers: {
//           Authorization: "Bearer " + accessToken,
//           "Content-Type": "application/json",
//         },
//       });
//       const reversedData = response.data.responseData;
//       setTeam(reversedData);
//       setData(reversedData);
//       console.log("reversedData", reversedData);
//     } catch (error) {
//       console.error("Error fetching team:", error.response || error.message || error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validateForm = (formData) => {
//     let errors = {};
//     let isValid = true;

//     if (!formData.title?.trim()) {
//       errors.title = "Title is required";
//       isValid = false;
//     }

//     if (!formData.descriptionription?.trim()) {
//       errors.descriptionription = "descriptionription is required";
//       isValid = false;
//     }

//     setErrors(errors);
//     return isValid;
//   };

//   const handleChange = (name, value) => {
//     setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
//     if (errors[name]) {
//       setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm(formData)) {
//       setLoading(true);
//       const accessToken = localStorage.getItem("accessToken");
//       const data = new FormData();
//       // Append each formData key-value pair to the FormData instance
//       for (const key in formData) {
//         data.append(key, formData[key]);
//       }

//       try {
//         if (editMode) {
//           // Update the existing record
//           await instance.put(`home_about/update/${editingId}`, data, {
//             headers: {
//               Authorization: "Bearer " + accessToken,
//               "Content-Type": "application/json",
//             },
//           });
//           toast.success("Data Updated Successfully");

//           const updatedTeam = team.map((member) =>
//             member.id === editingId ? { ...member, ...formData } : member
//           );
//           setTeam(updatedTeam);
//           setData(updatedTeam);
//         } else {
//           // Add a new record
//           await instance.post("home_about/add", data, {
//             headers: {
//               Authorization: "Bearer " + accessToken,
//               "Content-Type": "multipart/form-data",
//             },
//           });
//           toast.success("Data Added Successfully");
//           fetchTeam();
//         }

//         setEditMode(false);
//         setFormData({});
//         setShowTable(true);
//       } catch (error) {
//         console.error("Error handling form submission:", error);
//         toast.error("Error handling form submission");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleDelete = (id) => {
//     confirmAlert({
//       title: "Confirm to delete",
//       message: "Are you sure you want to delete this data?",
//       customUI: ({ onClose }) => (
//         <div className="confirm-alert">
//           <h2>Confirm to delete</h2>
//           <p>Are you sure you want to delete this data?</p>
//           <div className="confirm-alert-buttons">
//             <Button
//               variant="primary"
//               onClick={async () => {
//                 setLoading(true);
//                 const accessToken = localStorage.getItem("accessToken");
//                 try {
//                   await instance.delete(`home_about/isdelete/${id}`, {
//                     headers: {
//                       Authorization: `Bearer ${accessToken}`,
//                       "Content-Type": "application/json",
//                     },
//                   });
//                   toast.success("Data Deleted Successfully");
//                   fetchTeam();
//                 } catch (error) {
//                   console.error("Error deleting data:", error);
//                   toast.error("Error deleting data");
//                 } finally {
//                   setLoading(false);
//                 }
//                 onClose();
//               }}
//             >
//               Yes
//             </Button>
//             <Button variant="secondary" onClick={() => onClose()}>
//               No
//             </Button>
//           </div>
//         </div>
//       ),
//     });
//   };

//   const handleIsActive = async (id, isActive) => {
//     confirmAlert({
//       title: "Confirm to change status",
//       message: `Are you sure you want to ${isActive ? "deactivate" : "activate"} this data?`,
//       customUI: ({ onClose }) => (
//         <div className="confirm-alert">
//           <h2>Confirm to change status</h2>
//           <p>Are you sure you want to {isActive ? "deactivate" : "activate"} this data?</p>
//           <div className="confirm-alert-buttons">
//             <Button
//               variant="primary"
//               onClick={async () => {
//                 setLoading(true);
//                 const accessToken = localStorage.getItem("accessToken");
//                 try {
//                   await instance.put(`home_about/isactive/${id}`, { isActive }, {
//                     headers: {
//                       Authorization: `Bearer ${accessToken}`,
//                       "Content-Type": "application/json",
//                     },
//                   });
//                   toast.success(`Data ${isActive ? "deactivated" : "activated"} successfully`);
//                   setEyeVisibilityById((prev) => ({
//                     ...prev,
//                     [id]: isActive,
//                   }));
//                   fetchTeam();
//                 } catch (error) {
//                   console.error("Error updating status:", error);
//                   toast.error("Error updating status");
//                 } finally {
//                   setLoading(false);
//                 }
//                 onClose();
//               }}
//             >
//               Yes
//             </Button>
//             <Button variant="secondary" onClick={() => onClose()}>
//               No
//             </Button>
//           </div>
//         </div>
//       ),
//     });
//   };

//   const handleEdit = (id) => {
//     const selectedMember = team.find((member) => member.id === id);
//     setEditingId(id);
//     setFormData(selectedMember);
//     setEditMode(true);
//     setShowTable(false);
//   };

//   const handleAdd = () => {
//     setFormData({});
//     setEditMode(false);
//     setShowTable(false);
//   };

//   const handleCancel = () => {
//     setFormData({});
//     setEditMode(false);
//     setShowTable(true);
//   };

//   return (
//     <Container fluid>
//       <Row>
//         <Col>
//           <Card>
//             <Card.Header>
//               <Row>
//                 {showTable ? (
//                   <Col className="d-flex justify-content-end align-items-center">
//                     <Button
//                       variant="outline-success"
//                       onClick={handleAdd}
//                       className="ms-2 mb-3"
//                     >
//                       Add
//                     </Button>
//                   </Col>
//                 ) : (
//                   <Col className="d-flex justify-content-end align-items-center">
//                     <Button variant="outline-secondary" onClick={handleCancel}>
//                       Cancel
//                     </Button>
//                   </Col>
//                 )}
//               </Row>
//             </Card.Header>

//             <Card.Body>
//               {loading ? (
//                 <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
//                   <ThreeDots
//                     height="80"
//                     width="80"
//                     radius="9"
//                     color="#000"
//                     ariaLabel="three-dots-loading"
//                     visible={true}
//                   />
//                 </div>
//               ) : showTable ? (
//                 <DataTable
//                   columns={tableColumns(currentPage, rowsPerPage)}
//                   data={filteredData.length > 0 ? filteredData : team}
//                   pagination
//                   responsive
//                   striped
//                   noDataComponent="No Data Available"
//                   onChangePage={(page) => setCurrentPage(page)}
//                   onChangeRowsPerPage={(rowsPerPage) => setRowsPerPage(rowsPerPage)}
//                 />
//               ) : (
//                 <Form onSubmit={handleSubmit}>
//                   <Row>
//                     <Col md={6}>
//                       <NewResuableForm
//                         label={"Title"}
//                         placeholder={"Enter Title"}
//                         type={"text"}
//                         name={"title"}
//                         onChange={handleChange}
//                         initialData={formData}
//                         error={errors.title}
//                       />
//                     </Col>
//                     <Col md={6}>
//                       <NewResuableForm
//                         label={"descriptionription"}
//                         placeholder={"Enter descriptionription"}
//                         type={"text"}
//                         name={"descriptionription"}
//                         onChange={handleChange}
//                         initialData={formData}
//                         error={errors.descriptionription}
//                       />
//                     </Col>
//                   </Row>
//                   <Row>
//                     <div className="mt-3 d-flex justify-content-end">
//                       <Button
//                         type="submit"
//                         variant={editMode ? "success" : "primary"}
//                       >
//                         {editMode ? "Update" : "Add"}
//                       </Button>
//                       <Button
//                         type="button"
//                         variant="secondary"
//                         onClick={handleCancel}
//                         className="ms-2"
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   </Row>
//                 </Form>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default HeaderContact;
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
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
import { ThreeDots } from 'react-loader-spinner';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import "../../App.scss";

const HeaderContact = () => {
  const { searchQuery, handleSearch, handleExport, setData, filteredData } =
    useSearchExport();
  const [team, setTeam] = useState([]);
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [eyeVisibilityById, setEyeVisibilityById] = useState({});
  const [showTable, setShowTable] = useState(true);
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
      name: <CustomHeader name="Title" />,
      cell: (row) => <span>{row.title}</span>,
    },
    // {
    //   name: <CustomHeader name="Description" />,
    //   cell: (row) => <span>{row.description}</span>,
    // },
     {
    name: <CustomHeader name="Description" />,
    cell: (row) => (
      <span>
        {row.description.length > 100
          ? `${row.description.substring(0, 100)}...`
          : row.description}
      </span>
    ),
  },
    {
      name: <CustomHeader name="Actions" />,
      cell: (row) => (
        <div className="d-flex">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}
          >
            <Button className="ms-1" onClick={() => toggleEdit(row.id)}>
              <FaEdit />
            </Button>
          </OverlayTrigger>
          {/* <OverlayTrigger
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
          <OverlayTrigger
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
      const response = await instance.get("home_about/find", {
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

    if (!formData.title?.trim()) {
      errors.title = "Title is required";
      isValid = false;
    }

    if (!formData.description?.trim()) {
      errors.description = "descriptionis required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleChange = (name, value) => {
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm(formData)) {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      const data = {
        title: formData.title,
        description: formData.description,
      };

      try {
        if (editMode) {
          await instance.put(`home_about/update/${editingId}`, data, {
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
          await instance.post("home_about/add", data, {
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
      title: "Confirm to delete",
      message: "Are you sure you want to delete this data?",
      customUI: ({ onClose }) => (
        <div style={{ textAlign: "left", padding: "20px", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 8px rgba(5, 5, 5, 0.2)", maxWidth: "400px", margin: "0 auto" }}>
          <h2>Confirm to delete</h2>
          <p>Are you sure you want to delete this data?</p>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
            <button style={{ marginRight: "10px" }} className="btn btn-primary" onClick={async () => {
              setLoading(true);
              const accessToken = localStorage.getItem("accessToken");
              try {
                await instance.delete(`home_about/isdelete/${id}`, {
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
      title: "Confirm to change visibility",
      customUI: ({ onClose }) => (
        <div style={{ textAlign: "left", padding: "20px", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 8px rgba(5, 5, 5, 0.2)", maxWidth: "400px", margin: "0 auto" }}>
          <h2>Confirm to change visibility</h2>
          <p>Are you sure you want to {isVisible ? "hide" : "show"} this data?</p>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
            <button style={{ marginRight: "10px" }} className="btn btn-primary" onClick={async () => {
              setLoading(true);
              const accessToken = localStorage.getItem("accessToken");
              try {
                await instance.put(`home_about/isactive/${id}`, { isVisible }, {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                  },
                });
                toast.success(`Data ${isVisible ? "hidden" : "shown"} successfully`);
                setEyeVisibilityById((prev) => ({
                  ...prev,
                  [id]: isVisible,
                }));
                fetchTeam();
              } catch (error) {
                console.error("Error updating visibility:", error);
                toast.error("Error updating visibility");
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

  const toggleEdit = (id) => {
    const selectedMember = team.find((member) => member.id === id);
    setEditingId(id);
    setFormData(selectedMember);
    setEditMode(true);
    setShowTable(false);
  };

  const handleAdd = () => {
    setFormData({});
    setEditMode(false);
    setShowTable(false);
  };

  const handleView = () => {
    setFormData({});
    setEditMode(false);
    setShowTable(true);
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Row>
                {showTable ? (
                  <Col className="d-flex justify-content-end align-items-center">
                    <SearchInput
                      searchQuery={searchQuery}
                      onSearch={handleSearch}
                      onExport={handleExport}
                      showExportButton={false}
                    />
                    {/* <Button
                      variant="outline-success"
                      onClick={handleAdd}
                      className="ms-2 mb-3"
                    >
                      Add
                    </Button> */}
                  </Col>
                ) : (
                  <Col className="d-flex justify-content-end align-items-center">
                    <Button variant="outline-secondary" onClick={handleView}>
                      View
                    </Button>
                  </Col>
                )}
              </Row>
            </Card.Header>

            <Card.Body>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                  <ThreeDots
                    height="80"
                    width="80"
                    radius="9"
                    color="#000"
                    ariaLabel="three-dots-loading"
                    visible={true}
                  />
                </div>
              ) : showTable ? (
                <DataTable
                  columns={tableColumns(currentPage, rowsPerPage)}
                  data={filteredData.length > 0 ? filteredData : team}
                  pagination
                  responsive
                  striped
                  noDataComponent="No Data Available"
                  onChangePage={(page) => setCurrentPage(page)}
                  onChangeRowsPerPage={(rowsPerPage) =>
                    setRowsPerPage(rowsPerPage)
                  }
                  customStyles={{
                    rows: {
                      style: {
                        alignItems: "flex-start",
                      },
                    },
                    cells: {
                      style: {
                        textAlign: "left",
                      },
                    },
                  }}
                />
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <NewResuableForm
                        label="Title"
                        placeholder="Enter Title"
                        name="title"
                        type="text"
                        onChange={handleChange}
                        initialData={formData}
                        error={errors.title}
                      />
                    </Col>
                    <Col md={6}>
                      <NewResuableForm
                        label="description"
                        placeholder="Enter description"
                        name="description"
                        type="text"
                        onChange={handleChange}
                        initialData={formData}
                        textarea
                        useJodit={true}
                        error={errors.description}
                      />
                    </Col>


                    
                  </Row>
                  <Row>
                    <div className="mt-3 d-flex justify-content-end">
                      <Button
                        type="submit"
                        variant={editMode ? "success" : "primary"}
                      >
                        {editMode ? "Update" : "Submit"}
                      </Button>
                    </div>
                  </Row>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HeaderContact;
