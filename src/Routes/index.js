import React, { useContext } from 'react';
import { Routes, Route } from "react-router-dom";

//Layouts
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";

//routes
import { authProtectedRoutes, publicRoutes, superadminRoutes } from "./allRoutes";
import { AuthProtected } from './AuthProtected';
import { AuthContext } from '../context/AuthContext';

const Index = () => {

    const { adminData, setAdminData } = useContext(AuthContext);

    return (
        <React.Fragment>
            <Routes>
                <Route>
                    {!adminData && publicRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <NonAuthLayout>
                                    {route.component}
                                </NonAuthLayout>
                            }
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>

                <Route>
                    {adminData && authProtectedRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <AuthProtected>
                                    <VerticalLayout>{route.component}</VerticalLayout>
                             </AuthProtected>
                            }
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>

                <Route>
                    {adminData && adminData?.role === "superadmin" && superadminRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <AuthProtected>
                                    <VerticalLayout>{route.component}</VerticalLayout>
                             </AuthProtected>
                            }
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>
            </Routes>
        </React.Fragment>
    );
};

export default Index;