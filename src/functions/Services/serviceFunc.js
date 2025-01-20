import axios from "axios";

export const createService = async (values) => {
    return await axios.post(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/create/service`,
        values,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
};

export const deleteService = async (_id) => {
    return await axios.delete(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/delete/service/${_id}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
};

export const getServiceById = async (_id) => {
    return await axios.get(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/get/service/${_id}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
};

export const updateService = async (_id, values) => {
    return await axios.put(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/update/service/${_id}`,
        values,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
};

export const getServiceByCompanyId = async (companyId) => {
    return await axios.get(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/list/service/${companyId}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
};
