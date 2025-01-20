import axios from "axios";

export const createCurrencyMaster = async (values) => {
    return await axios.post(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/create/currency-master`,
        values,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
};

export const deleteCurrencyMaster = async (_id) => {
    return await axios.delete(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/delete/currency-master/${_id}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
};

export const getCurrencyMasterById = async (_id) => {
    return await axios.get(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/get/currency-master/${_id}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
};

export const updateCurrencyMaster = async (_id, values) => {
    return await axios.put(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/update/currency-master/${_id}`,
        values,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
};

export const getCurrencyByCompanyId = async (companyId) => {
    return await axios.get(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/list/currency-master/${companyId}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
}