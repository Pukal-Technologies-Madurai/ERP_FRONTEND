import React, { useEffect, useState, useContext } from 'react';
import { isEqualNumber, LocalDateWithTime } from '../../Components/functions';
import api from '../../API';
import { toast } from 'react-toastify'
import { Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@mui/material';
import { Upload } from '@mui/icons-material'
import { MyContext } from '../../Components/context/contextProvider';
import { fetchLink } from '../../Components/fetchComponent';


const InwardActivity = () => {
    const { contextObj } = useContext(MyContext);
    const [inwardActivity, setInwardActivity] = useState([]);
    const [reload, setReload] = useState(false);
    const initialValue = {
        image: '',
        dialog: false
    }
    const [inputValues, setInputValues] = useState(initialValue);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp']

    useEffect(() => {
        fetch(`${api}dataEntry/inwardActivity`)
            .then(res => res.json())
            .then(data => setInwardActivity(data.data))
            .catch(e => console.error(e))
    }, [reload])

    const handlePaste = async (event) => {
        const items = event.clipboardData.items;
        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const blob = item.getAsFile();
                setInputValues(pre => ({
                    ...pre,
                    image: blob,
                }))
                break;
            }
        }
    };

    const uploadInwardImage = () => {
        const formData = new FormData();
        formData.append('image', inputValues.image);
        if (inputValues?.image) {
            fetch(`${api}dataEntry/inwardActivity`, {
                method: 'POST',
                body: formData
            }).then(res => res.json())
                .then(data => {
                    if (data.success) {
                        toast.success(data.message);
                        imageUploadDialogClose()
                        setReload(!reload)
                    } else {
                        toast.error(data.message)
                    }
                }).catch(e => console.error(e))
        }
    }

    const imageUploadDialogClose = () => {
        setInputValues(initialValue);
    }

    const saveImage = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = objectUrl;
            a.download = 'pasted-image.png';
            a.click();
            URL.revokeObjectURL(objectUrl);
        } catch (error) {
            console.error("Failed to create object URL:", error);
        }
    };

    return (
        <>
            <div className="p-3 pt-0 fa-16 fw-bold d-flex justify-content-between align-items-center">
                <span>Inward Activities</span>
                {isEqualNumber(contextObj?.Add_Rights, 1) && (
                    <Button 
                        variant='outlined' 
                        onClick={() => setInputValues(pre => ({ ...pre, dialog: true }))}
                        startIcon={<Upload />}
                    >
                        Upload Image
                    </Button>
                )}
            </div>

            <CardContent>
                {inwardActivity?.length > 0 && (
                    inwardActivity?.map((o, i) => (
                        <div key={i}>
                            <h5>Updated At: <span className='text-muted'>{o?.modifiedTime && LocalDateWithTime(o?.modifiedTime)}</span></h5>
                            <Tooltip title='Click image to Download'>
                                <img
                                    src={o?.url}
                                    alt="img"
                                    onClick={() => saveImage(o?.url)}
                                    style={{ maxWidth: '100%', maxHeight: 700, marginTop: 10, cursor: 'pointer' }}
                                />
                            </Tooltip>
                        </div>
                    ))
                )}
            </CardContent>

            <Dialog
                open={inputValues.dialog}
                onClose={imageUploadDialogClose}
                fullWidth maxWidth='lg'
            >
                <DialogTitle>
                    Upload Inward Activity
                </DialogTitle>
                <DialogContent>
                    <textarea
                        type='file'
                        className="drag-and-drop mt-2"
                        onPaste={handlePaste}
                        placeholder='Paste Excel Rows...'
                        rows={4}
                    />

                    <div className=' d-flex align-items-center my-2'>
                        <hr className='w-100' />
                        <span className='px-4'>OR</span>
                        <hr className='w-100' />
                    </div>

                    <label className='w-100'>Select File To Upload ( {imageExtensions.join(', ')} )</label>
                    <input
                        type='file'
                        className="cus-inpt mt-2"
                        style={{ backgroundColor: '#eaf4fe', borderColor: '#66afe9' }}
                        onChange={e => setInputValues(pre => ({ ...pre, image: e.target.files[0] }))}
                        accept="image/*"
                    />

                    {inputValues.image && (
                        <img
                            src={URL.createObjectURL(inputValues.image)}
                            alt="Pasted"
                            style={{ maxWidth: '100%', maxHeight: 700, marginTop: 10 }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={imageUploadDialogClose}>cancel</Button>
                    <Button
                        onClick={uploadInwardImage}
                        className=''
                        variant='outlined'
                    >
                        submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default InwardActivity;