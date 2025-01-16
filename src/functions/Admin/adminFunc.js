import axios from "axios";

export const getCompany = async (_id) => {
    return await axios.get(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/get/company-details/${_id}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
};

export const updateCompany = async (_id,data) => {
    return await axios.put(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/update/company-details/${_id}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
}
