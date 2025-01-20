import React, { useState, useEffect, useContext } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    ListGroup,
    ListGroupItem,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Label,
    Input,
    Row,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import axios from "axios";
import DataTable from "react-data-table-component";

import { ToastContainer, toast } from "react-toastify";

import Select from "react-select";

import {
    createAdminUser,
    getAdminUser,
    removeAdminUser,
    updateAdminUser,
} from "../../functions/Auth/AdminUser";
import DeleteModal from "../../Components/Common/DeleteModal";
import FormsHeader from "../../Components/Common/FormsModalHeader";
import FormsFooter from "../../Components/Common/FormAddFooter";
import { AuthContext } from "../../context/AuthContext";
import {
    createRequiredDocs,
    getRequiredDocs,
    getRequiredDocsByCompany,
    updateRequiredDocs,
} from "../../functions/Services/requiredDocsFunc";
import {
    createService,
    deleteService,
    getServiceByCompanyId,
    getServiceById,
    updateService,
} from "../../functions/Services/serviceFunc";
import { getFrequencyOptionByCompanyId } from "../../functions/Services/freqOptionsFunc";
import {
    createRateCard,
    deleteRateCard,
    getRateCardById,
    updateRateCard,
} from "../../functions/Services/rateCardFunc";

const initialState = {
    serviceId: "",
    frequencyTypeId: "",
    rate: "",
    IsActive: false,
};

const ServiceMaster = () => {
    const [values, setValues] = useState(initialState);
    const [data, setData] = useState([]);

    const { adminData, setAdminData } = useContext(AuthContext);

    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [filter, setFilter] = useState(true);

    const [servicesList, setServicesList] = useState([]);
    const [frequencyOptionsList, setFrequencyOptionsList] = useState([]);

    const [query, setQuery] = useState("");

    const [_id, set_Id] = useState("");
    const [remove_id, setRemove_id] = useState("");

    const getServiceList = async () => {
        getServiceByCompanyId(adminData.data._id).then((res) => {
            setServicesList(res.data);
        });
    };

    const getFrequencyOptionsList = async () => {
        getFrequencyOptionByCompanyId(adminData.data._id).then((res) => {
            setFrequencyOptionsList(res.data);
        });
    };

    useEffect(() => {
        getServiceList();
        getFrequencyOptionsList();
    }, []);

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            console.log("no errors");
        }
    }, [formErrors, isSubmit]);

    const [modal_list, setmodal_list] = useState(false);
    const tog_list = () => {
        setmodal_list(!modal_list);
        setValues(initialState);
        setIsSubmit(false);
    };

    const [modal_delete, setmodal_delete] = useState(false);
    const tog_delete = (_id) => {
        setmodal_delete(!modal_delete);
        setRemove_id(_id);
    };

    const [modal_edit, setmodal_edit] = useState(false);

    const handleTog_edit = (_id) => {
        setmodal_edit(!modal_edit);
        setIsSubmit(false);
        set_Id(_id);
        getRateCardById(_id)
            .then((res) => {
                // console.log(res)
                setValues({
                    ...values,
                    serviceId: {
                        value: res.data.serviceDetails._id,
                        label: res.data.serviceDetails.serviceName,
                    },
                    frequencyTypeId: {
                        value: res.data.frequencyDetails._id,
                        label: res.data.frequencyDetails.frequencyType,
                    },
                    rate: res.data.rate,
                    IsActive: res.data.isActive,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleCheck = (e) => {
        setValues({ ...values, IsActive: e.target.checked });
    };

    const handleSubmitCancel = () => {
        setmodal_list(false);
        setValues(initialState);
        setIsSubmit(false);
    };

    const handleClick = (e) => {
        e.preventDefault();
        let errors = validate(values);
        setFormErrors(errors);
        setIsSubmit(true);
        if (Object.keys(errors).length === 0) {
            const dataToSent = {
                ...values,
                companyDetailsId: adminData.data._id,
                frequencyTypeId: values.frequencyTypeId.value,
                serviceId: values.serviceId.value,
            };
            createRateCard(dataToSent)
                .then((res) => {
                    console.log(res);
                    setmodal_list(!modal_list);
                    setValues(initialState);
                    setIsSubmit(false);
                    fetchServices();
                })
                .catch((err) => {
                    console.log(err);
                    toast.error("Rate card already exists");
                });
        }
    };

    const handleDelete = (e) => {
        e.preventDefault();
        deleteRateCard(remove_id)
            .then((res) => {
                setmodal_delete(!modal_delete);
                fetchServices();
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
            const dataToSent = {
                ...values,
                companyDetailsId: adminData.data._id,
                frequencyTypeId: values.frequencyTypeId.value,
                serviceId: values.serviceId.value,

            };
            updateRateCard(_id, dataToSent)
                .then((res) => {
                    setmodal_edit(!modal_edit);
                    fetchServices();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const validate = (values) => {
        const errors = {};

        if (values.serviceId === "") {
            errors.serviceId = "Service Name is required!";
        }

        if (values.frequencyTypeId === "") {
            errors.frequencyTypeId = "Frequency Option is required!";
        }

        if (values.rate === "") {
            errors.rate = "Rate is required!";
        }
        return errors;
    };

    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [pageNo, setPageNo] = useState(0);
    const [column, setcolumn] = useState();
    const [sortDirection, setsortDirection] = useState();

    const handleSort = (column, sortDirection) => {
        setcolumn(column.sortField);
        setsortDirection(sortDirection);
    };

    useEffect(() => {
        fetchServices();
    }, [pageNo, perPage, column, sortDirection, query, filter]);

    const fetchServices = async () => {
        setLoading(true);
        let skip = (pageNo - 1) * perPage;
        if (skip < 0) {
            skip = 0;
        }

        await axios
            .post(
                `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/listbyparams/rate-card/${adminData.data._id}`,
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
                    console.log(res.data);
                    setLoading(false);
                    setData(res.data);
                    setTotalRows(res.count);
                } else if (response.data.length === 0) {
                    setData([]);
                }
            });

        setLoading(false);
    };

    const handlePageChange = (page) => {
        setPageNo(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
    };
    const handleFilter = (e) => {
        setFilter(e.target.checked);
    };
    const col = [
        {
            name: "Service Name",
            selector: (row) => row.serviceDetails.serviceName,
            sortable: true,
            sortField: "row.serviceDetails.serviceName",
            minWidth: "150px",
        },
        {
            name: "Frequency Option",
            selector: (row) => row.frequencyDetails.frequencyType,
            sortable: true,
            sortField: "row.frequencyDetails.frequencyType",
            minWidth: "150px",
        },
        {
            name: "Rate",
            selector: (row) => row.rate,
            sortable: true,
            sortField: "row.rate",
            minWidth: "150px",
        },
        {
            name: "Active",
            selector: (row) => (row.isActive ? "True" : "False"),
            sortable: true,
            sortField: "password",
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

    document.title = "Rate Card | Project Name";

    return (
        <React.Fragment>
            <ToastContainer />
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb
                        maintitle="Services"
                        title="Rate Card"
                        pageTitle="Services"
                    />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <FormsHeader
                                        formName="Rate Card"
                                        filter={filter}
                                        handleFilter={handleFilter}
                                        tog_list={tog_list}
                                        setQuery={setQuery}
                                    />
                                </CardHeader>

                                <CardBody>
                                    <div id="customerList">
                                        <div className="table-responsive table-card mt-1 mb-1 text-right">
                                            <DataTable
                                                columns={col}
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
                                                paginationTotalRows={totalRows}
                                                paginationRowsPerPageOptions={[
                                                    10,
                                                    50,
                                                    100,
                                                    totalRows,
                                                ]}
                                                onChangeRowsPerPage={
                                                    handlePerRowsChange
                                                }
                                                onChangePage={handlePageChange}
                                            />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Add Modal */}
            <Modal
                isOpen={modal_list}
                toggle={() => {
                    tog_list();
                }}
                centered
            >
                <ModalHeader
                    className="bg-light p-3"
                    toggle={() => {
                        setmodal_list(false);
                        setIsSubmit(false);
                    }}
                >
                    Add Rate
                </ModalHeader>
                <form>
                    <ModalBody>
                        <div className="form-floating mb-3">
                            <Select
                                placeholder="Select Service"
                                options={servicesList.map((doc) => ({
                                    value: doc._id,
                                    label: doc.serviceName,
                                }))}
                                value={values.serviceId}
                                onChange={(selectedOptions) =>
                                    setValues({
                                        ...values,
                                        serviceId: selectedOptions,
                                    })
                                }
                            />
                            {isSubmit && (
                                <p className="text-danger">
                                    {formErrors.serviceId}
                                </p>
                            )}
                        </div>
                        <div className="form-floating mb-3">
                            <Select
                                placeholder="Select Frequency Type"
                                options={frequencyOptionsList.map((doc) => ({
                                    value: doc._id,
                                    label: doc.frequencyType,
                                }))}
                                value={values.frequencyTypeId}
                                onChange={(selectedOptions) =>
                                    setValues({
                                        ...values,
                                        frequencyTypeId: selectedOptions,
                                    })
                                }
                            />
                            {isSubmit && (
                                <p className="text-danger">
                                    {formErrors.frequencyTypeId}
                                </p>
                            )}
                        </div>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                placeholder="Enter Rate"
                                required
                                name="rate"
                                value={values.rate}
                                onChange={handleChange}
                            />
                            <Label>
                                Rate <span className="text-danger">*</span>
                            </Label>
                            {isSubmit && (
                                <p className="text-danger">{formErrors.rate}</p>
                            )}
                        </div>
                        <div className="form-check mb-2">
                            <Input
                                type="checkbox"
                                className="form-check-input"
                                name="IsActive"
                                value={values.IsActive}
                                onChange={handleCheck}
                            />
                            <Label className="form-check-label">
                                Is Active
                            </Label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <FormsFooter
                            handleSubmit={handleClick}
                            handleSubmitCancel={handleSubmitCancel}
                        />
                    </ModalFooter>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={modal_edit}
                toggle={() => {
                    handleTog_edit();
                }}
                centered
            >
                <ModalHeader
                    className="bg-light p-3"
                    toggle={() => {
                        setmodal_edit(false);
                        setIsSubmit(false);
                    }}
                >
                    Edit Rate
                </ModalHeader>
                <form>
                    <ModalBody>
                        <div className="form-floating mb-3">
                            <Select
                                placeholder="Select Service"
                                options={servicesList.map((doc) => ({
                                    value: doc._id,
                                    label: doc.serviceName,
                                }))}
                                value={values.serviceId}
                                onChange={(selectedOptions) =>
                                    setValues({
                                        ...values,
                                        serviceId: selectedOptions,
                                    })
                                }
                            />
                            {isSubmit && (
                                <p className="text-danger">
                                    {formErrors.serviceId}
                                </p>
                            )}
                        </div>
                        <div className="form-floating mb-3">
                            <Select
                                placeholder="Select Frequency Type"
                                options={frequencyOptionsList.map((doc) => ({
                                    value: doc._id,
                                    label: doc.frequencyType,
                                }))}
                                value={values.frequencyTypeId}
                                onChange={(selectedOptions) =>
                                    setValues({
                                        ...values,
                                        frequencyTypeId: selectedOptions,
                                    })
                                }
                            />
                            {isSubmit && (
                                <p className="text-danger">
                                    {formErrors.frequencyTypeId}
                                </p>
                            )}
                        </div>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                placeholder="Enter Rate"
                                required
                                name="rate"
                                value={values.rate}
                                onChange={handleChange}
                            />
                            <Label>
                                Rate <span className="text-danger">*</span>
                            </Label>
                            {isSubmit && (
                                <p className="text-danger">{formErrors.rate}</p>
                            )}
                        </div>
                        <div className="form-check mb-2">
                            <Input
                                type="checkbox"
                                className="form-check-input"
                                name="IsActive"
                                value={values.IsActive}
                                onChange={handleCheck}
                                checked={values.IsActive}
                            />
                            <Label className="form-check-label">
                                Is Active
                            </Label>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                            <button
                                type="submit"
                                className="btn btn-success"
                                id="add-btn"
                                onClick={handleUpdate}
                            >
                                Update
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => {
                                    setmodal_edit(false);
                                    setIsSubmit(false);
                                    setFormErrors({});
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </ModalFooter>
                </form>
            </Modal>

            <DeleteModal
                show={modal_delete}
                handleDelete={handleDelete}
                toggle={handleDeleteClose}
                setmodal_delete={setmodal_delete}
            />
        </React.Fragment>
    );
};

export default ServiceMaster;
