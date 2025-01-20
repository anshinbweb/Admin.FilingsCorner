import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Collapse } from "reactstrap";

// Import Data
import navdata from "../LayoutMenuData";
import { withTranslation } from "react-i18next";
import withRouter from "../../Components/Common/withRouter";
import { AuthContext } from "../../context/AuthContext";

const VerticalLayout = (props) => {
    const [company, setCompany] = useState(false);
    const [employee, setEmployee] = useState(false);
    const [services, setServices] = useState(false);
    
    const path = props.router.location.pathname;

    const { adminData, setAdminData } = useContext(AuthContext);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        const initMenu = () => {
            const pathName = process.env.PUBLIC_URL + path;
            const ul = document.getElementById("navbar-nav");
            const items = ul.getElementsByTagName("a");
            let itemsArray = [...items]; // converts NodeList to Array
            removeActivation(itemsArray);
            let matchingMenuItem = itemsArray.find((x) => {
                return x.pathname === pathName;
            });
            if (matchingMenuItem) {
                activateParentDropdown(matchingMenuItem);
            }
        };
        if (props.layoutType === "vertical") {
            initMenu();
        }
    }, [path, props.layoutType]);

    function activateParentDropdown(item) {
        item.classList.add("active");
        let parentCollapseDiv = item.closest(".collapse.menu-dropdown");

        if (parentCollapseDiv) {
            // to set aria expand true remaining
            parentCollapseDiv.classList.add("show");
            parentCollapseDiv.parentElement.children[0].classList.add("active");
            parentCollapseDiv.parentElement.children[0].setAttribute(
                "aria-expanded",
                "true"
            );
            if (
                parentCollapseDiv.parentElement.closest(
                    ".collapse.menu-dropdown"
                )
            ) {
                parentCollapseDiv.parentElement
                    .closest(".collapse")
                    .classList.add("show");
                if (
                    parentCollapseDiv.parentElement.closest(".collapse")
                        .previousElementSibling
                )
                    parentCollapseDiv.parentElement
                        .closest(".collapse")
                        .previousElementSibling.classList.add("active");
                if (
                    parentCollapseDiv.parentElement
                        .closest(".collapse")
                        .previousElementSibling.closest(".collapse")
                ) {
                    parentCollapseDiv.parentElement
                        .closest(".collapse")
                        .previousElementSibling.closest(".collapse")
                        .classList.add("show");
                    parentCollapseDiv.parentElement
                        .closest(".collapse")
                        .previousElementSibling.closest(".collapse")
                        .previousElementSibling.classList.add("active");
                }
            }
            return false;
        }
        return false;
    }

    const removeActivation = (items) => {
        let actiItems = items.filter((x) => x.classList.contains("active"));

        actiItems.forEach((item) => {
            if (item.classList.contains("menu-link")) {
                if (!item.classList.contains("active")) {
                    item.setAttribute("aria-expanded", false);
                }
                if (item.nextElementSibling) {
                    item.nextElementSibling.classList.remove("show");
                }
            }
            if (item.classList.contains("nav-link")) {
                if (item.nextElementSibling) {
                    item.nextElementSibling.classList.remove("show");
                }
                item.setAttribute("aria-expanded", false);
            }
            item.classList.remove("active");
        });
    };

    return (
        <React.Fragment>
            {/* menu Items */}

            <li className="menu-title">
                <span data-key="t-menu">Menu</span>
            </li>

            <li className="nav-item">
                <Link
                    className="nav-link menu-link"
                    to="#"
                    data-bs-toggle="collapse"
                    onClick={() => {
                        setCompany(!company);
                    }}
                >
                    <span data-key="t-apps">Company</span>
                </Link>

                <Collapse className="menu-dropdown" isOpen={company}>
                    <ul className="nav nav-sm flex-column test">
                        {adminData?.role === "superadmin" && (
                            <li className="nav-item">
                                <Link to="/company-master" className="nav-link">
                                    Company Master
                                </Link>
                            </li>
                        )}
                        {adminData?.role === "admin" && (
                            <li className="nav-item">
                                <Link
                                    to="/company-details"
                                    className="nav-link"
                                >
                                    Company Details
                                </Link>
                            </li>
                        )}
                    </ul>
                </Collapse>
            </li>

            {adminData?.role === "admin" && (
                <>
                    <li className="nav-item">
                        <Link
                            className="nav-link menu-link"
                            to="#"
                            data-bs-toggle="collapse"
                            onClick={() => {
                                setEmployee(!employee);
                            }}
                        >
                            <span data-key="t-apps">Employee</span>
                        </Link>

                        <Collapse className="menu-dropdown" isOpen={employee}>
                            <ul className="nav nav-sm flex-column test">
                                <li className="nav-item">
                                    <Link
                                        to="/employee-master"
                                        className="nav-link"
                                    >
                                        Employee Master
                                    </Link>
                                </li>
                            </ul>
                        </Collapse>
                    </li>

                    <li className="nav-item">
                        <Link
                            className="nav-link menu-link"
                            to="#"
                            data-bs-toggle="collapse"
                            onClick={() => {
                                setServices(!services);
                            }}
                        >
                            <span data-key="t-apps">Services</span>
                        </Link>

                        <Collapse className="menu-dropdown" isOpen={services}>
                            <ul className="nav nav-sm flex-column test">
                                <li className="nav-item">
                                    <Link
                                        to="/service-master"
                                        className="nav-link"
                                    >
                                        Services Master
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        to="/frequency-option"
                                        className="nav-link"
                                    >
                                        Frequency Options
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        to="/rate-card-master"
                                        className="nav-link"
                                    >
                                        Rate Card Master
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        to="/service-groups"
                                        className="nav-link"
                                    >
                                        Service Group
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        to="/required-documents"
                                        className="nav-link"
                                    >
                                        Required Documents
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        to="/currency-master"
                                        className="nav-link"
                                    >
                                        Currency
                                    </Link>
                                </li>
                            </ul>
                        </Collapse>
                    </li>
                </>
            )}
        </React.Fragment>
    );
};

VerticalLayout.propTypes = {
    location: PropTypes.object,
    t: PropTypes.any,
};

export default withRouter(withTranslation()(VerticalLayout));
