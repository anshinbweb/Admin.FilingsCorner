import React, { useState, useEffect, useContext } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Alert,
    CardBody,
    Button,
    Label,
    Input,
    FormFeedback,
    Form,
} from "reactstrap";
import logo from "../../assets/images/logo/RC-logo-png.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const UserProfile = () => {
    const navigate = useNavigate();

    const { adminData, setAdminData } = useContext(AuthContext);
    document.title = "Profile | Project Name";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <div className="d-flex">
                                        <div className="mx-3">
                                            <img
                                                src={`${process.env.REACT_APP_API_URL_COFFEE}/${adminData?.data?.Logo}`}
                                                alt=""
                                                className="avatar-md rounded-circle img-thumbnail"
                                            />
                                        </div>
                                        <div className="flex-grow-1 align-self-center">
                                            <div className="text-muted">
                                                <h5>
                                                    {adminData?.data?.firstName || adminData?.data?.CompanyName ||
                                                        "Admin"}{" "}
                                                    {adminData?.data?.lastName ||
                                                        ""}
                                                </h5>
                                                <p className="mb-1">
                                                    Email Id :{" "}
                                                    {adminData?.data?.email || adminData?.data?.EmailID_Company}
                                                </p>
                                                {/* <p className="mb-0">Id No : #{idx}</p> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                      
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

export default UserProfile;
