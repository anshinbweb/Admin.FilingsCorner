import React, { useState, useEffect, useContext } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
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

import Select from "react-select";

import DeleteModal from "../../Components/Common/DeleteModal";
import FormsHeader from "../../Components/Common/FormsModalHeader";
import FormsFooter from "../../Components/Common/FormAddFooter";
import { AuthContext } from "../../context/AuthContext";
import { getServiceByCompanyId } from "../../functions/Services/serviceFunc";
import {
    createServiceGroup,
    deleteServiceGroup,
    getServiceGroupById,
    updateServiceGroup,
} from "../../functions/Services/serviceGroupsFunc";

const initialState = {
    groupName: "",
    services: [],
    IsActive: false,
};

const ServiceGroups = () => {
    const [values, setValues] = useState(initialState);
    const [data, setData] = useState([]);

    const { adminData, setAdminData } = useContext(AuthContext);

    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [filter, setFilter] = useState(true);

    const [servicesList, setServicesList] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);

    const [query, setQuery] = useState("");

    const [_id, set_Id] = useState("");
    const [remove_id, setRemove_id] = useState("");

    const getServices = () => {
        getServiceByCompanyId(adminData.data._id)
            .then((res) => {
                setServicesList(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        getServices();
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

    useEffect(() => {
        if (!modal_edit) {
            setValues(initialState);
            setIsSubmit(false);
            setSelectedServices([]);
        }
    }, [modal_edit]);

    const handleTog_edit = (_id) => {
        setmodal_edit(!modal_edit);
        setIsSubmit(false);
        set_Id(_id);
        getServiceGroupById(_id)
            .then((res) => {
                setValues({
                    ...values,
                    groupName: res.serviceGroup.groupName,
                    IsActive: res.serviceGroup.isActive,
                });
                const selectedServicesData = res.serviceGroup.services.map(
                    (service) => ({
                        value: service._id,
                        label: service.serviceName,
                    })
                );
                setSelectedServices(selectedServicesData);
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
                services: selectedServices.map((doc) => doc.value),
            };
            createServiceGroup(dataToSent)
                .then((res) => {
                    setmodal_list(!modal_list);
                    setValues(initialState);
                    setIsSubmit(false);
                    setSelectedServices([]);
                    fetchServices();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const handleDelete = (e) => {
        e.preventDefault();
        deleteServiceGroup(remove_id)
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
                services: selectedServices.map((doc) => doc.value),
            };
            updateServiceGroup(_id, dataToSent)
                .then((res) => {
                    setmodal_edit(!modal_edit);
                    setSelectedServices([]);
                    fetchServices();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const validate = (values) => {
        const errors = {};

        if (values.groupName === "") {
            errors.groupName = "Group Name is required!";
        }

        if (selectedServices.length === 0) {
            errors.services = "Services is required!";
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
                `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/listbyparams/service-group/${adminData.data._id}`,
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
                    let res = response;
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
            name: "Group Name",
            selector: (row) => row.groupName,
            sortable: true,
            sortField: "row.groupName",
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

    document.title = "Service Groups | Project Name";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb
                        maintitle="Services"
                        title="Service Groups"
                        pageTitle="Services"
                    />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <FormsHeader
                                        formName="Service Groups"
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
                    Add Service
                </ModalHeader>
                <form>
                    <ModalBody>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                placeholder="Enter Service Name"
                                required
                                name="groupName"
                                value={values.groupName}
                                onChange={handleChange}
                            />
                            <Label>
                                Group Name{" "}
                                <span className="text-danger">*</span>
                            </Label>
                            {isSubmit && (
                                <p className="text-danger">
                                    {formErrors.groupName}
                                </p>
                            )}
                        </div>
                        <div className="form-floating mb-3">
                            <Select
                                isMulti={true}
                                placeholder="Add Services"
                                options={servicesList.map((doc) => ({
                                    value: doc._id,
                                    label: doc.serviceName,
                                }))}
                                value={selectedServices}
                                onChange={(selectedOptions) =>
                                    setSelectedServices(selectedOptions)
                                }
                            />
                            {isSubmit && (
                                <p className="text-danger">
                                    {formErrors.services}
                                </p>
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
                    Edit Service Group
                </ModalHeader>
                <form>
                    <ModalBody>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                placeholder="Enter Service Name"
                                required
                                name="groupName"
                                value={values.groupName}
                                onChange={handleChange}
                            />
                            <Label>
                                Group Name{" "}
                                <span className="text-danger">*</span>
                            </Label>
                            {isSubmit && (
                                <p className="text-danger">
                                    {formErrors.groupName}
                                </p>
                            )}
                        </div>
                        <div className="form-floating mb-3">
                            <Select
                                isMulti={true}
                                placeholder="Add Services"
                                options={servicesList.map((doc) => ({
                                    value: doc._id,
                                    label: doc.serviceName,
                                }))}
                                value={selectedServices}
                                onChange={(selectedOptions) =>
                                    setSelectedServices(selectedOptions)
                                }
                            />
                            {isSubmit && (
                                <p className="text-danger">
                                    {formErrors.services}
                                </p>
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

export default ServiceGroups;
