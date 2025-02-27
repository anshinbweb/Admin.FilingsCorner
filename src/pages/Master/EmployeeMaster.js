import React, { useState, useEffect, useContext } from "react";
import {
    Input,
    Label,
    Card,
    CardBody,
    CardHeader,
    Col,
    Form,
    Container,
    Row,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DataTable from "react-data-table-component";
import axios from "axios";
import DeleteModal from "../../Components/Common/DeleteModal";
import FormsHeader from "../../Components/Common/FormsHeader";
import FormsFooter from "../../Components/Common/FormAddFooter";
import { AuthContext } from "../../context/AuthContext";
import { createEmployeeMaster, deleteEmployeeMaster, getEmployeeMaster, updateEmployeeMaster } from "../../functions/Master/employeeMaster";
import Flatpickr from "react-flatpickr"

const EmployeeMaster = () => {

    const { adminData, setAdminData } = useContext(AuthContext);

    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [filter, setFilter] = useState(true);
    const [_id, set_Id] = useState("");

    const initialState = {
        firstName:"",
        lastName:"",
        email:"",
        department:"",
        photo:"",
        password:"",
        phone:"",
        dateOfJoining:"",
        currentSalary:"",
        isActive: false,
    };

    const [remove_id, setRemove_id] = useState("");

    //search and pagination state
    const [query, setQuery] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [values, setValues] = useState(initialState);

    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [pageNo, setPageNo] = useState(0);
    const [column, setcolumn] = useState();
    const [sortDirection, setsortDirection] = useState();
    const [showForm, setShowForm] = useState(false);
    const [updateForm, setUpdateForm] = useState(false);
    const [data, setData] = useState([]);

    const columns = [
        {
            name: "Employee Photo",
            selector: (row) => <div>
            <img
                src={`${process.env.REACT_APP_API_URL_COFFEE}/${row.photo}`}
                style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                }}
                alt="Employee"
            />
        </div>,
            sortable: false,
            minWidth: "150px",
        },
        {
            name: "First Name",
            selector: (row) => row.firstName,
            sortable: true,
            sortField: "row.firstName",
            minWidth: "150px",
        },
        {
            name: "Last Name",
            selector: (row) => row.lastName,
            sortable: true,
            sortField: "row.lastName",
            minWidth: "150px",
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
            sortField: "row.email",
            minWidth: "150px",
        },
        {
            name: "Department",
            selector: (row) => row.department,
            sortable: true,
            sortField: "row.department",
            minWidth: "150px",
        },
        {
          name: "Action",
          selector: (row) => {
            return (
              <React.Fragment>
                <div className="d-flex gap-2">
                  <div className="edit">
                    <button
                      className="btn btn-sm btn-success edit-item-btn "
                      data-bs-toggle="modal"
                      data-bs-target="#showModal"
                      onClick={() => handleTog_edit(row._id)}
                    >
                      Edit
                    </button>
                  </div>

                  <div className="remove">
                    <button
                      className="btn btn-sm btn-danger remove-item-btn"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteRecordModal"
                      onClick={() => tog_delete(row._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </React.Fragment>
            );
          },
          sortable: false,
          minWidth: "180px",
        },
    ];

    useEffect(() => {
        fetchEmployeeMaster();
    }, [pageNo, perPage, column, sortDirection, query, filter]);

    const fetchEmployeeMaster = async () => {
        setLoading(true);
        let skip = (pageNo - 1) * perPage;
        if (skip < 0) {
            skip = 0;
        }

        await axios
            .post(
                `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/listbyparams/employee-master/${adminData?.data?._id}`,
                {
                    skip: skip,
                    per_page: perPage,
                    sorton: column,
                    sortdir: sortDirection,
                    match: query,
                    isActive: filter,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            )
            .then((response) => {
                if (response.data.length > 0) {
                    let res = response.data[0].data;
                    setLoading(false);
                    setData(res);
                    setTotalRows(res.count);
                } else {
                    setData([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });

        setLoading(false);
    };

    const validate = (values) => {
        const errors = {};
        if (!values.firstName) {
            errors.firstName = "First Name is required";
        }
        if (!values.lastName) {
            errors.lastName = "Last Name is required";
        }
        if (!values.email) {
            errors.email = "Email is required";
        }
        if (!values.password) {
            errors.password = "Password is required";
        }
        if (!values.department) {
            errors.department = "Department is required";
        }
        if (!values.phone) {
            errors.phone = "Phone is required";
        }
        if (!values.dateOfJoining) {
            errors.dateOfJoining = "Date of Joining is required";
        }
        if (!values.currentSalary) {
            errors.currentSalary = "Current Salary is required";
        }
        return errors;
    };

    const handleClick = (e) => {
        e.preventDefault();
        let errors = validate(values);
        setFormErrors(errors);
        setIsSubmit(true);

        if(Object.keys(errors).length === 0) {
            const formdata = new FormData();
            
            for (const key in values) {
                formdata.append(key, values[key]);
            }

            formdata.append("companyDetailsId", adminData?.data?._id);

            createEmployeeMaster(formdata)
                .then((res) => {
                    setShowForm(false);
                    setValues(initialState);
                    setCheckImagePhoto(false);
                    setPhoto("");
                    setIsSubmit(false);
                    setFormErrors({});
                    fetchEmployeeMaster();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const [modal_delete, setmodal_delete] = useState(false);

    const tog_delete = (_id) => {
        setmodal_delete(!modal_delete);
        setRemove_id(_id);
    };

    const handlecheck = (e) => {
        setValues({ ...values, isActive: e.target.checked });
    };

    const [modal_list, setModalList] = useState(false);

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            console.log("no errors");
        }
    }, [formErrors, isSubmit]);

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const tog_list = () => {
        setModalList(!modal_list);
        setIsSubmit(false);
    };

    const handleDelete = (e) => {
        e.preventDefault();
        deleteEmployeeMaster(remove_id)
            .then((res) => {
                setmodal_delete(!modal_delete);
                fetchEmployeeMaster();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleDeleteClose = (e) => {
        e.preventDefault();
        setmodal_delete(false);
    };

    const handleUpdate = (e) => {
        e.preventDefault();

        let errors = validate(values);
        setFormErrors(errors);
        setIsSubmit(true);
        if (Object.keys(errors).length === 0) {
            
            const dataToSend = {
                ...values,
                updatedPhoto:updatedPhoto,
                isActive: values.isActive,
            }

            Object.entries(removedImages).forEach(([key, value]) => {
                if (value) {
                    dataToSend[`remove${key}`] = true;
                }
            });

            const formdata = new FormData();

            for (const key in dataToSend) {
                formdata.append(key, dataToSend[key]);
            }
            updateEmployeeMaster(_id, formdata)
                .then((res) => {
                    setUpdateForm(false);
                    setShowForm(false);
                    setValues(initialState);
                    setPhoto("")
                    setCheckImagePhoto(false)
                    setIsSubmit(false);
                    setFormErrors({});
                    fetchEmployeeMaster();
                    setRemovedImages({
                        photo:false
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const handleAddCancel = (e) => {
        e.preventDefault();
        setIsSubmit(false);
        setShowForm(false);
        setUpdateForm(false);
        setValues(initialState);
        setCheckImagePhoto(false);
        setPhoto("");
        setFormErrors({});
    };

    const handleUpdateCancel = (e) => {
        e.preventDefault();
        setIsSubmit(false);
        setShowForm(false);
        setUpdateForm(false);
        setValues(initialState);
        setCheckImagePhoto(false)
        setPhoto("")
        setFormErrors({});
    };

    const handleTog_edit = (_id) => {
        setIsSubmit(false);
        setUpdateForm(true);
        set_Id(_id);
        setFormErrors(false);
        getEmployeeMaster(_id)
            .then((res) => {
                console.log(res)
                setValues(res.employee);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSort = (column, sortDirection) => {
        setcolumn(column.sortField);
        setsortDirection(sortDirection);
    };

    const handlePageChange = (page) => {
        setPageNo(page);
    };
    const [photo, setPhoto] = useState("");

    const [updatedPhoto, setUpdatedPhoto] = useState(null);

    const [removedImages, setRemovedImages] = useState({
        photo:false
      });

    const [checkImagePhoto, setCheckImagePhoto] = useState(false);

    const handleRemoveImage = (imageType) => {
        setRemovedImages(prev => ({...prev, [imageType]: true}));
        
        switch(imageType) {
            case 'photo':
                setPhoto("");
                setCheckImagePhoto(false)
                setUpdatedPhoto(null)
                break;
            default:
                break;
        }
        
        setValues(prev => ({
            ...prev,
            [imageType]: null
        }));
    };

    const PhotoUpload = (e) => {
        if (e.target.files.length > 0) {
            let imageurl = URL.createObjectURL(e.target.files[0]);

            if(e.target.name === "photo") {
                if(updateForm){
                    setUpdatedPhoto(e.target.files[0]);
                }
                setPhoto(imageurl);
                setCheckImagePhoto(true);
                setRemovedImages(prev => ({...prev, photo: false}));
            } 

            if(!updateForm){
                setValues({ ...values, [e.target.name]: e.target.files[0] });
            }
        }
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
    };

    const handleFilter = (e) => {
        setFilter(e.target.checked);
    };

    document.title = "Employee Master | Project Name";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb
                        maintitle="Employee Master"
                        title="Employee Master"
                        pageTitle="Employee"
                    />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <FormsHeader
                                        formName="Employee Master"
                                        filter={filter}
                                        handleFilter={handleFilter}
                                        tog_list={tog_list}
                                        setQuery={setQuery}
                                        initialState={initialState}
                                        setValues={setValues}
                                        updateForm={updateForm}
                                        showForm={showForm}
                                        setShowForm={setShowForm}
                                        setUpdateForm={setUpdateForm}
                                    />
                                </CardHeader>

                                {/* ADD FORM  */}
                                <div
                                style={{
                                    display: showForm && !updateForm ? "block" : "none",
                                }}
                                >
                                <CardBody>
                                    <React.Fragment>
                                    <Col xxl={12}>
                                        <Card className="">
                                        <CardBody>
                                            <div className="live-preview">
                                            <Form>
                                                <Row>
                                                <Row>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter First Name"
                                                                required
                                                                name="firstName"
                                                                value={values.firstName}
                                                                onChange={handleChange}
                                                            />
                                                                <label
                                                                    htmlFor="role-field"
                                                                    className="form-label"
                                                                >
                                                                    First Name
                                                                    <span className="text-danger"> *</span>
                                                                </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.firstName}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Last Name"
                                                                required
                                                                name="lastName"
                                                                value={values.lastName}
                                                                onChange={handleChange}
                                                            />
                                                            <label
                                                                htmlFor="role-field"
                                                                className="form-label"
                                                            >
                                                                Last Name
                                                                <span className="text-danger"> *</span>
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.lastName}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Email"
                                                                required
                                                                name="email"
                                                                value={values.email}
                                                                onChange={handleChange}
                                                            />
                                                            <label
                                                                htmlFor="role-field"
                                                                className="form-label"
                                                            >
                                                                Email
                                                                <span className="text-danger"> *</span>
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.email}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Password"
                                                                required
                                                                name="password"
                                                                value={values.password}
                                                                onChange={handleChange}
                                                            />
                                                            <label
                                                                htmlFor="role-field"
                                                                className="form-label"
                                                            >
                                                                Password
                                                                <span className="text-danger"> *</span>
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.password}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <Input
                                                                type="select"
                                                                className="form-control"
                                                                name="department"
                                                                value={values.department}
                                                                onChange={handleChange}
                                                            >
                                                                <option selected={true} disabled value="">
                                                                    <label
                                                                    htmlFor="role-field"
                                                                    className="form-label"
                                                                    >
                                                                        Department
                                                                        <span className="text-danger"> *</span>
                                                                    </label>
                                                                </option>
                                                                <option key={1} value={"HR"}>
                                                                        HR
                                                                </option>
                                                                <option key={2} value={"Developer"}>
                                                                        Developer
                                                                </option>
                                                                <option key={3} value={"Sales"}>
                                                                        Sales
                                                                </option>
                                                                <option key={4} value={"Marketing"}>
                                                                        Marketing
                                                                </option>
                                                                <option key={5} value={"Finance"}>
                                                                        Finance
                                                                </option>
                                                                <option key={6} value={"Executive"}>
                                                                        Executive
                                                                </option>
                                                            </Input>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.department}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Phone No."
                                                                required
                                                                name="phone"
                                                                value={values.phone}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Phone No.
                                                                <span className="text-danger"> *</span>
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.phone}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <Flatpickr
                                                                value={values.dateOfJoining}
                                                                onChange={(date) => {
                                                                    setValues({
                                                                        ...values,
                                                                        dateOfJoining: date[0],
                                                                    });
                                                                }}
                                                                options={{
                                                                    altInput: true,
                                                                    altFormat: "F j, Y",
                                                                    dateFormat: "Y-m-d",
                                                                }}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Date of Joining
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.dateOfJoining}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Current Salary"
                                                                required
                                                                name="currentSalary"
                                                                value={values.currentSalary}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                current Salary
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.currentSalary}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={3}>
                                                        <label>
                                                            Photo
                                                        </label>
                                                        <input
                                                            type="file"
                                                            name="photo"
                                                            className="form-control"
                                                            accept=".jpg, .jpeg, .png"
                                                            onChange={PhotoUpload}
                                                        />
                                                        {isSubmit && (
                                                            <p className="text-danger">
                                                                {formErrors.photo}
                                                            </p>
                                                        )}
                                                        {!removedImages.photo && (
                                                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                                                {(checkImagePhoto || values.photo) && (
                                                                    <button
                                                                        onClick={() => handleRemoveImage('photo')}
                                                                        style={{
                                                                            position: 'absolute',
                                                                            top: '5px',
                                                                            right: '5px',
                                                                            backgroundColor: 'white',
                                                                            border: '1px solid #EF4444',
                                                                            color: '#EF4444',
                                                                            borderRadius: '50%',
                                                                            width: '24px',
                                                                            height: '24px',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                                                                            zIndex: 10,
                                                                            cursor: 'pointer'
                                                                        }}
                                                                        type="button"
                                                                        aria-label="Remove image"
                                                                    >
                                                                        X
                                                                    </button>
                                                                )}
                                                        {checkImagePhoto ? (
                                                            <img
                                                                className="m-2"
                                                                src={photo}
                                                                alt="Profile"
                                                                width="180"
                                                                height="200"
                                                            />
                                                        ) :null}
                                                    </div>
                                                        )}
                                                    </Col>
                                                </Row>

                                                <div className="mt-5">
                                                    <Col lg={6}>
                                                    <div className="form-check mb-2">
                                                        <Input
                                                        type="checkbox"
                                                        name="isActive"
                                                        value={values.isActive}
                                                        onChange={handlecheck}
                                                        checked={values.isActive}
                                                        />
                                                        <Label
                                                        className="form-check-label"
                                                        htmlFor="activeCheckBox"
                                                        >
                                                        Is Active
                                                        </Label>
                                                    </div>
                                                    </Col>
                                                </div>

                                                <Col lg={12}>
                                                <FormsFooter
                                                    handleSubmit={handleClick}
                                                    handleSubmitCancel={handleAddCancel}
                                                    />
                                                </Col>
                                                </Row>
                                            </Form>
                                            </div>
                                        </CardBody>{" "}
                                        </Card>
                                    </Col>
                                    </React.Fragment>
                                </CardBody>
                                </div>

                                {/* UPDATE FORM  */}
                                <div
                                style={{
                                    display: !showForm && updateForm ? "block" : "none",
                                }}
                                >
                                <CardBody>
                                    <React.Fragment>
                                    <Col xxl={12}>
                                        <Card className="">
                                        <CardBody>
                                            <div className="live-preview">
                                            <Form>
                                                <Row>

                                                <Row>
                                                <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter First Name"
                                                                required
                                                                name="firstName"
                                                                value={values.firstName}
                                                                onChange={handleChange}
                                                            />
                                                                <label
                                                                    htmlFor="role-field"
                                                                    className="form-label"
                                                                >
                                                                    First Name
                                                                    <span className="text-danger"> *</span>
                                                                </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.firstName}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Last Name"
                                                                required
                                                                name="lastName"
                                                                value={values.lastName}
                                                                onChange={handleChange}
                                                            />
                                                            <label
                                                                htmlFor="role-field"
                                                                className="form-label"
                                                            >
                                                                Last Name
                                                                <span className="text-danger"> *</span>
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.lastName}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Email"
                                                                required
                                                                name="email"
                                                                value={values.email}
                                                                onChange={handleChange}
                                                            />
                                                            <label
                                                                htmlFor="role-field"
                                                                className="form-label"
                                                            >
                                                                Email
                                                                <span className="text-danger"> *</span>
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.email}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <Input
                                                                type="select"
                                                                className="form-control"
                                                                name="department"
                                                                value={values.department}
                                                                onChange={handleChange}
                                                            >
                                                                <option selected={true} disabled value="">
                                                                    <label
                                                                    htmlFor="role-field"
                                                                    className="form-label"
                                                                    >
                                                                        Department
                                                                        <span className="text-danger"> *</span>
                                                                    </label>
                                                                </option>
                                                                <option key={1} value={"HR"}>
                                                                        HR
                                                                </option>
                                                                <option key={2} value={"Developer"}>
                                                                        Developer
                                                                </option>
                                                                <option key={3} value={"Sales"}>
                                                                        Sales
                                                                </option>
                                                                <option key={4} value={"Marketing"}>
                                                                        Marketing
                                                                </option>
                                                                <option key={5} value={"Finance"}>
                                                                        Finance
                                                                </option>
                                                                <option key={6} value={"Executive"}>
                                                                        Executive
                                                                </option>
                                                            </Input>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.department}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Phone No."
                                                                required
                                                                name="phone"
                                                                value={values.phone}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Phone No.
                                                                <span className="text-danger"> *</span>
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.phone}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <Flatpickr
                                                                    value={values.dateOfJoining}
                                                                    onChange={(date) => {
                                                                        setValues({
                                                                            ...values,
                                                                            dateOfJoining: date[0],
                                                                        });
                                                                    }}
                                                                    options={{
                                                                        altInput: true,
                                                                        altFormat: "F j, Y",
                                                                        dateFormat: "Y-m-d",
                                                                    }}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Date of Joining
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.dateOfJoining}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Current Salary"
                                                                required
                                                                name="currentSalary"
                                                                value={values.currentSalary}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                current Salary
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.currentSalary}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                </Row>
                                                
                                                <Row>
                                                <Col lg={3}>
                                                        <label>
                                                            Photo
                                                        </label>
                                                        <input
                                                            type="file"
                                                            name="photo"
                                                            className="form-control"
                                                            accept=".jpg, .jpeg, .png"
                                                            onChange={PhotoUpload}
                                                        />
                                                        {isSubmit && (
                                                            <p className="text-danger">
                                                                {formErrors.photo}
                                                            </p>
                                                        )}
                                                        {!removedImages.photo && (
                                                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                                                {(checkImagePhoto || values.photo) && (
                                                                    <button
                                                                        onClick={() => handleRemoveImage('photo')}
                                                                        style={{
                                                                            position: 'absolute',
                                                                            top: '5px',
                                                                            right: '5px',
                                                                            backgroundColor: 'white',
                                                                            border: '1px solid #EF4444',
                                                                            color: '#EF4444',
                                                                            borderRadius: '50%',
                                                                            width: '24px',
                                                                            height: '24px',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                                                                            zIndex: 10,
                                                                            cursor: 'pointer'
                                                                        }}
                                                                        type="button"
                                                                        aria-label="Remove image"
                                                                    >
                                                                        X
                                                                    </button>
                                                                )}
                                                        {checkImagePhoto ? (
                                                            <img
                                                                className="m-2"
                                                                src={photo}
                                                                alt="Profile"
                                                                width="180"
                                                                height="200"
                                                            />
                                                        ) : values.photo ? (
                                                            <img
                                                                className="m-2"
                                                                src={`${process.env.REACT_APP_API_URL_COFFEE}/${values.photo}`}
                                                                alt="Profile"
                                                                width="180"
                                                                height="200"
                                                            /> ): null}
                                                    </div>
                                                        )}
                                                    </Col>
                                                </Row>

                                                <div className="mt-5">
                                                    <Col lg={6}>
                                                    <div className="form-check mb-2">
                                                        <Input
                                                        type="checkbox"
                                                        name="isActive"
                                                        value={values.isActive}
                                                        onChange={handlecheck}
                                                        checked={values.isActive}
                                                        />
                                                        <Label
                                                        className="form-check-label"
                                                        htmlFor="activeCheckBox"
                                                        >
                                                        Is Active
                                                        </Label>
                                                    </div>
                                                    </Col>
                                                </div>

                                                <Col lg={12}>
                                                    <div className="text-end">
                                                    <button
                                                        type="submit"
                                                        className=" btn btn-success m-1"
                                                        id="add-btn"
                                                        onClick={handleUpdate}
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger m-1"
                                                        onClick={handleUpdateCancel}
                                                    >
                                                        Cancel
                                                    </button>
                                                    </div>
                                                </Col>
                                                </Row>
                                            </Form>
                                            </div>
                                        </CardBody>
                                        </Card>
                                    </Col>
                                    </React.Fragment>
                                </CardBody>
                                </div>

                                {/* list */}
                                <div
                                    style={{
                                        display:
                                            showForm || updateForm
                                                ? "none"
                                                : "block",
                                    }}
                                >
                                    <CardBody>
                                        <div>
                                            <div className="table-responsive table-card mt-1 mb-1 text-right">
                                                <DataTable
                                                    columns={columns}
                                                    data={data}
                                                    progressPending={loading}
                                                    sortServer
                                                    onSort={(
                                                        column,
                                                        sortDirection,
                                                        sortedRows
                                                    ) => {
                                                        handleSort(
                                                            column,
                                                            sortDirection
                                                        );
                                                    }}
                                                    pagination
                                                    paginationServer
                                                    paginationTotalRows={
                                                        totalRows
                                                    }
                                                    paginationRowsPerPageOptions={[
                                                        10,
                                                        50,
                                                        100,
                                                        totalRows,
                                                    ]}
                                                    onChangeRowsPerPage={
                                                        handlePerRowsChange
                                                    }
                                                    onChangePage={
                                                        handlePageChange
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </CardBody>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            <DeleteModal
                show={modal_delete}
                handleDelete={handleDelete}
                toggle={handleDeleteClose}
                setmodal_delete={setmodal_delete}
            />
        </React.Fragment>
    );
};

export default EmployeeMaster;
