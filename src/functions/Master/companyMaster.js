import axios from "axios";

export const createCompanyMaster = async (values) => {
    return await axios.post(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/create/company-master`,
        values,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
};

export const removeCompanyMaster = async (_id) => {
    return await axios.delete(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/remove/company-master/${_id}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
};

export const listCompanyMaster = async () => {
    return await axios.get(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/list/company-master`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
};

export const updateCompanyMaster = async (_id, values) => {
    return await axios.put(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/update/company-master/${_id}`,
        values,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
};

export const getCompantMaster = async (_id) => {
    return await axios.get(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/company-master/${_id}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
};
