import React, { useState, useEffect } from "react";
import {
    Input,
    Label,
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Form,
    Container,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DataTable from "react-data-table-component";
import axios from "axios";

import {
    createProductsDetails,
    getProductsDetails,
    removeProductsDetails,
    updateProductsDetails,
} from "../../functions/Products/ProductsDetails";
import { listCategory } from "../../functions/Category/CategoryMaster";
import DeleteModal from "../../Components/Common/DeleteModal";
import FormsHeader from "../../Components/Common/FormsHeader";
import FormsFooter from "../../Components/Common/FormAddFooter";
import { createCompanyMaster, getCompantMaster, removeCompanyMaster, updateCompanyMaster } from "../../functions/Master/companyMaster";
import { getCityByState, getStateByCountry, listCountry } from "../../functions/Location/Location";

const CompanyMaster = () => {
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [filter, setFilter] = useState(true);
    const [_id, set_Id] = useState("");

    const initialState = {
        CompanyName: "",
        EmailID_Company:"",
        Password:"",
        ContactPersonName: "",
        CountryID: "",
        StateID: "",
        City: "",
        Address: "",
        Pincode: "",
        ContactNo_Sales: "",
        ContactNo_Support: "",
        ContactNo_Office: "",
        EmailID_Office: "",
        EmailID_Support: "",
        EmailID_Sales: "",
        Website1: "",
        Website2: "",
        Favicon: "",
        Icon: "",
        Logo: "",
        DigitalSignature: "",
        GSTNo: "",
        IsActive: false,
    };

    const [remove_id, setRemove_id] = useState("");

    //search and pagination state
    const [query, setQuery] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [values, setValues] = useState(initialState);

    const {
        CompanyName,
        ContactPersonName,
        CountryID,
        StateID,
        City,
        Address,
        Pincode,
        ContactNo_Sales,
        ContactNo_Support,
        ContactNo_Office,
        EmailID_Office,
        EmailID_Support,
        EmailID_Sales,
        Website1,
        Website2,
        Favicon,
        Icon,
        Logo,
        DigitalSignature,
        GSTNo,
        IsActive,
    } = values;

    const [country,setCountry] = useState("")
    const [state,setState]=useState("");
    const [city, setCity] = useState("")

    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);

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
            name: "Company Logo",
            selector: (row) => <div>
            <img
                src={`${process.env.REACT_APP_API_URL_COFFEE}/${row.Logo}`}
                style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                }}
                alt="Brand Logo"
            />
        </div>,
            sortable: false,
            minWidth: "150px",
        },
        {
            name: "Company Name",
            selector: (row) => row.CompanyName,
            sortable: true,
            sortField: "row.CompanyName",
            minWidth: "150px",
        },
        {
            name: "Office Email",
            selector: (row) => row.EmailID_Office,
            sortable: true,
            sortField: "row.EmailID_Office",
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

    const getCountries = async () => {
        listCountry().then((res) => setCountryList(res));
    }

    const getState = async (countryId) => {
        getStateByCountry(countryId).then((res) => setStateList(res));
    }

    const getCity = async (stateId) => {
        getCityByState(stateId).then((res) => setCityList(res));
    }

    useEffect(()=>{
        getCountries();
    },[])

    useEffect(()=>{
        if(country){
            getState(country);
        }
    },[country])

    useEffect(()=>{
        if(state){
            getCity(state);
        }
    },[state])

    useEffect(() => {
        fetchCompanyMaster();
    }, [pageNo, perPage, column, sortDirection, query, filter]);

    const fetchCompanyMaster = async () => {
        setLoading(true);
        let skip = (pageNo - 1) * perPage;
        if (skip < 0) {
            skip = 0;
        }

        await axios
            .post(
                `${process.env.REACT_APP_API_URL_COFFEE}/api/listbyparams/company-master`,
                {
                    skip: skip,
                    per_page: perPage,
                    sorton: column,
                    sortdir: sortDirection,
                    match: query,
                    IsActive: filter,
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
                    let res = response.data[0];
                    setLoading(false);
                    setData(res.data);
                    setTotalRows(res.count);
                } else if (response.data.length === 0) {
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
        if (!values.CompanyName) {
            errors.companyName = "Company Name is required";
        }
        if (!values.ContactPersonName) {
            errors.contactPersonName = "Contact Person Name is required";
        }
        if (!values.EmailID_Company) {
            errors.EmailID_Company = "Company Email is required";
        }
        if (!values.Password) {
            errors.Password = "Password is required";
        }
        if (!country) {
            errors.CountryID = "Country is required";
        }
        if (!state) {
            errors.StateID = "State is required";
        }
        if (!city) {
            errors.City = "City is required";
        }
        if (!values.Address) {
            errors.Address = "Address is required";
        }
        if (!values.Pincode) {
            errors.Pincode = "Pincode is required";
        }
        if (!values.ContactNo_Sales) {
            errors.ContactNo_Sales = "Contact No. (Sales) is required";
        }
        if (!values.EmailID_Office) {
            errors.EmailID_Office = "Email ID (Office) is required";
        }
        if (!values.Website1) {
            errors.Website1 = "Website 1 is required";
        }

        return errors;
    };

    const handleClick = (e) => {
        e.preventDefault();
        let errors = validate(values);
        setFormErrors(errors);
        setIsSubmit(true);

        const dataToSend = {
            ...values,
            CountryID: country,
            StateID: state,
            City: city,
        }

        if(Object.keys(errors).length === 0) {
            const formdata = new FormData();
            console.log(formdata)
            for (const key in dataToSend) {
                formdata.append(key, dataToSend[key]);
            }

            createCompanyMaster(formdata)
                .then((res) => {
                    setShowForm(false);
                    setValues(initialState);
                    setCheckImageFavicon(false);
                    setCheckImageIcon(false);
                    setCheckImageLogo(false);
                    setCheckImageDigitalSignature(false);
                    setFavicon("");
                    setIcon("");
                    setLogo("");
                    setDigitalSignature("");
                    setIsSubmit(false);
                    setFormErrors({});
                    fetchCompanyMaster();
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
        setValues({ ...values, IsActive: e.target.checked });
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
        removeCompanyMaster(remove_id)
            .then((res) => {
                setmodal_delete(!modal_delete);
                fetchCompanyMaster();
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
                CountryID: country,
                StateID: state,
                City: city,
                FaviconUpdated: updatedFavicon,
                IconUpdated: updatedIcon,
                LogoUpdated: updatedLogo,
                DigitalSignatureUpdated: updatedDigitalSignature,
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
            console.log("data : ",formdata)
            updateCompanyMaster(_id, formdata)
                .then((res) => {
                    setUpdateForm(false);
                    setShowForm(false);
                    setValues(initialState);
                    setCheckImageFavicon(false);
                    setCheckImageIcon(false);
                    setCheckImageLogo(false);
                    setCheckImageDigitalSignature(false);
                    setFavicon("");
                    setIcon("");
                    setLogo("");
                    setDigitalSignature("");
                    setIsSubmit(false);
                    setFormErrors({});
                    fetchCompanyMaster();
                    setRemovedImages({
                        Favicon: false,
                        Icon: false,
                        Logo: false,
                        DigitalSignature: false
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
        setCheckImageFavicon(false);
        setCheckImageIcon(false);
        setCheckImageLogo(false);
        setCheckImageDigitalSignature(false);
        setFavicon("");
        setIcon("");
        setLogo("");
        setDigitalSignature("");
        setFormErrors({});
    };

    const handleUpdateCancel = (e) => {
        e.preventDefault();
        setIsSubmit(false);
        setShowForm(false);
        setUpdateForm(false);
        setValues(initialState);
        setCheckImageFavicon(false);
        setCheckImageIcon(false);
        setCheckImageLogo(false);
        setCheckImageDigitalSignature(false);
        setFavicon("");
        setIcon("");
        setLogo("");
        setDigitalSignature("");
        setFormErrors({});
    };

    const handleTog_edit = (_id) => {
        setIsSubmit(false);
        setUpdateForm(true);

        set_Id(_id);
        console.log(_id);
        setFormErrors(false);
        getCompantMaster(_id)
            .then((res) => {
                setValues(res.data);
                setCountry(res.data.CountryID);
                setState(res.data.StateID);
                setCity(res.data.City);
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

    const [favicon, setFavicon] = useState("");
    const [icon, setIcon] = useState("");
    const [logo, setLogo] = useState("");
    const [digitalSignature, setDigitalSignature] = useState("");

    const [updatedFavicon, setUpdatedFavicon] = useState(null);
    const [updatedIcon, setUpdatedIcon] = useState(null);
    const [updatedLogo, setUpdatedLogo] = useState(null);
    const [updatedDigitalSignature, setUpdatedDigitalSignature] = useState(null);

    const [removedImages, setRemovedImages] = useState({
        Favicon: false,
        Icon: false,
        Logo: false,
        DigitalSignature: false
      });

    const [checkImageFavicon, setCheckImageFavicon] = useState(false);
    const [checkImageIcon, setCheckImageIcon] = useState(false);
    const [checkImageLogo, setCheckImageLogo] = useState(false);
    const [checkImageDigitalSignature, setCheckImageDigitalSignature] = useState(false);

    const handleRemoveImage = (imageType) => {
        setRemovedImages(prev => ({...prev, [imageType]: true}));
        
        switch(imageType) {
            case 'Favicon':
                setFavicon("");
                setCheckImageFavicon(false);
                setUpdatedFavicon(null);
                break;
            case 'Icon':
                setIcon("");
                setCheckImageIcon(false);
                setUpdatedIcon(null);
                break;
            case 'Logo':
                setLogo("");
                setCheckImageLogo(false);
                setUpdatedLogo(null);
                break;
            case 'DigitalSignature':
                setDigitalSignature("");
                setCheckImageDigitalSignature(false);
                setUpdatedDigitalSignature(null);
                break;
            default:
                break;
        }
        
        // Clear the value in form data
        setValues(prev => ({
            ...prev,
            [imageType]: null
        }));
    };

    const PhotoUpload = (e) => {
        if (e.target.files.length > 0) {
            let imageurl = URL.createObjectURL(e.target.files[0]);

            console.log(e.target.name)
            if(e.target.name === "Favicon") {
                if(updateForm){
                    setUpdatedFavicon(e.target.files[0]);
                }
                setFavicon(imageurl);
                setCheckImageFavicon(true);
                setRemovedImages(prev => ({...prev, Favicon: false}));
            } else if(e.target.name === "Icon") {
                if(updateForm){
                    setUpdatedIcon(e.target.files[0]);
                }
                setIcon(imageurl);
                setCheckImageIcon(true);
                setRemovedImages(prev => ({...prev, Icon: false}));
            }
            else if(e.target.name === "Logo") {
                if(updateForm){
                    setUpdatedLogo(e.target.files[0]);
                }
                setLogo(imageurl);
                setCheckImageLogo(true);
                setRemovedImages(prev => ({...prev, Logo: false}));
            }
            else if(e.target.name === "DigitalSignature") {
                if(updateForm){
                    setUpdatedDigitalSignature(e.target.files[0]);
                }
                setDigitalSignature(imageurl);
                setCheckImageDigitalSignature(true);
                setRemovedImages(prev => ({...prev, DigitalSignature: false}));
            }
            if(!updateForm){
                console.log("first")
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

    document.title = "Company Master | Project Name";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb
                        maintitle="Company Master"
                        title="Company Master"
                        pageTitle="Company Master"
                    />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <FormsHeader
                                        formName="Company Master"
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
                                                                placeholder="Enter Company name"
                                                                required
                                                                name="CompanyName"
                                                                value={values.CompanyName}
                                                                onChange={handleChange}
                                                            />
                                                                <label
                                                                    htmlFor="role-field"
                                                                    className="form-label"
                                                                >
                                                                    Company name
                                                                    <span className="text-danger"> *</span>
                                                                </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.companyName}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Contact Person Name"
                                                                required
                                                                name="ContactPersonName"
                                                                value={values.ContactPersonName}
                                                                onChange={handleChange}
                                                            />
                                                            <label
                                                                htmlFor="role-field"
                                                                className="form-label"
                                                            >
                                                                Contact Person Name
                                                                <span className="text-danger"> *</span>
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.contactPersonName}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Contact Person Name"
                                                                required
                                                                name="EmailID_Company"
                                                                value={values.EmailID_Company}
                                                                onChange={handleChange}
                                                            />
                                                            <label
                                                                htmlFor="role-field"
                                                                className="form-label"
                                                            >
                                                                Company Email
                                                                <span className="text-danger"> *</span>
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.EmailID_Company}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Contact Person Name"
                                                                required
                                                                name="Password"
                                                                value={values.Password}
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
                                                                    {formErrors.Password}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={2}>
                                                        <div className="form-floating mb-3">
                                                            <Input
                                                                type="select"
                                                                className="form-control"
                                                                name="country"
                                                                value={country}
                                                                onChange={(e)=>{
                                                                    setCountry(e.target.value)
                                                                }}
                                                            >
                                                                <option selected={true} disabled value="">
                                                                    <label
                                                                    htmlFor="role-field"
                                                                    className="form-label"
                                                                    >
                                                                        Country
                                                                        <span className="text-danger"> *</span>
                                                                    </label>
                                                                </option>
                                                                {countryList.map((country) => (
                                                                    <option key={country._id} value={country._id}>
                                                                        {country.CountryName}
                                                                    </option>
                                                                ))}
                                                            </Input>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.CountryID}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={2}>
                                                        <div className="form-floating mb-3">
                                                            <Input
                                                                type="select"
                                                                className="form-control"
                                                                name="state"
                                                                value={state}
                                                                onChange={(e) => {
                                                                    setState(e.target.value);
                                                                }}
                                                            >
                                                                <option selected={true} disabled value="">
                                                                    <label
                                                                    htmlFor="role-field"
                                                                    className="form-label"
                                                                    >
                                                                        State
                                                                        <span className="text-danger"> *</span>
                                                                    </label>
                                                                </option>
                                                                {stateList.map((state) => (
                                                                    <option key={state._id} value={state._id}>
                                                                        {state.StateName}
                                                                    </option>
                                                                ))}
                                                            </Input>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.StateID}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={2}>
                                                        <div className="form-floating mb-3">
                                                            <Input
                                                                type="select"
                                                                className="form-control"
                                                                name="city"
                                                                value={city}
                                                                onChange={(e) => {
                                                                    setCity(e.target.value);
                                                                }}
                                                            >
                                                                <option selected={true} disabled value="">
                                                                    <label
                                                                    htmlFor="role-field"
                                                                    className="form-label"
                                                                    >
                                                                        City
                                                                        <span className="text-danger"> *</span>
                                                                    </label>
                                                                </option>
                                                                {cityList.map((city) => (
                                                                    <option key={city._id} value={city._id}>
                                                                        {city.CityName}
                                                                    </option>
                                                                ))}
                                                            </Input>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.City}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={5}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="textarea"
                                                                className="form-control"
                                                                placeholder="Enter Address"
                                                                required
                                                                name="Address"
                                                                value={values.Address}
                                                                onChange={handleChange}
                                                            />
                                                            <label 
                                                                htmlFor="role-field"
                                                                className="form-label">
                                                                Address
                                                            <span className="text-danger"> *</span>
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.Address}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={2}>
                                                        <div className="form-floating mb-3">
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Pincode"
                                                                required
                                                                name="Pincode"
                                                                value={values.Pincode}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Pincode
                                                                <span className="text-danger"> *</span>
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.Pincode}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter GST No."
                                                                required
                                                                name="GSTNo"
                                                                value={values.GSTNo}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                GST No.
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.GSTNo}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Contact No. (Sales)"
                                                                required
                                                                name="ContactNo_Sales"
                                                                value={values.ContactNo_Sales}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Contact No. (Sales)
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.ContactNo_Sales}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Contact No. (Support)"
                                                                required
                                                                name="ContactNo_Support"
                                                                value={values.ContactNo_Support}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Contact No. (Support)
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.ContactNo_Support}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Contact No. (Office)"
                                                                required
                                                                name="ContactNo_Office"
                                                                value={values.ContactNo_Office}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Contact No. (Office)
                                                                <span className="text-danger"> *</span>
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.ContactNo_Office}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Email ID (Office)"
                                                                required
                                                                name="EmailID_Office"
                                                                value={values.EmailID_Office}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Email ID (Office)
                                                                <span className="text-danger"> *</span>
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.EmailID_Office}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Email ID (Support)"
                                                                required
                                                                name="EmailID_Support"
                                                                value={values.EmailID_Support}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Email ID (Support)
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.EmailID_Support}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Email ID (Sales)"
                                                                required
                                                                name="EmailID_Sales"
                                                                value={values.EmailID_Sales}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Email ID (Sales)
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.EmailID_Sales}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Website 1"
                                                                required
                                                                name="Website1"
                                                                value={values.Website1}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Website 1
                                                                <span className="text-danger"> *</span>
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.Website1}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Enter Website 2"
                                                                    required
                                                                    name="Website2"
                                                                    value={values.Website2}
                                                                    onChange={handleChange}
                                                                />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Website 2
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.Website2}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={3}>
                                                        <label>
                                                            Favicon
                                                        </label>
                                                        <input
                                                            type="file"
                                                            name="Favicon"
                                                            className="form-control"
                                                            accept=".jpg, .jpeg, .png"
                                                            onChange={PhotoUpload}
                                                        />
                                                        {isSubmit && (
                                                            <p className="text-danger">
                                                                {formErrors.productImage}
                                                            </p>
                                                        )}
                                                        {checkImageFavicon ? (
                                                            <img
                                                                className="m-2"
                                                                src={favicon}
                                                                alt="Profile"
                                                                width="180"
                                                                height="200"
                                                            />
                                                        ) : null}
                                                    </Col>
                                                    <Col lg={3}>
                                                        <label>
                                                            Icon
                                                        </label>
                                                        <input
                                                            type="file"
                                                            name="Icon"
                                                            className="form-control"
                                                            accept=".jpg, .jpeg, .png"
                                                            onChange={PhotoUpload}
                                                        />
                                                        {isSubmit && (
                                                            <p className="text-danger">
                                                                {formErrors.productImage}
                                                            </p>
                                                        )}
                                                        {checkImageIcon ? (
                                                            <img
                                                                className="m-2"
                                                                src={icon}
                                                                alt="Profile"
                                                                width="180"
                                                                height="200"
                                                            />
                                                        ) : null}
                                                    </Col>
                                                    <Col lg={3}>
                                                        <label>
                                                            Logo
                                                        </label>
                                                        <input
                                                            type="file"
                                                            name="Logo"
                                                            className="form-control"
                                                            accept=".jpg, .jpeg, .png"
                                                            onChange={PhotoUpload}
                                                        />
                                                        {isSubmit && (
                                                            <p className="text-danger">
                                                                {formErrors.productImage}
                                                            </p>
                                                        )}
                                                        {checkImageLogo ? (
                                                            <img
                                                                className="m-2"
                                                                src={logo}
                                                                alt="Profile"
                                                                width="180"
                                                                height="200"
                                                            />
                                                        ) : null}
                                                    </Col>
                                                    <Col lg={3}>
                                                        <label>
                                                            Digital Signature
                                                        </label>
                                                        <input
                                                            type="file"
                                                            name="DigitalSignature"
                                                            className="form-control"
                                                            accept=".jpg, .jpeg, .png"
                                                            onChange={PhotoUpload}
                                                        />
                                                        {isSubmit && (
                                                            <p className="text-danger">
                                                                {formErrors.productImage}
                                                            </p>
                                                        )}
                                                        {checkImageDigitalSignature ? (
                                                            <img
                                                                className="m-2"
                                                                src={digitalSignature}
                                                                alt="Profile"
                                                                width="180"
                                                                height="200"
                                                            />
                                                        ) : null}
                                                    </Col>
                                                </Row>

                                                <div className="mt-5">
                                                    <Col lg={6}>
                                                    <div className="form-check mb-2">
                                                        <Input
                                                        type="checkbox"
                                                        name="IsActive"
                                                        value={IsActive}
                                                        onChange={handlecheck}
                                                        checked={IsActive}
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
                                                                placeholder="Enter Company name"
                                                                required
                                                                name="CompanyName"
                                                                value={values.CompanyName}
                                                                onChange={handleChange}
                                                            />
                                                                <label
                                                                    htmlFor="role-field"
                                                                    className="form-label"
                                                                >
                                                                    Company name
                                                                    <span className="text-danger"> *</span>
                                                                </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.companyName}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Contact Person Name"
                                                                required
                                                                name="ContactPersonName"
                                                                value={values.ContactPersonName}
                                                                onChange={handleChange}
                                                            />
                                                            <label
                                                                htmlFor="role-field"
                                                                className="form-label"
                                                            >
                                                                Contact Person Name
                                                                <span className="text-danger"> *</span>
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.contactPersonName}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={2}>
                                                        <div className="form-floating mb-3">
                                                            <Input
                                                                type="select"
                                                                className="form-control"
                                                                name="country"
                                                                value={country}
                                                                onChange={(e)=>{
                                                                    setCountry(e.target.value)
                                                                }}
                                                            >
                                                                <option selected={true} disabled value="">
                                                                    <label
                                                                    htmlFor="role-field"
                                                                    className="form-label"
                                                                    >
                                                                        Country
                                                                        <span className="text-danger"> *</span>
                                                                    </label>
                                                                </option>
                                                                {countryList.map((country) => (
                                                                    <option key={country._id} value={country._id}>
                                                                        {country.CountryName}
                                                                    </option>
                                                                ))}
                                                            </Input>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.CountryID}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={2}>
                                                        <div className="form-floating mb-3">
                                                            <Input
                                                                type="select"
                                                                className="form-control"
                                                                name="state"
                                                                value={state}
                                                                onChange={(e) => {
                                                                    setState(e.target.value);
                                                                }}
                                                            >
                                                                <option selected={true} disabled value="">
                                                                    <label
                                                                    htmlFor="role-field"
                                                                    className="form-label"
                                                                    >
                                                                        State
                                                                        <span className="text-danger"> *</span>
                                                                    </label>
                                                                </option>
                                                                {stateList.map((state) => (
                                                                    <option key={state._id} value={state._id}>
                                                                        {state.StateName}
                                                                    </option>
                                                                ))}
                                                            </Input>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.StateID}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={2}>
                                                        <div className="form-floating mb-3">
                                                            <Input
                                                                type="select"
                                                                className="form-control"
                                                                name="city"
                                                                value={city}
                                                                onChange={(e) => {
                                                                    setCity(e.target.value);
                                                                }}
                                                            >
                                                                <option selected={true} disabled value="">
                                                                    <label
                                                                    htmlFor="role-field"
                                                                    className="form-label"
                                                                    >
                                                                        City
                                                                        <span className="text-danger"> *</span>
                                                                    </label>
                                                                </option>
                                                                {cityList.map((city) => (
                                                                    <option key={city._id} value={city._id}>
                                                                        {city.CityName}
                                                                    </option>
                                                                ))}
                                                            </Input>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.City}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col lg={5}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="textarea"
                                                                className="form-control"
                                                                placeholder="Enter Address"
                                                                required
                                                                name="Address"
                                                                value={values.Address}
                                                                onChange={handleChange}
                                                            />
                                                            <label 
                                                                htmlFor="role-field"
                                                                className="form-label">
                                                                Address
                                                            <span className="text-danger"> *</span>
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.Address}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={2}>
                                                        <div className="form-floating mb-3">
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Pincode"
                                                                required
                                                                name="Pincode"
                                                                value={values.Pincode}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Pincode
                                                                <span className="text-danger"> *</span>
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.Pincode}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <Input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter GST No."
                                                                required
                                                                name="GSTNo"
                                                                value={values.GSTNo}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                GST No.
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.GSTNo}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Contact No. (Sales)"
                                                                required
                                                                name="ContactNo_Sales"
                                                                value={values.ContactNo_Sales}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Contact No. (Sales)
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.ContactNo_Sales}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Contact No. (Support)"
                                                                required
                                                                name="ContactNo_Support"
                                                                value={values.ContactNo_Support}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Contact No. (Support)
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.ContactNo_Support}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Contact No. (Office)"
                                                                required
                                                                name="ContactNo_Office"
                                                                value={values.ContactNo_Office}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Contact No. (Office)
                                                                <span className="text-danger"> *</span>
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.ContactNo_Office}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Email ID (Office)"
                                                                required
                                                                name="EmailID_Office"
                                                                value={values.EmailID_Office}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Email ID (Office)
                                                                <span className="text-danger"> *</span>
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.EmailID_Office}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Email ID (Support)"
                                                                required
                                                                name="EmailID_Support"
                                                                value={values.EmailID_Support}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Email ID (Support)
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.EmailID_Support}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Email ID (Sales)"
                                                                required
                                                                name="EmailID_Sales"
                                                                value={values.EmailID_Sales}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Email ID (Sales)
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.EmailID_Sales}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter Website 1"
                                                                required
                                                                name="Website1"
                                                                value={values.Website1}
                                                                onChange={handleChange}
                                                            />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Website 1
                                                                <span className="text-danger"> *</span>
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.Website1}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="form-floating mb-3">
                                                            <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Enter Website 2"
                                                                    required
                                                                    name="Website2"
                                                                    value={values.Website2}
                                                                    onChange={handleChange}
                                                                />
                                                            <label  htmlFor="role-field"
                                                                className="form-label">
                                                                Website 2
                                                            </label>
                                                            {isSubmit && (
                                                                <p className="text-danger">
                                                                    {formErrors.Website2}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                </Row>
                                                
                                                <Row>
                                                    <Col lg={3}>
                                                        <label>
                                                            Favicon
                                                        </label>
                                                        <input
                                                            type="file"
                                                            name="Favicon"
                                                            className="form-control"
                                                            accept=".jpg, .jpeg, .png"
                                                            onChange={PhotoUpload}
                                                        />
                                                        {isSubmit && (
                                                            <p className="text-danger">
                                                                {formErrors.productImage}
                                                            </p>
                                                        )}
                                                        {!removedImages.Favicon && (
                                                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                                                {(checkImageFavicon || values.Favicon) && (
                                                                    <button
                                                                        onClick={() => handleRemoveImage('Favicon')}
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
                                                                {checkImageFavicon ? 
                                                                    <img
                                                                        style={{
                                                                            margin: '8px',
                                                                            borderRadius: '2px',
                                                                            border: '1px solid #e5e7eb'
                                                                        }}
                                                                        src={favicon}
                                                                        alt="Profile"
                                                                        width="180"
                                                                        height="200"
                                                                    />
                                                                    :
                                                                    values.Favicon ? (
                                                                        <img
                                                                            style={{
                                                                                margin: '8px',
                                                                                borderRadius: '2px',
                                                                                border: '1px solid #e5e7eb'
                                                                            }}
                                                                            src={`${process.env.REACT_APP_API_URL_COFFEE}/${values.Favicon}`}
                                                                            alt="Profile"
                                                                            width="180"
                                                                            height="200"
                                                                        />
                                                                    ) : null
                                                                }
                                                            </div>
                                                        )}
                                                    </Col>
                                                    <Col lg={3}>
                                                        <label>
                                                            Icon
                                                        </label>
                                                        <input
                                                            type="file"
                                                            name="Icon"
                                                            className="form-control"
                                                            accept=".jpg, .jpeg, .png"
                                                            onChange={PhotoUpload}
                                                        />
                                                        {isSubmit && (
                                                            <p className="text-danger">
                                                                {formErrors.productImage}
                                                            </p>
                                                        )}
                                                        {!removedImages.Icon && (
                                                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                                                {(checkImageIcon || values.Icon) && (
                                                                    <button
                                                                        onClick={() => handleRemoveImage('Icon')}
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
                                                        {checkImageIcon ? 
                                                            <img
                                                                className="m-2"
                                                                src={icon}
                                                                alt="Profile"
                                                                width="180"
                                                                height="200"
                                                            />
                                                            :
                                                            values.Icon ? (
                                                                <img
                                                                    className="m-2"
                                                                    src={`${process.env.REACT_APP_API_URL_COFFEE}/${values.Icon}`}
                                                                    alt="Profile"
                                                                    width="180"
                                                                    height="200"
                                                                /> )  : null}
                                                                </div>
                                                            )}
                                                    </Col>
                                                    <Col lg={3}>
                                                        <label>
                                                            Logo
                                                        </label>
                                                        <input
                                                            type="file"
                                                            name="Logo"
                                                            className="form-control"
                                                            accept=".jpg, .jpeg, .png"
                                                            onChange={PhotoUpload}
                                                        />
                                                        {isSubmit && (
                                                            <p className="text-danger">
                                                                {formErrors.productImage}
                                                            </p>
                                                        )}
                                                        {!removedImages.Logo && (
                                                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                                                {(checkImageLogo || values.Logo) && (
                                                                    <button
                                                                        onClick={() => handleRemoveImage('Logo')}
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
                                                        {checkImageLogo ? 
                                                            <img
                                                                className="m-2"
                                                                src={logo}
                                                                alt="Profile"
                                                                width="180"
                                                                height="200"
                                                            />
                                                            :
                                                            values.Logo ? (
                                                                <img
                                                                    className="m-2"
                                                                    src={`${process.env.REACT_APP_API_URL_COFFEE}/${values.Logo}`}
                                                                    alt="Profile"
                                                                    width="180"
                                                                    height="200"
                                                                /> 
                                                        ) : null}
                                                        </div>
                                                    )}
                                                    </Col>
                                                    <Col lg={3}>
                                                        <label>
                                                            Digital Signature
                                                        </label>
                                                        <input
                                                            type="file"
                                                            name="DigitalSignature"
                                                            className="form-control"
                                                            accept=".jpg, .jpeg, .png"
                                                            onChange={PhotoUpload}
                                                        />
                                                        {isSubmit && (
                                                            <p className="text-danger">
                                                                {formErrors.productImage}
                                                            </p>
                                                        )}
                                                        {!removedImages.DigitalSignature && (
                                                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                                                {(checkImageDigitalSignature || values.DigitalSignature) && (
                                                                    <button
                                                                        onClick={() => handleRemoveImage('DigitalSignature')}
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
                                                        {digitalSignature ? 
                                                            <img
                                                                className="m-2"
                                                                src={digitalSignature}
                                                                alt="Profile"
                                                                width="180"
                                                                height="200"
                                                            />
                                                            :
                                                            values.DigitalSignature ? (
                                                                <img
                                                                    className="m-2"
                                                                    src={`${process.env.REACT_APP_API_URL_COFFEE}/${values.DigitalSignature}`}
                                                                    alt="Profile"
                                                                    width="180"
                                                                    height="200"
                                                                /> 
                                                        ) : null}
                                                        </div>
                                                        )}
                                                    </Col>
                                                </Row>

                                                <div className="mt-5">
                                                    <Col lg={6}>
                                                    <div className="form-check mb-2">
                                                        <Input
                                                        type="checkbox"
                                                        name="IsActive"
                                                        value={IsActive}
                                                        onChange={handlecheck}
                                                        checked={IsActive}
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

export default CompanyMaster;
