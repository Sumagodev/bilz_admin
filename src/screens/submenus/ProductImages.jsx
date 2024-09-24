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
import NewReusableForm from "../../components/form/NewResuableForm";
import SearchInput from "../../components/search/SearchInput";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import instance from "../../api/AxiosInstance";
import { FaEdit, FaTrash } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ThreeDots } from "react-loader-spinner";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import "../../App.scss";

const ServiceDetail = () => {
  const { searchQuery, handleSearch, handleExport, setData, filteredData } = useSearchExport();

  const [team, setTeam] = useState([]);
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [eyeVisibilityById, setEyeVisibilityById] = useState({});
  const [imagePreviews, setImagePreviews] = useState("");
  const [showTable, setShowTable] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

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
      selector: (row) => row.title,
    },
    {
      name: <CustomHeader name="Description" />,
      selector: (row) => row.description,
    },
    {
      name: <CustomHeader name="Product Name" />,
      cell: (row) => <span>{row.pri}</span>,
    },
    {
      name: <CustomHeader name="Image" />,
      cell: (row) => (
        <img src={row.img} alt="ServiceDetail" style={{ width: "100px", height: "auto" }} />
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
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchTeam();
    fetchProducts();
    const storedVisibility = JSON.parse(localStorage.getItem('eyeVisibilityById')) || {};
    setEyeVisibilityById(storedVisibility);
  }, []);

  useEffect(() => {
    localStorage.setItem('eyeVisibilityById', JSON.stringify(eyeVisibilityById));
  }, [eyeVisibilityById]);

  useEffect(() => {
    if (formData.img && formData.img instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(reader.result);
      };
      reader.readAsDataURL(formData.img);
    } else if (formData.img && typeof formData.img === "string") {
      setImagePreviews(formData.img);
    } else {
      setImagePreviews("");
    }
  }, [formData.img]);

  const fetchTeam = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await instance.get("ServiceDetail/find", {
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

  const fetchProducts = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await instance.get("ServiceName/find", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setProducts(response.data.responseData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const validateForm = (formData) => {
    let errors = {};
    let isValid = true;

    if (!formData.img) {
      errors.img = "Image is required with 500x500 pixels";
      isValid = false;
    } else if (formData.img instanceof File && !validateImageSize(formData.img)) {
      errors.img = "Image is not 500x500 pixels";
      isValid = false;
    }
    if (!formData.productId?.trim()) {
      errors.productId = "Product Name is required";
      isValid = false;
    }
    if (!formData.title?.trim()) {
      errors.title = "Title is required";
      isValid = false;
    }
    if (!formData.description?.trim()) {
      errors.description = "Description is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const validateImageSize = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (img.width === 500 && img.height === 500) {
          resolve();
        } else {
          reject("Image must be 500x500 pixels");
        }
      };
      img.onerror = () => reject("Error loading image");
      img.src = URL.createObjectURL(file);
    });
  };

  const handleChange = async (name, value) => {
    if (name === "img" && value instanceof File) {
      try {
        await validateImageSize(value);
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, img: "" }));
      } catch (error) {
        setErrors((prevErrors) => ({ ...prevErrors, img: error }));
        setImagePreviews("");
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
          await instance.put(`ServiceDetail/update/${editingId}`, data, {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "multipart/form-data",
            },
          });
          toast.success("Data Updated Successfully");
          const updatedTeam = team.map((member) =>
            member.id === editingId ? formData : member
          );
          setTeam(updatedTeam);
        } else {
          await instance.post("ServiceDetail/add", data, {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "multipart/form-data",
            },
          });
          toast.success("Data Submitted Successfully");
        }
        fetchTeam();
        setEditMode(false);
        setFormData({ title: "", description: "" });
        setImagePreviews("");
        setShowTable(true);
      } catch (error) {
        console.error("Error handling form submission:", error);
        toast.error(error.response.data.message);
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
        <div
          style={{
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
          }}
        >
          <h1>Confirm</h1>
          <p>Are you sure you want to delete?</p>
          <button
            onClick={async () => {
              setLoading(true);
              const accessToken = localStorage.getItem("accessToken");
              try {
                await instance.delete(`ServiceDetail/isdelete/${id}`, {
                  headers: {
                    Authorization: "Bearer " + accessToken,
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
                onClose();
              }
            }}
          >
            Yes, Delete
          </button>
          <button onClick={onClose}>No, Cancel</button>
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
    setFormData({ title: "", description: "" });
    setEditMode(false);
    setShowTable(false);
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
                    <SearchInput searchQuery={searchQuery} onSearch={handleSearch} showExportButton={false} />
                    <Button variant="outline-success" onClick={handleAdd} className="ms-2 mb-3">
                      Add
                    </Button>
                  </Col>
                ) : (
                  <Col className="d-flex justify-content-end align-items-center">
                    <Button variant="outline-secondary" onClick={() => setShowTable(true)}>
                      View
                    </Button>
                  </Col>
                )}
              </Row>
            </Card.Header>

            <Card.Body>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "100px" }}>
                  <ThreeDots height="80" width="80" radius="9" color="#000" ariaLabel="three-dots-loading" visible={true} />
                </div>
              ) : showTable ? (
                <DataTable
                  columns={tableColumns(currentPage, rowsPerPage)}
                  data={filteredData.length > 0 ? filteredData : team}
                  pagination
                  paginationServer
                  paginationTotalRows={team.length}
                  onChangePage={(page) => setCurrentPage(page)}
                  onChangeRowsPerPage={(newPerPage) => setRowsPerPage(newPerPage)}
                  responsive
                  striped
                  noDataComponent="No Data Available"
                />
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="productId">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                          as="select"
                          value={formData.productId || ""}
                          onChange={(e) => handleChange("productId", e.target.value)}
                          isInvalid={!!errors.productId}
                        >
                          <option value="">Select Product</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.title}>{product.title}</option>
                          ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">{errors.productId}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.title}
                          onChange={(e) => handleChange("title", e.target.value)}
                          isInvalid={!!errors.title}
                        />
                        <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="desc">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.description}
                          onChange={(e) => handleChange("description", e.target.value)}
                          isInvalid={!!errors.description}
                        />
                        <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="img">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleChange("img", e.target.files[0])}
                          isInvalid={!!errors.img}
                        />
                        <Form.Control.Feedback type="invalid">{errors.img}</Form.Control.Feedback>
                      </Form.Group>
                      {imagePreviews && (
                        <img src={imagePreviews} alt="Preview" style={{ width: "100px", height: "auto", marginTop: "10px" }} />
                      )}
                    </Col>
                  </Row>
                  <Button type="submit" variant="primary" className="mt-3">
                    {editMode ? "Update" : "Submit"}
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ServiceDetail;
