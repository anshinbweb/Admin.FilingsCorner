import React, { useContext, useEffect, useState } from "react";
import {
    Card,
    CardBody,
    Col,
    Container,
    Input,
    Label,
    Row,
    Button,
    Form,
    FormFeedback,
    // Alert,
} from "reactstrap";
import { Alert } from "react-bootstrap";

import logo from "../../assets/images/logo/RC-logo-png.png";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const initialState = {
    email: "",
    password: "",
    role: "superadmin",
};

const Login = (props) => {
    const { error } = useSelector((state) => ({
        error: state.Login.error,
    }));

    const { adminData, setAdminData } = useContext(AuthContext);

    const navigate = useNavigate();

    // const [showError, setShowError] = useState(false);
    const [values, setValues] = useState(initialState);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const { email, password, role } = values;
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (selectedRole) => {
        setValues({ ...values, role: selectedRole });
    };

    const getEndpoint = (role) => {
        switch (role) {
            case "superadmin":
                return `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/login/superadmin`;
            case "admin":
                return `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/login/company`;
            default:
                return `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/login/superadmin`;
        }
    };

    const login = () => {
        setIsSubmit(true);
        setFormErrors(validate(values));

        const role = getEndpoint(values.role);
        axios
            .post(`${role}`, {
                email: values.email,
                password: values.password,
            })
            .then((res) => {
                if (res.isOk) {
                    localStorage.setItem("_id", res.data._id);
                    localStorage.setItem("role", res.role);
                    localStorage.setItem("token", res.token);
                    navigate("/profile");
                    setAdminData({ ...res, role: role });
                } else {
                    toast.error("Authentication failed!");
                }
            })
            .catch((err) => {
                console.log(err);
                toast.error("Authentication failed!");
            });
    };

    const [errEmail, seterrEmail] = useState(false);
    const [errPassword, setErrPassword] = useState(false);

    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (values.email === "") {
            errors.email = "Email is required!";
            seterrEmail(true);
        } else if (!regex.test(values.email)) {
            errors.email = "Invalid Email address!";
            seterrEmail(true);
        } else {
            seterrEmail(false);
        }
        if (values.password === "") {
            errors.password = "Password is required!";
            setErrPassword(true);
        }
        if (values.password !== "") {
            setErrPassword(false);
        }
        return errors;
    };
    const validClassEmail =
        errEmail && isSubmit ? "form-control is-invalid" : "form-control";
    const validClassPassword =
        errPassword && isSubmit
            ? "form-control is-invalid"
            : "form-control pe-5";

    document.title = " SignIn | Project Name ";
    return (
        <React.Fragment>
            {/* <ParticlesAuth> */}
            <ToastContainer />
            <div className="auth-page-content">
                <Container>
                    <Row>
                        <Col lg={12}>
                            <div className="text-center mt-sm-5 mb-4 text-white-50"></div>
                        </Col>
                    </Row>

                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <Card style={{ marginTop: "35%" }}>
                                <CardBody className="p-4">
                                    <div className="text-center mt-2">
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <div className="site-logo">
                                                <Link to="index.html">
                                                    <img
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                        src={logo}
                                                        height={"70px"}
                                                        width={"80px"}
                                                        alt="Project Name"
                                                    />
                                                </Link>
                                            </div>
                                        </div>
                                        <h5 className="text-primary mt-2">
                                            Welcome Back !
                                        </h5>
                                        <p className="text-muted">
                                            Sign in to continue.
                                        </p>
                                    </div>
                                    {error && error ? (
                                        <Alert color="danger"> {error} </Alert>
                                    ) : null}
                                    <div className="p-2 mt-4">
                                        <div className="mb-3 text-center">
                                            <div className="d-flex justify-content-center">
                                                <div className="form-check me-3">
                                                    <Input
                                                        type="radio"
                                                        name="role"
                                                        id="superadmin"
                                                        checked={
                                                            role ===
                                                            "superadmin"
                                                        }
                                                        onChange={() =>
                                                            handleRoleChange(
                                                                "superadmin"
                                                            )
                                                        }
                                                    />
                                                    <Label
                                                        className="form-check-label"
                                                        htmlFor="superadmin"
                                                    >
                                                        Superadmin
                                                    </Label>
                                                </div>
                                                <div className="form-check">
                                                    <Input
                                                        type="radio"
                                                        name="role"
                                                        id="admin"
                                                        checked={
                                                            role === "admin"
                                                        }
                                                        onChange={() =>
                                                            handleRoleChange(
                                                                "admin"
                                                            )
                                                        }
                                                    />
                                                    <Label
                                                        className="form-check-label"
                                                        htmlFor="admin"
                                                    >
                                                        Admin
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <Label
                                                htmlFor="email"
                                                className="form-label"
                                            >
                                                Email
                                            </Label>
                                            <Input
                                                name="email"
                                                className={validClassEmail}
                                                placeholder="Enter email"
                                                type="email"
                                                onChange={handleChange}
                                                value={email}
                                            />
                                            {isSubmit && (
                                                <p className="text-danger">
                                                    {formErrors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <Label
                                                className="form-label"
                                                htmlFor="password-input"
                                            >
                                                Password
                                            </Label>
                                            <div className="position-relative auth-pass-inputgroup mb-3">
                                                <Input
                                                    name="password"
                                                    value={password}
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "Password"
                                                    }
                                                    className={
                                                        validClassPassword
                                                    }
                                                    placeholder="Enter Password"
                                                    onChange={handleChange}
                                                />
                                                {isSubmit && (
                                                    <p className="text-danger">
                                                        {formErrors.password}
                                                    </p>
                                                )}
                                                <button
                                                    className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                                                    type="button"
                                                    id="password-addon"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword
                                                        )
                                                    }
                                                >
                                                    {showPassword ? (
                                                        <i class="ri-eye-off-fill  align-middle"></i>
                                                    ) : (
                                                        <i className="ri-eye-fill align-middle"></i>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <Button
                                                color="success"
                                                className="btn btn-success w-100"
                                                type="submit"
                                                onClick={login}
                                            >
                                                Sign In
                                            </Button>
                                        </div>
                                        {/* </Form> */}
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default withRouter(Login);
