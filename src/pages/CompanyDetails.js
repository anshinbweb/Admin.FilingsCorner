import React, { useContext, useEffect, useState } from "react";
import {
    getCityByState,
    getStateByCountry,
    listCountry,
} from "../functions/Location/Location";
import { updateCompanyMaster } from "../functions/Master/companyMaster";
import { Card, CardBody, Col, Container, Form, Input, Label, Row } from "reactstrap";
import BreadCrumb from "../Components/Common/BreadCrumb";
import { getCompany, updateCompany } from "../functions/Admin/adminFunc";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";

const CompanyDetails = () => {

    const { adminData, setAdminData } = useContext(AuthContext);

    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const initialState = {
        CompanyName: "",
        EmailID_Company: "",
        Password: "",
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

    const [values, setValues] = useState(initialState);

    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");

    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);

    const getCountries = async () => {
        listCountry().then((res) => setCountryList(res));
    };

    const getState = async (countryId) => {
        getStateByCountry(countryId).then((res) => setStateList(res));
    };

    const getCity = async (stateId) => {
        getCityByState(stateId).then((res) => setCityList(res));
    };

    useEffect(() => {
        getCountries();
        setFormErrors(false);
        getCompany(adminData?.data?._id)
            .then((res) => {
                setValues(res.data);
                setCountry(res.data.CountryID);
                setState(res.data.StateID);
                setCity(res.data.City);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        if (country) {
            getState(country);
        }
    }, [country]);

    useEffect(() => {
        if (state) {
            getCity(state);
        }
    }, [state]);

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
            };

            Object.entries(removedImages).forEach(([key, value]) => {
                if (value) {
                    dataToSend[`remove${key}`] = true;
                }
            });

            const formdata = new FormData();

            for (const key in dataToSend) {
                formdata.append(key, dataToSend[key]);
            }
            updateCompany(adminData?.data?._id, formdata)
                .then((res) => {
                    setFormErrors({});
                    getCompany(adminData?.data?._id)
                    .then((res) => {
                      setValues(res.data);
                          setCountry(res.data.CountryID);
                          setState(res.data.StateID);
                          setCity(res.data.City);
                          toast.success("Company details updated successfully");
                        })
                        .catch((err) => {
                          console.log(err);
                          toast.error("Something went wrong");
                      });
                })
                .catch((err) => {
                    console.log(err);
                    toast.error("Something went wrong");
                });
        }
    };

    const [favicon, setFavicon] = useState("");
    const [icon, setIcon] = useState("");
    const [logo, setLogo] = useState("");
    const [digitalSignature, setDigitalSignature] = useState("");

    const [updatedFavicon, setUpdatedFavicon] = useState(null);
    const [updatedIcon, setUpdatedIcon] = useState(null);
    const [updatedLogo, setUpdatedLogo] = useState(null);
    const [updatedDigitalSignature, setUpdatedDigitalSignature] =
        useState(null);

    const [removedImages, setRemovedImages] = useState({
        Favicon: false,
        Icon: false,
        Logo: false,
        DigitalSignature: false,
    });

    const [checkImageFavicon, setCheckImageFavicon] = useState(false);
    const [checkImageIcon, setCheckImageIcon] = useState(false);
    const [checkImageLogo, setCheckImageLogo] = useState(false);
    const [checkImageDigitalSignature, setCheckImageDigitalSignature] =
        useState(false);

    const handleRemoveImage = (imageType) => {
        setRemovedImages((prev) => ({ ...prev, [imageType]: true }));

        switch (imageType) {
            case "Favicon":
                setFavicon("");
                setCheckImageFavicon(false);
                setUpdatedFavicon(null);
                break;
            case "Icon":
                setIcon("");
                setCheckImageIcon(false);
                setUpdatedIcon(null);
                break;
            case "Logo":
                setLogo("");
                setCheckImageLogo(false);
                setUpdatedLogo(null);
                break;
            case "DigitalSignature":
                setDigitalSignature("");
                setCheckImageDigitalSignature(false);
                setUpdatedDigitalSignature(null);
                break;
            default:
                break;
        }

        // Clear the value in form data
        setValues((prev) => ({
            ...prev,
            [imageType]: null,
        }));
    };

    const PhotoUpload = (e) => {
        if (e.target.files.length > 0) {
            let imageurl = URL.createObjectURL(e.target.files[0]);

            console.log(e.target.name);
            if (e.target.name === "Favicon") {
                setUpdatedFavicon(e.target.files[0]);
                setFavicon(imageurl);
                setCheckImageFavicon(true);
                setRemovedImages((prev) => ({ ...prev, Favicon: false }));
            } else if (e.target.name === "Icon") {
                setUpdatedIcon(e.target.files[0]);
                setIcon(imageurl);
                setCheckImageIcon(true);
                setRemovedImages((prev) => ({ ...prev, Icon: false }));
            } else if (e.target.name === "Logo") {
                setUpdatedLogo(e.target.files[0]);
                setLogo(imageurl);
                setCheckImageLogo(true);
                setRemovedImages((prev) => ({ ...prev, Logo: false }));
            } else if (e.target.name === "DigitalSignature") {
                setUpdatedDigitalSignature(e.target.files[0]);
                setDigitalSignature(imageurl);
                setCheckImageDigitalSignature(true);
                setRemovedImages((prev) => ({
                    ...prev,
                    DigitalSignature: false,
                }));
            }
        }
    };

    const handleChange = (e) => {
      setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handlecheck = (e) => {
    setValues({ ...values, IsActive: e.target.checked });
};

    document.title = "Company Details | Project Name";

    return (
        <React.Fragment>
          <ToastContainer/>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb
                        maintitle="Company"
                        title="Company Details"
                        pageTitle="Company"
                    />
                    <Row>
                        <Col lg={12}>
                            <Card>
                            <div>
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
                                                        value={values.IsActive}
                                                        onChange={handlecheck}
                                                        checked={values.IsActive}
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
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default CompanyDetails;
