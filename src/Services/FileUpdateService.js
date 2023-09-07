import { PUT } from "../Network/network";


export const fileUpdateService = async(id, file, onUploadProgress) => {
    let formData = new FormData();
    formData.append("file",file);
    formData.append("fileName",file.name);
    
    const headers = {}

    const cusotmOptions ={
        timeout : 0,
        processData : false,
        mimeType : "multipart/form-data",
        contentType : false,
        onUploadProgress,
    };

    const params = {};

    return await PUT(
        `files/${id}`,
        headers,
        params,
        formData,
        cusotmOptions
    );
}