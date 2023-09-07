import axios from "axios";

const axiosInstance = axios.create({
    timeout : 10000,
    withCredentials : true,
});


const defaultHeaders = {};

export const GET =  async (endpoint, customeHeader, params, customOptions) => {
    try {
        const response = await axiosInstance({
            method : "get",
            url : endpoint,
            params : params, 
            headers : {...customeHeader, ...defaultHeaders},
            ...customOptions,
        });
        return response;
    } catch (error) {
        throw error
    }
}


export const POST =  async (endpoint, customeHeader, params, data, customOptions) => {
    try {
        const response = await axiosInstance({
            method : "post",
            url : endpoint,
            params : params, 
            headers : {...customeHeader, ...defaultHeaders},
            data : data,
            ...customOptions,
        });
        return response;
    } catch (error) {
        throw error
    }
}

export const PUT =  async (endpoint, customeHeader, params, data, customOptions) => {
    try {
        const response = await axiosInstance({
            method : "put",
            url : endpoint,
            params : params, 
            headers : {...customeHeader, ...defaultHeaders},
            data : data,
            ...customOptions,
        });
        return response;
    } catch (error) {
        throw error
    }
}

export const DELETE = async(endpoint) => {
    try {
        const response = await axiosInstance({
            method : "delete",
            url : endpoint
        }) 
        return response;
    } catch (error) {
        throw error
    }
}