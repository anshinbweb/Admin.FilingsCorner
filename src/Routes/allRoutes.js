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

const authProtectedRoutes = [
    // { path: "/dashboard", component: <DashboardCrm /> },
    { path: "/profile", component: <UserProfile /> },
    { path: "/company-details", component: <CompanyDetails /> },
    { path: "/employee-master", component: <EmployeeMaster /> },
    { path: "/country", component: <Country /> },
    { path: "/city", component: <City /> },
    { path: "/state", component: <State /> },
    { path: "/location", component: <CompanyLocation /> },
    { path: "/admin-user", component: <AdminUser /> },
    { path: "/category", component: <CategoryMaster /> },
    { path: "/blogs", component: <Blogs /> },
    { path: "/banner", component: <Banner /> },
    { path: "/promocode-master", component: <PromocodeMaster /> },
    { path: "/product-details", component: <ProductDetails /> },
    {
        path: "/",
        exact: true,
        component: <Navigate to="/profile" />,
    },
    { path: "*", component: <Navigate to="/profile" /> },
];

const superadminRoutes = [
    { path: "/company-master", component: <CompanyMaster /> },
];

const publicRoutes = [{ path: "/", component: <Login /> }];

export { authProtectedRoutes, publicRoutes,superadminRoutes };
