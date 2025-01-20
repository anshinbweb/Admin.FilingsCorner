import axios from "axios";

export const createServiceGroup = async (values) => {
    return await axios.post(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/create/service-group`,
        values,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
};

export const deleteServiceGroup = async (_id) => {
    return await axios.delete(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/delete/service-group/${_id}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
};

export const getServiceGroupById = async (_id) => {
    return await axios.get(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/get/service-group/${_id}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
};

export const updateServiceGroup = async (_id, values) => {
    return await axios.put(
        `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/update/service-group/${_id}`,
        values,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
};

// export const getServiceByCompanyId = async (companyId) => {
//     return await axios.get(
//         `${process.env.REACT_APP_API_URL_COFFEE}/api/auth/list/service/${companyId}`,
//         {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//         }
//     );
// };
