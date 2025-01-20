import React from "react";
import { Navigate } from "react-router-dom";
import Login from "../pages/Authentication/Login";
import UserProfile from "../pages/Authentication/user-profile";

import Country from "../pages/LocationSetUp/Country/Country";
import City from "../pages/LocationSetUp/City/City";
import State from "../pages/LocationSetUp/State/State";
import CompanyLocation from "../pages/LocationSetUp/CompanyLocation";

import CategoryMaster from "../pages/Category/CategoryMaster";
import Blogs from "../pages/Blogs/Blogs";
import PromocodeMaster from "../pages/Subscription/PromocodeMaster";
import ProductDetails from "../pages/Products/ProductsDetails";
import Banner from "../pages/CMS/Banner";
import CompanyDetails from "../pages/CompanyDetails";
import AdminUser from "../pages/Auth/AdminUser";
import CompanyMaster from "../pages/Master/CompanyMaster";
import EmployeeMaster from "../pages/Master/EmployeeMaster";
import RequiredDocuments from "../pages/Services/RequiredDocuments";
import ServiceMaster from "../pages/Services/ServiceMaster";
import FrequencyOptions from "../pages/Services/FrequencyOptions";
import RateCard from "../pages/Services/RateCard";
import ServiceGroups from "../pages/Services/ServiceGroups";
import CurrencyMaster from "../pages/Services/CurrencyMaster";

const authProtectedRoutes = [
    { path: "/profile", component: <UserProfile /> },
    { path: "/company-details", component: <CompanyDetails /> },
    { path: "/employee-master", component: <EmployeeMaster /> },
    { path: "/required-documents", component: <RequiredDocuments /> },
    { path: "/service-master", component: <ServiceMaster /> },
    { path: "/frequency-option", component: <FrequencyOptions /> },
    { path: "/rate-card-master", component: <RateCard/> },
    { path: "/service-groups", component: <ServiceGroups/> },
    { path: "/currency-master", component: <CurrencyMaster/> },
    // { path: "/admin-user", component: <AdminUser /> },
    // { path: "/category", component: <CategoryMaster /> },
    // { path: "/blogs", component: <Blogs /> },
    // { path: "/banner", component: <Banner /> },
    // { path: "/promocode-master", component: <PromocodeMaster /> },
    // { path: "/product-details", component: <ProductDetails /> },
    {
        path: "/",
        exact: true,
        component: <Navigate to="/profile" />,
    },
    { path: "*", component: <Navigate to="/profile" /> },
];

const superadminRoutes = [
    { path: "/company-master", component: <CompanyMaster /> },
    { path: "/country", component: <Country /> },
    { path: "/city", component: <City /> },
    { path: "/state", component: <State /> },
    { path: "/location", component: <CompanyLocation /> },
];

const publicRoutes = [{ path: "/", component: <Login /> }];

export { authProtectedRoutes, publicRoutes, superadminRoutes };
