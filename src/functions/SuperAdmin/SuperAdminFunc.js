import axios from "axios";

export const getSuperAdmin = async () => {
    return await axios.get(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/getadmin/superadmin`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
};
