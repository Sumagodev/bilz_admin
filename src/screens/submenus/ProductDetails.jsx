
// ///////sos
// ////v1 datatable added
// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Form,
//   Table,
// } from "react-bootstrap";
// import DataTable from "react-data-table-component";
// import { useSearchExport } from "../../context/SearchExportContext";
// import { ShowContext } from "../../context/ShowContext";
// import NewReusableForm from "../../components/form/NewResuableForm";
// import SearchInput from "../../components/search/SearchInput";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import instance from "../../api/AxiosInstance";
// import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
// import { confirmAlert } from "react-confirm-alert";
// import "react-confirm-alert/src/react-confirm-alert.css";
// import { ThreeDots  } from 'react-loader-spinner'; 
// import { Tooltip, OverlayTrigger,  } from 'react-bootstrap';
// import "../../App.scss";
// const ProductDetails = () => {
//   const { searchQuery, handleSearch, handleExport, setData, filteredData } =
//     useSearchExport();

//   const [team, setTeam] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [editMode, setEditMode] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [eyeVisibilityById, setEyeVisibilityById] = useState({});
//   const [imagePreview, setImagePreview] = useState("");
//   const [showTable, setShowTable] = useState(true); // New state for toggling form and table view
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [loading, setLoading] = useState(false);
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
//       name: <CustomHeader name="Product Name" />,
//       cell: (row) => <span>{row.productName}</span>,
//     },
//     {
//       name: <CustomHeader name="Application" />,
//       cell: (row) => <span>{row.application}</span>,
//     },
//     {
//       name: <CustomHeader name="Actions" />,
//       cell: (row) => (
//         <div className="d-flex">
//           <OverlayTrigger
//             placement="top"
//             overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}
//           >
//             <Button className="ms-1" onClick={() => toggleEdit(row.id)}>
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
//     // Retrieve and set visibility state from localStorage
//     const storedVisibility = JSON.parse(localStorage.getItem('eyeVisibilityById')) || {};
//     setEyeVisibilityById(storedVisibility);
//   }, []);

//   useEffect(() => {
//     // Store visibility state in localStorage whenever it changes
//     localStorage.setItem('eyeVisibilityById', JSON.stringify(eyeVisibilityById));
//   }, [eyeVisibilityById]);
  


//   const fetchTeam = async () => {
//     setLoading(true);
//     const accessToken = localStorage.getItem("accessToken"); // Retrieve access token
//     try {
//       const response = await instance.get("productdetails/find-productdetails", {
//         headers: {
//           Authorization: "Bearer " + accessToken,
//           "Content-Type": "application/json",
//         },
//       });
//       const reversedData = response.data.responseData.reverse();
//       setTeam(reversedData);
//       setData(reversedData);
//     } catch (error) {
//       console.error(
//         "Error fetching team:",
//         error.response || error.message || error
//       );
//     }    finally {
//       setLoading(false);
//     }
//   };

//   const validateForm = (formData) => {
//     let errors = {};
//     let isValid = true;


//     if (!formData.productName?.trim()) {
//       errors.productName = "Product Name is required";
//       isValid = false;
//     }

  

//     if (!formData.application?.trim()) {
//       errors.application = "Product Description is required";
//       isValid = false;
//     } 
  

//     setErrors(errors);
//     return isValid;
//   };



//   // const handleChange = (name, value) => {
//   //   if (name === "application") {
//   //     const charLimit = 1000; // Set your character limit here
//   //     if (value.length > charLimit) {
//   //       setErrors((prevErrors) => ({
//   //         ...prevErrors,
//   //         application: `Character limit of ${charLimit} exceeded`,
//   //       }));
//   //     } else {
//   //       setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
//   //       setErrors((prevErrors) => ({ ...prevErrors, application: "" }));
//   //     }
//   //   } else {
//   //     setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
//   //   }
//   // };


//   const handleChange = (name, value) => {
//     setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm(formData)) {
//       setLoading(true);
//       const accessToken = localStorage.getItem("accessToken"); // Retrieve access token
//       const data = new FormData();
//       for (const key in formData) {
//         data.append(key, formData[key]);
//       }

//       try {
//         if (editMode) {
//           await instance.put(`productdetails/update-productdetails/${editingId}`, data, {
//             headers: {
//               Authorization: "Bearer " + accessToken,
//               "Content-Type": "application/json",
//             },
//           });
//           toast.success("Data Updated Successfully");
//           const updatedTeam = team.map((member) =>
//             member.id === editingId ? formData : member
//           );
//           setTeam(updatedTeam);
//         } else {
//           await instance.post("productdetails/create-productdetails", data, {
//             headers: {
//               Authorization: "Bearer " + accessToken,
//               "Content-Type": "application/json",
//             },
//           });
//           toast.success("Data Submitted Successfully");
//         }
//         fetchTeam();

//         setEditMode(false);
//         setFormData({});
//         setImagePreview("");
//         setShowTable(true); // Switch back to table view after submission
//       } catch (error) {
//         console.error("Error handling form submission:", error);
//         toast.error(error.response.data.message);
//       } finally {
//         setLoading(false); // Set loading to false
//       }
//     }
//   };

//   const handleDelete = async (id) => {
//     confirmAlert({
//       title: "Confirm to delete",
//       message: "Are you sure you want to delete this data?",
//       customUI: ({ onClose }) => (
//         <div
//           style={{
//             textAlign: "left",
//             padding: "20px",
//             backgroundColor: "white",
//             borderRadius: "8px",
//             boxShadow: "0 4px 8px rgba(5, 5, 5, 0.2)",
//             maxWidth: "400px",
//             margin: "0 auto",
//           }}
//         >
//           <h2>Confirm to delete</h2>
//           <p>Are you sure you want to delete this data?</p>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "flex-end",
//               marginTop: "20px",
//             }}
//           >
//             <button
//               style={{ marginRight: "10px" }}
//               className="btn btn-primary"
//               onClick={async () => {
//                 setLoading(true);
//                 const accessToken = localStorage.getItem("accessToken");
//                 try {
//                   await instance.delete(`productAggregate/delete-products/${id}`, {
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
//         setLoading(false); 
//       }
//                 onClose();
//               }}
//             >
//               Yes
//             </button>
//             <button className="btn btn-secondary" onClick={() => onClose()}>
//               No
//             </button>
//           </div>
//         </div>
//       ),
//     });
//   };

//   const handleIsActive = async (id, isVisible) => {
//     confirmAlert({
//       title: "Confirm to change visibility",
//       customUI: ({ onClose }) => (
//         <div
//           style={{
//             textAlign: "left",
//             padding: "20px",
//             backgroundColor: "white",
//             borderRadius: "8px",
//             boxShadow: "0 4px 8px rgba(5, 5, 5, 0.2)",
//             maxWidth: "400px",
//             margin: "0 auto",
//           }}
//         >
//           <h2>Confirm to change visibility</h2>
//           <p>
//             Are you sure you want to {isVisible ? "hide" : "show"} this data?
//           </p>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "flex-end",
//               marginTop: "20px",
//             }}
//           >
//             <button
//               style={{ marginRight: "10px" }}
//               className="btn btn-primary"
//               onClick={async () => {
//                 setLoading(true);
//                 const accessToken = localStorage.getItem("accessToken");
//                 try {
//                   await instance.put(
//                     `productdetails/isactive-productdetails/${id}`,
//                     { isVisible },
//                     {
//                       headers: {
//                         Authorization: `Bearer ${accessToken}`,
//                         "Content-Type": "application/json",
//                       },
//                     }
//                   );
//                   toast.success(
//                     `Data ${isVisible ? "hidden" : "shown"} successfully`
//                   );
//                   setEyeVisibilityById((prev) => ({
//                     ...prev,
//                     [id]: isVisible,
//                   }));
//                   fetchTeam();
//                 } catch (error) {
//                   console.error("Error updating visibility:", error);
//                   toast.error("Error updating visibility");
//                 } finally {
//         setLoading(false); // Set loading to false
//       }
//                 onClose();
//               }}
//             >
//               Yes
//             </button>
//             <button className="btn btn-secondary" onClick={() => onClose()}>
//               No
//             </button>
//           </div>
//         </div>
//       ),
//     });
//   };


//   const toggleEdit = (id) => {
//     const selectedMember = team.find((member) => member.id === id);
//     setEditingId(id);
//     setFormData(selectedMember);
//     setEditMode(true);
//     setShowTable(false); 
//   };
//   const handleAdd = () => {
//     setFormData({});
//     setEditMode(false);
//     setShowTable(false); // Switch to form view when adding new item
//   };

//   const handleView = () => {
//     setFormData({});
//     setEditMode(false);
//     setShowTable(true); // Switch to table view
//   };

//   return (
  

//     <Container fluid>
//     <Row>
//       <Col>
//         <Card>
//           <Card.Header>
//             <Row>
//               {showTable ? (
//                 <Col className="d-flex justify-content-end align-items-center">
//                 <SearchInput
//               searchQuery={searchQuery}
//               onSearch={handleSearch}
      
//               showExportButton={false}
//             />
//                   <Button
//                     variant="outline-success"
//                     onClick={handleAdd}
//                     className="ms-2 mb-3"
//                   >
//                     Add
//                   </Button>
//                 </Col>
//               ) : (
//                 <Col className="d-flex justify-content-end align-items-center">
//                   <Button   variant="outline-secondary" onClick={handleView}>
//                     View
//                   </Button>
//                 </Col>
//               )}
//             </Row>
//           </Card.Header>

//           <Card.Body>
//             {loading ? ( 
//               <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
//                 <ThreeDots  
//                   height="80"
//                   width="80"
//                   radius="9"
//                   color="#000"
//                   ariaLabel="three-dots-loading"
            
//                   visible={true}
//                 />
//               </div>
//             ) : showTable ? (
//               <DataTable
//                 columns={tableColumns(currentPage, rowsPerPage)}
//                 data={filteredData.length > 0 ? filteredData : team}
//                 pagination
//                 responsive
//                 striped
//                 noDataComponent="No Data Available"
//                 onChangePage={(page) => setCurrentPage(page)}
//                 onChangeRowsPerPage={(rowsPerPage) =>
//                   setRowsPerPage(rowsPerPage)
//                 }
//                 customStyles={{
//                     rows: {
//                       style: {
//                         alignItems: "flex-start", // Aligns text to the top-left corner
//                       },
//                     },
//                     cells: {
//                       style: {
//                         textAlign: "left", // Ensures text is aligned to the left
//                       },
//                     },
//                   }}
//               />
//             ) : (
//               <Form onSubmit={handleSubmit}>
//                 <Row>
     
//                   <Col md={6}>
//                     <NewReusableForm
//                       label="Product Name"
//                       placeholder="Enter Product Name"
//                       name="productName"
//                       type="text"
//                       onChange={handleChange}
//                       initialData={formData}
//                       error={errors.productName}
//                     />
//                   </Col>
//                   <Col md={12}>
//                     <NewReusableForm
//                       label="Product Description"
//                       placeholder="Enter Application"
//                       name="application"
//                       type="text"
//                       onChange={handleChange}
//                       initialData={formData}
//                       textarea
//                       useJodit={true}
//                       error={errors.application}
//                       // charLimit={1000}
//                     />
//                   </Col>
//                 </Row>
//                 <Row>
//                   <div className="mt-3 d-flex justify-content-end">
//                     <Button
//                       type="submit"
//                       variant={editMode ? "success" : "primary"}
//                     >
//                       {editMode ? "Update" : "Submit"}
//                     </Button>
//                   </div>
//                 </Row>
//               </Form>
//             )}
//           </Card.Body>
//         </Card>
//       </Col>
//     </Row>
//   </Container>
//   );
// };

// export default ProductDetails;


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
      name: <CustomHeader name="Image" />,
      cell: (row) => (
        <img
          src={row.img}
          alt="product details"
          style={{ width: "100px", height: "auto"}}
        />
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
  const validateForm = (formData) => {
    let errors = {};
    let isValid = true;

    if (!formData.img) {
      errors.img = "Image is required with 365x245 pixels";
      isValid = false;
    } else if (formData.img instanceof File && !validateImageSize(formData.img)) {
      errors.img = "Image is not 365x245 pixels";
      isValid = false;
    }
    if (!String(formData.productId)?.trim()) {
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
        if (img.width === 365 && img.height === 245) {
          resolve();
        } else {
          reject("Image is required with 365x245 pixels");
        }
      };
      img.onerror = () => reject("Error loading image");
      img.src = URL.createObjectURL(file);
    });
  };

  const fetchTeam = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await instance.get("productName/finddetails", {
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
      data.append("img", formData.img);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("productId", formData.productId);

      try {
        if (editMode) {
          await instance.put(`productName/updatedetails/${editingId}`, data, {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "multipart/form-data",
            },
          });
          toast.success("Updated successfully!");
        } else {
          await instance.post("productName/adddetails", data, {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "multipart/form-data",
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
      img: itemToEdit.img,
      title: itemToEdit.title,
      description: itemToEdit.description,
      productId: itemToEdit.productId,
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
              await instance.delete(`productName/isdeletedetails/${id}`, {
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
      .put(`productName/isactive/${id}`, { isActive }, {
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
          {/* <h4 className="text-center">Infrastructure Form</h4> */}
          {/* <Button variant="outline-success"

            className="ms-2 mb-3 d-flex justify-content-end " onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "Hide Form" : "Add Sub Product Details"}
          </Button> */}


          <div className="d-flex justify-content-end">
  <Button
    variant="outline-success"
    className="ms-2 mb-3"
    onClick={() => setShowForm((prev) => !prev)}
  >
    {showForm ? "Hide Form" : "Add Sub Product Details"}
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

              <Form.Group controlId="formTitle">
                <Form.Label>Sub Product Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Sub Product title"
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
                  label="Sub Product description"
                  placeholder="Enter Sub Product Description"
                  name="description"
                  type="text"
                  onChange={handleChange}
                  initialData={formData}
                  textarea
                  useJodit={true}
                  error={errors.description}
                />
              </Col>
              {/* <Form.Group controlId="formImage" className="mt-2">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => handleChange("img", e.target.files[0])}
                  isInvalid={!!errors.img}
                />
                <Form.Control.Feedback type="invalid">{errors.img}</Form.Control.Feedback>
              </Form.Group> */}
              <Col md={12}>
                <NewResuableForm
                      label={"Upload Sub Product Image"}
                      placeholder={"Upload Image"}
                      name={"img"}
                      type={"file"}
                      onChange={handleChange}
                      initialData={formData}
                      error={errors.img}
                      imageDimensiion="Image must be 365*245 pixels" 
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
        <Col md={12}>
          {/* <h4 className="text-center">Infrastructure List</h4> */}
          {loading ? (
            <div className="d-flex justify-content-center mt-5">
              <ThreeDots color="#00BFFF" height={80} width={80} />
            </div>
          ) : (
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                
                  <th>Sr. No.</th>
                  <th>Product Name</th>
                  <th>Sub Product Title</th>
                  <th>Sub Product Description</th>
                  <th> Image</th>
                  
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {team.map((row, index) => (
                  <tr key={row.id}>
                    <td>{index + 1}</td>
                    <td>{row.ProductName.productName}</td>
                    <td>{row.title}</td>
                    <td>{row.description}</td>
                    {/* <td
                      dangerouslySetInnerHTML={{
                        __html: row.description,
                      }}
                    ></td> */}
                    
                    <td>
                      <img
                        src={row.img}
                        alt="Infrastructure"
                        style={{ width: "100px", height: "auto" }}
                      />
                    </td>
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
