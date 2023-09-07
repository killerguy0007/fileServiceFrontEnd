import { Accordion, AccordionSummary, Alert, Button, Collapse, Grid, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { fileUploadService } from '../Services/FileUploadService';
import { DELETE, GET } from '../Network/network';
import CloseIcon from '@mui/icons-material/Close';
import { fileUpdateService } from '../Services/FileUpdateService';
import '../Screens/uploadScreen.css';

const UploadScreen = (props) => {

    const [Name, setName] = useState("");
    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [fileFetchError, setFileFetchError] = useState(false);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertServerity, setAlertSeverity] = React.useState("success");
    const [alertMessage, setAlertMessage] = React.useState("");
    const [fileReloadSwitch, setFileReloadSwitch] = React.useState(false);
    

    const selectFile = (event) => {
        event.preventDefault();
        setFile(event.target.files[0]);
        setName(event.target.files[0].name);
        setOpenAlert(false);
        setAlertMessage("")
        setAlertSeverity("success")
    }


    const uploadFile = async(event) => {
        event.preventDefault();
        setOpenAlert(false);
        setAlertMessage("")
        setAlertSeverity("success")
        if(file === null && Name === "") {
            setAlertMessage("Please select file first")
            setAlertSeverity("error")
            setOpenAlert(true);
            return;
        }
        try {
            const fileUploadResponse = await fileUploadService(file);
            await console.log(fileUploadResponse);
           
            if(fileUploadResponse.status === 200) {
                setName("");
                setFile(null)
                setAlertMessage("file Successfully uploaded")
                setAlertSeverity("success")
                
                setFileReloadSwitch(true)
            } else {
                setAlertMessage("Error Occurred while uploading file")
                setAlertSeverity("error")
            }
            setOpenAlert(true);
        } catch (error) {
            console.log(error);
            setAlertMessage("Error Occurred while uploading file")
            setAlertSeverity("error")
            setOpenAlert(true);
        }
        
    }

    const deleteFile = async(event,id) => {
        event.preventDefault();
        try {
            const fileDeleteResposne = await DELETE(`/files/${id}`);
            console.log(fileDeleteResposne)
            if(fileDeleteResposne.status === 200) {
                setAlertMessage("file Successfully deleted")
                setAlertSeverity("success")
                setFileReloadSwitch(true)
            } else {
                setAlertMessage("Error Occurred while deleting file")
                setAlertSeverity("error")
            }
            setOpenAlert(true);
        }catch(error) {
            console.log(error);
            setAlertMessage("Error Occurred while deleting file")
            setAlertSeverity("error")
            setOpenAlert(true);
        }
    }


    const downloadFile = async(event,id) => {
        event.preventDefault()
        const headers= {};
        const params ={};
        const customOptions ={responseType: 'blob'};
        try {
            const fileDownloadResponse = await GET(`/files/${id}`,headers,params,customOptions);
            console.log(fileDownloadResponse)
            const blob = new Blob([fileDownloadResponse.data], { type: fileDownloadResponse.headers['content-type']});
            const url = window.URL.createObjectURL(blob);

            // Extract the filename from the content-disposition header
            const contentDisposition = fileDownloadResponse.headers['content-disposition'];
            const filename = contentDisposition.split('filename=')[1];

            // Create a temporary anchor element to trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            console.log(fileDownloadResponse)
            if(fileDownloadResponse.status === 200) {
                setAlertMessage("file Successfully downloaded")
                setAlertSeverity("success")
            } else {
                setAlertMessage("Error Occurred while downloading file")
                setAlertSeverity("error")
            }
            setOpenAlert(true);
        } catch(error) {
            console.log(error);
            setAlertMessage("Error Occurred while downloading file")
            setAlertSeverity("error")
            setOpenAlert(true);
        }
    }

    const updateFile = async(event,id) => {
        event.preventDefault();
        setOpenAlert(false);
        setAlertMessage("")
        setAlertSeverity("success")
        if(file === null && Name === "") {
            setAlertMessage("Please select file first")
            setAlertSeverity("error")
            setOpenAlert(true);
            return;
        }
        try {
            const fileUpdateResonse = await fileUpdateService(id,file);
            console.log(fileUpdateResonse)
            if(fileUpdateResonse.status === 200) {
                setAlertMessage("file Successfully updated")
                setAlertSeverity("success")
                setFileReloadSwitch(true)
            } else {
                setAlertMessage("Error Occurred while updating file")
                setAlertSeverity("error")
            }
            setOpenAlert(true);
        }catch(error) {
            console.log(error);
            setAlertMessage("Error Occurred while updating file")
            setAlertSeverity("error")
            setOpenAlert(true);
        }
    }

    useEffect(() => {
        setFileFetchError(false);
        setFileReloadSwitch(false);
        const headers= {};
        const params ={};
        const customOptions ={};
        
        const getFilesCurrentlyInSystem = async() => {
            try {
                const getFilesResponse = await GET("/files",headers,params,customOptions);
                console.log(getFilesResponse)
                if(getFilesResponse.status === 200) {
                    setFileList(getFilesResponse.data)
                } else {
                    setFileFetchError(true);
                }
            } catch (error) {
                setFileFetchError(true);
                console.log(error);
            }
        }

        getFilesCurrentlyInSystem();
    },[fileReloadSwitch,setFileFetchError])


    return ( 
        <>
            <Grid container>
                <Grid item xs={2}></Grid>
                <Grid item xs={8}>

                    {/* upload file section */}
                    <Grid container>
                        <Grid item xs={12} alignContent="center" justifyContent="center" >
                            <h1>Hi Welcome to the upload Screen.</h1>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant = "outlined" component="label"> 
                                Select File
                                <input
                                    hidden
                                    type="file"
                                    onChange={selectFile}
                                />
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant = "outlined" onClick={uploadFile}> 
                                upload File
                            </Button>
                        </Grid>
                        {
                            Name !== "" 
                                ?
                            <Grid item xs={12}><p>{Name}</p></Grid>
                                :
                            <Grid item xs={12}><p>Please select a file to upload.</p></Grid>
                        }

                        <Grid item xs = {12}>
                            <Collapse in={openAlert}>
                                <Alert
                                    severity= {alertServerity}
                                    action={
                                        <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setOpenAlert(false);
                                        }}
                                        >
                                            <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                    }
                                    sx={{ mb: 2 }}
                                >
                                    {alertMessage}
                                </Alert>
                            </Collapse>
                        </Grid>
                    </Grid>

                    {/* view file section */}
                    <Grid container>
                        { 
                            fileFetchError 
                                ?
                            <Grid item xs = {12}>error while fetching list of files</Grid>
                                :
                            <Grid item xs = {12}>
                                <Typography variant="h6" className="list-header">
                                    List of Files
                                </Typography>
                                
                                    {fileList &&
                                    fileList.map((file, index) => (
                                        <Accordion>
                                            <AccordionSummary
                                                aria-controls="panel1a-content"
                                                id="panel1a-header"
                                                expandIcon={<></>}
                                            >
                                                <p>{file.id} {file.fileName}</p>
                                                <Button onClick = {event => downloadFile(event,file.id)}> Download </Button>
                                                <Button onClick = {event => deleteFile(event,file.id)}> Delete </Button>
                                                <Button onClick = {event => updateFile(event,file.id)}> Update </Button>
                                            </AccordionSummary>
                                        </Accordion>
                                    ))}
                            </Grid>
                             
                        }
                        

                    </Grid>
                </Grid>
                <Grid item xs={2}></Grid>
            </Grid>
        </>
    )
}

export default UploadScreen


// [
//     {
//         "id": 1,
//         "createdDate": "2023-09-03T17:36:40.000+00:00",
//         "updatedDate": "2023-09-03T17:36:40.000+00:00",
//         "deleted": false,
//         "fileName": "code share with healthPlix.pdf",
//         "fileSize": 53571,
//         "fileType": "application/pdf"
//     },
//     {
//         "id": 2,
//         "createdDate": "2023-09-03T17:37:06.000+00:00",
//         "updatedDate": "2023-09-03T17:37:06.000+00:00",
//         "deleted": false,
//         "fileName": "code share with healthPlix.pdf",
//         "fileSize": 53571,
//         "fileType": "application/pdf"
//     },
//     {
//         "id": 3,
//         "createdDate": "2023-09-03T17:37:38.000+00:00",
//         "updatedDate": "2023-09-03T17:37:38.000+00:00",
//         "deleted": false,
//         "fileName": "code share with healthPlix.pdf",
//         "fileSize": 53571,
//         "fileType": "application/pdf"
//     },
//     {
//         "id": 4,
//         "createdDate": "2023-09-03T17:38:46.000+00:00",
//         "updatedDate": "2023-09-03T17:38:46.000+00:00",
//         "deleted": false,
//         "fileName": "code share with healthPlix.pdf",
//         "fileSize": 53571,
//         "fileType": "application/pdf"
//     },
//     {
//         "id": 5,
//         "createdDate": "2023-09-03T17:39:36.000+00:00",
//         "updatedDate": "2023-09-03T17:39:36.000+00:00",
//         "deleted": false,
//         "fileName": "code share with healthPlix.pdf",
//         "fileSize": 53571,
//         "fileType": "application/pdf"
//     },
//     {
//         "id": 6,
//         "createdDate": "2023-09-03T17:42:12.000+00:00",
//         "updatedDate": "2023-09-03T17:42:12.000+00:00",
//         "deleted": false,
//         "fileName": "code share with healthPlix.pdf",
//         "fileSize": 53571,
//         "fileType": "application/pdf"
//     },
//     {
//         "id": 7,
//         "createdDate": "2023-09-03T17:43:45.000+00:00",
//         "updatedDate": "2023-09-03T17:43:45.000+00:00",
//         "deleted": false,
//         "fileName": "code share with healthPlix.pdf",
//         "fileSize": 53571,
//         "fileType": "application/pdf"
//     },
//     {
//         "id": 8,
//         "createdDate": "2023-09-04T18:48:38.000+00:00",
//         "updatedDate": "2023-09-04T18:48:38.000+00:00",
//         "deleted": false,
//         "fileName": "summary edited.pdf",
//         "fileSize": 101347,
//         "fileType": "application/pdf"
//     },
//     {
//         "id": 9,
//         "createdDate": "2023-09-04T18:48:38.000+00:00",
//         "updatedDate": "2023-09-04T18:48:38.000+00:00",
//         "deleted": false,
//         "fileName": "7_code share with healthPlix.pdf",
//         "fileSize": 53571,
//         "fileType": "application/pdf"
//     },
//     {
//         "id": 10,
//         "createdDate": "2023-09-04T19:15:33.000+00:00",
//         "updatedDate": "2023-09-04T19:15:33.000+00:00",
//         "deleted": false,
//         "fileName": "code share with healthPlix.pdf",
//         "fileSize": 53571,
//         "fileType": "application/pdf"
//     },
//     {
//         "id": 11,
//         "createdDate": "2023-09-04T19:16:06.000+00:00",
//         "updatedDate": "2023-09-04T19:16:06.000+00:00",
//         "deleted": false,
//         "fileName": "7_code share with healthPlix.pdf",
//         "fileSize": 53571,
//         "fileType": "application/pdf"
//     }
// ]