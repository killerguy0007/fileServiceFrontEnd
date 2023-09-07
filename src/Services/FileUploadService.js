import { POST } from "../Network/network.js";


export const fileUploadService = async(file, onUploadProgress) => {
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

    return await POST(
        process.env.REACT_APP_FILE_UPLOAD_URL,
        headers,
        params,
        formData,
        cusotmOptions
    );
}
