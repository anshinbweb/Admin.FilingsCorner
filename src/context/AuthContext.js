import { createContext, use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSuperAdmin } from "../functions/SuperAdmin/SuperAdminFunc";
import { getCompany } from "../functions/Admin/adminFunc";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [adminData, setAdminData] = useState(null);

    const navigate = useNavigate();

    const getAdmin = () => {
        const _id = localStorage.getItem("_id");
        const role = localStorage.getItem("role");
        if (!_id || !role) navigate("/");
        if (role === "admin") {
            getCompany(_id)
                .then((res) => {
                    setAdminData({...res,role:role});
                })
                .catch((error) => {
                    console.log("error", error);
                    navigate("/");
                });
        }
        if (role === "superadmin") {
            getSuperAdmin()
                .then((res) => {
                    setAdminData({...res,role:role});
                })
                .catch((error) => {
                    console.log("error", error);
                    navigate("/");
                });
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            getAdmin();
        }
    }, [navigate]);

    return (
        <AuthContext.Provider value={{ adminData, setAdminData }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
