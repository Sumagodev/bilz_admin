import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Table,
} from "react-bootstrap";
import { useSearchExport } from "../../context/SearchExportContext";
import NewResuableForm from "../../components/form/NewResuableForm";
import { toast } from "react-toastify";
import instance from "../../api/AxiosInstance";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ThreeDots } from 'react-loader-spinner'; // Spinner for loading state

const ProductDetails = () => {
  const { setData, filteredData } = useSearchExport();
  const [team, setTeam] = useState([]);
  const [products, setProducts] = useState([]);
  const [subproducts, setsubProducts] = useState([]);
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [eyeVisibilityById, setEyeVisibilityById] = useState({});
  const [showForm, setShowForm] = useState(false);
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
    {
      name: <CustomHeader name="Description" />,
      cell: (row) => <span>{row.desc}</span>,
    },
    {
      name: <CustomHeader name="Product Name" />,
      cell: (row) => <span>{row.ProductName.productName }</span>,
    },
    {
      name: <CustomHeader name="Sub Product Name" />,
      cell: (row) => <span>{row.ProductDetails.title }</span>,
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
          </OverlayTrigger>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchTeam();
    fetchProducts();
    fetchSubProducts();
    const storedVisibility = JSON.parse(localStorage.getItem('eyeVisibilityById')) || {};
    setEyeVisibilityById(storedVisibility);
  }, []);

  const fetchProducts = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await instance.get("productName/find", {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      });
      const reversedData = response.data.responseData.reverse();
      setProducts(reversedData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };


  const fetchSubProducts = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await instance.get("productName/getdetails", {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      });
      setsubProducts(response.data.responseData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };



  

  const validateForm = (formData) => {
    let errors = {};
    let isValid = true;

    if (!formData.productId?.trim()) {
      errors.productId = "Product Name is required";
      isValid = false;
    }
    if (!formData.subproductId?.trim()) {
      errors.subproductId = "Sub Product Name is required";
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

  const fetchTeam = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await instance.get("Product_data/find", {
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

  const handleChange = (name, value) => {
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm(formData)) {
      const accessToken = localStorage.getItem("accessToken");
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("productId", formData.productId);
      data.append("subproductId",formData.subproductId);

      try {
        if (editMode) {
          await instance.put(`Product_data/update/${editingId}`, data, {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          });
          toast.success("Updated successfully!");
        } else {
          await instance.post("Product_data/add", data, {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          });
          toast.success("Created successfully!");
        }
        fetchTeam();
        resetForm();
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Error occurred while submitting!");
      }
    }
  };

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setEditMode(false);
    setShowForm(false);
    setErrors({});
  };

  const toggleEdit = (id) => {
    const itemToEdit = team.find((item) => item.id === id);
    setEditingId(id);
    setEditMode(true);
    setFormData({
      title: itemToEdit.title,
      description: itemToEdit.description,
      productId: itemToEdit.productId,
      subproductId:itemToEdit.subproductId
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this item?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            const accessToken = localStorage.getItem("accessToken");
            try {
              await instance.delete(`Product_data/isdelete/${id}`, {
                headers: {
                  Authorization: "Bearer " + accessToken,
                  "Content-Type": "application/json",
                },
              });
              fetchTeam();
              toast.success("Deleted successfully!");
            } catch (error) {
              console.error("Error deleting item:", error);
              toast.error("Error occurred while deleting!");
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const handleIsActive = (id, isActive) => {
    const accessToken = localStorage.getItem("accessToken");
    const updatedVisibility = { ...eyeVisibilityById, [id]: isActive };
    setEyeVisibilityById(updatedVisibility);

    instance
      .put(`Product_data/isactive/${id}`, { isActive }, {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        toast.success(`Updated status successfully!`);
      })
      .catch((error) => {
        console.error("Error updating visibility:", error);
        toast.error("Error occurred while updating visibility!");
      });
  };

  return (
    <Container>
      <Row className="mb-3">
      <Col md={12} >
      <div className="d-flex justify-content-end">
  <Button
    variant="outline-success"
    className="ms-2 mb-3"
    onClick={() => setShowForm((prev) => !prev)}
  >
    {showForm ? "Hide Form" : "Add "}
  </Button>
</div>
          {showForm && (
            <Form onSubmit={handleSubmit} className="mt-3">
               <Form.Group controlId="formProduct" className="mt-2">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  as="select"
                  value={formData.productId || ""}
                  onChange={(e) => handleChange("productId", e.target.value)}
                  isInvalid={!!errors.productId}
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.productName} {/* Assuming 'name' is the field for product name */}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">{errors.productId}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formsubProduct" className="mt-2">
                <Form.Label>Sub Product Name</Form.Label>
                <Form.Control
                  as="select"
                  value={formData.subproductId || ""}
                  onChange={(e) => handleChange("subproductId", e.target.value)}
                  isInvalid={!!errors.subproductId}
                >
                  <option value="">Select a sub product</option>
                  {subproducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.title} {/* Assuming 'name' is the field for product name */}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">{errors.subproductId}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  value={formData.title || ""}
                  onChange={(e) => handleChange("title", e.target.value)}
                  isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
              </Form.Group>
              {/* <Form.Group controlId="formDescription" className="mt-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter description"
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  isInvalid={!!errors.description}
                />
                <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
              </Form.Group> */}
                  <Col md={12}>
                <NewResuableForm
                  label="description"
                  placeholder="Enter Description"
                  name="description"
                  type="text"
                  onChange={handleChange}
                  initialData={formData}
                  textarea
                  useJodit={true}
                  error={errors.description}
                />
              </Col>
             
              <Button variant="primary" type="submit" className="mt-3">
                {editMode ? "Update" : "Submit"}
              </Button>
              <Button variant="secondary" onClick={resetForm} className="mt-3 ms-2">
                Reset
              </Button>
            </Form>
          )}
        </Col>
        </Row>
     
      <Row>
        <Col md={12}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
              <ThreeDots width={80} height={80} color="gray" />
            </div>
          ) : (
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Product</th>
                
                <th>Sub Product</th>
                  <th>Title</th>
                  <th>Description</th>
                
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {team.map((row, index) => (
                  <tr key={row.id}>
                    <td>{index + 1}</td>
                    <td>{row.ProductName.productName}</td>
                    <td>{row.ProductImage.title}</td>
                    <td>{row.title}</td>
                    <td
                      dangerouslySetInnerHTML={{
                        __html: row.description,
                      }}
                    ></td>
                   
                    
                    <td>
                      <div className="d-flex">
                        <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                          <Button className="ms-1" onClick={() => toggleEdit(row.id)}>
                            <FaEdit />
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                          <Button
                            className="ms-1"
                            style={{ backgroundColor: "red", color: "white" }}
                            onClick={() => handleDelete(row.id)}
                          >
                            <FaTrash />
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Toggle Visibility</Tooltip>}>
                          <Button
                            className="ms-1 btn-success"
                            onClick={() => handleIsActive(row.id, !eyeVisibilityById[row.id])}
                          >
                            {eyeVisibilityById[row.id] ? <FaEye /> : <FaEyeSlash />}
                          </Button>
                        </OverlayTrigger>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;
