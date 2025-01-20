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

import Select from "react-select";

import DeleteModal from "../../Components/Common/DeleteModal";
import FormsHeader from "../../Components/Common/FormsModalHeader";
import FormsFooter from "../../Components/Common/FormAddFooter";
import { AuthContext } from "../../context/AuthContext";
import { getRequiredDocsByCompany } from "../../functions/Services/requiredDocsFunc";
import {
    createService,
    deleteService,
    getServiceById,
    updateService,
} from "../../functions/Services/serviceFunc";
import {
    createCurrencyMaster,
    deleteCurrencyMaster,
    getCurrencyMasterById,
    updateCurrencyMaster,
} from "../../functions/Services/currencyFunc";

const initialState = {
    currencyName: "",
    currencyCode: "",
    currencySymbol: "",
    IsActive: false,
};

const CurrencyMaster = () => {
    const [values, setValues] = useState(initialState);
    const [data, setData] = useState([]);

    const { adminData, setAdminData } = useContext(AuthContext);

    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [filter, setFilter] = useState(true);

    const [query, setQuery] = useState("");

    const [_id, set_Id] = useState("");
    const [remove_id, setRemove_id] = useState("");

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
        }
    }, [modal_edit]);

    const handleTog_edit = (_id) => {
        setmodal_edit(!modal_edit);
        setIsSubmit(false);
        set_Id(_id);
        getCurrencyMasterById(_id)
            .then((res) => {
                setValues({
                    ...values,
                    currencyName: res.data.currencyName,
                    currencyCode: res.data.currencyCode,
                    currencySymbol: res.data.currencySymbol,
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
            };
            createCurrencyMaster(dataToSent)
                .then((res) => {
                    setmodal_list(!modal_list);
                    setValues(initialState);
                    setIsSubmit(false);
                    fetchCurrencyMaster();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const handleDelete = (e) => {
        e.preventDefault();
        deleteCurrencyMaster(remove_id)
            .then((res) => {
                setmodal_delete(!modal_delete);
                fetchCurrencyMaster();
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
            };
            updateCurrencyMaster(_id, dataToSent)
                .then((res) => {
                    setmodal_edit(!modal_edit);
                    fetchCurrencyMaster();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const validate = (values) => {
        const errors = {};

        if (values.currencyName === "") {
            errors.currencyName = "Currency Name is required!";
        }

        if (values.currencyCode === "") {
            errors.currencyCode = "Currency Code is required!";
        }

        if (values.currencySymbol === "") {
            errors.currencySymbol = "Currency Symbol is required!";
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
        fetchCurrencyMaster();
    }, [pageNo, perPage, column, sortDirection, query, filter]);

    const fetchCurrencyMaster = async () => {
        setLoading(true);
        let skip = (pageNo - 1) * perPage;
        if (skip < 0) {
            skip = 0;
        }

        await axios
            .post(
                `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/listbyparams/currency-master/${adminData.data._id}`,
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
            name: "Currency Name",
            selector: (row) => row.currencyName,
            sortable: true,
            sortField: "row.currencyName",
            minWidth: "150px",
        },
        {
            name: "Currency Code",
            selector: (row) => row.currencyCode,
            sortable: true,
            sortField: "row.currencyCode",
            minWidth: "150px",
        },
        {
            name: "Currency Symbol",
            selector: (row) => row.currencySymbol,
            sortable: true,
            sortField: "row.currencySymbol",
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

    document.title = `Currency Master | ${adminData.data.CompanyName}`;

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb
                        maintitle="Services"
                        title="Currency Master"
                        pageTitle="Services"
                    />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <FormsHeader
                                        formName="Currency Master"
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
                    Add Currency
                </ModalHeader>
                <form>
                    <ModalBody>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                placeholder="Enter Currency Name"
                                required
                                name="currencyName"
                                value={values.currencyName}
                                onChange={handleChange}
                            />
                            <Label>
                                Currency Name{" "}
                                <span className="text-danger">*</span>
                            </Label>
                            {isSubmit && (
                                <p className="text-danger">
                                    {formErrors.currencyName}
                                </p>
                            )}
                        </div>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                placeholder="Enter Currency Code"
                                required
                                name="currencyCode"
                                value={values.currencyCode}
                                onChange={handleChange}
                            />
                            <Label>
                                Currency Code{" "}
                                <span className="text-danger">*</span>
                            </Label>
                            {isSubmit && (
                                <p className="text-danger">
                                    {formErrors.currencyCode}
                                </p>
                            )}
                        </div>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                placeholder="Enter Currency Symbol"
                                required
                                name="currencySymbol"
                                value={values.currencySymbol}
                                onChange={handleChange}
                            />
                            <Label>
                                Currency Symbol{" "}
                                <span className="text-danger">*</span>
                            </Label>
                            {isSubmit && (
                                <p className="text-danger">
                                    {formErrors.currencySymbol}
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
                    Edit Service
                </ModalHeader>
                <form>
                    <ModalBody>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                placeholder="Enter Currency Name"
                                required
                                name="currencyName"
                                value={values.currencyName}
                                onChange={handleChange}
                            />
                            <Label>
                                Currency Name{" "}
                                <span className="text-danger">*</span>
                            </Label>
                            {isSubmit && (
                                <p className="text-danger">
                                    {formErrors.currencyName}
                                </p>
                            )}
                        </div>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                placeholder="Enter Currency Code"
                                required
                                name="currencyCode"
                                value={values.currencyCode}
                                onChange={handleChange}
                            />
                            <Label>
                                Currency Code{" "}
                                <span className="text-danger">*</span>
                            </Label>
                            {isSubmit && (
                                <p className="text-danger">
                                    {formErrors.currencyCode}
                                </p>
                            )}
                        </div>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                placeholder="Enter Currency Symbol"
                                required
                                name="currencySymbol"
                                value={values.currencySymbol}
                                onChange={handleChange}
                            />
                            <Label>
                                Currency Symbol{" "}
                                <span className="text-danger">*</span>
                            </Label>
                            {isSubmit && (
                                <p className="text-danger">
                                    {formErrors.currencySymbol}
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

export default CurrencyMaster;
