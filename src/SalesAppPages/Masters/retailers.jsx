import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { customTableStyles } from "../tableColumns";
import { IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Card, CardContent, CardMedia, Tooltip, Button } from "@mui/material";
import { Person, Call, LocationOn, ArrowBack, Edit, Verified, Add, Delete } from "@mui/icons-material";
import '../common.css'
import Select from "react-select";
import api from "../../API";
import { customSelectStyles } from "../tableColumns";
import { toast } from 'react-toastify';
import ImagePreviewDialog from "../AppLayout/imagePreview";
import { useLocation } from "react-router-dom";

const RetailersMaster = () => {
    const storage = JSON.parse(localStorage.getItem('user'));
    const [retailers, setRetailers] = useState([]);
    const [area, setArea] = useState([]);
    const [outlet, setOutlet] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [states, setStates] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedRetailer, setSelectedRetailer] = useState({});

    const [reload, setReload] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [multipleLocationDialogs, setMultipleLocationDialogs] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [filters, setFilters] = useState({
        cust: '',
        custGet: 'All Retailer',
        area: '',
        areaGet: 'All Area',
    });

    const initialRetailerInput = {
        Company_Id: storage?.Company_id,
        Retailer_Id: '',
        Retailer_Name: '',
        Contact_Person: '',
        Mobile_No: '',
        Retailer_Channel_Id: '', //select
        Retailer_Class: '',
        Route_Id: '', //select
        Area_Id: '', //select
        Reatailer_Address: '',
        Reatailer_City: '',
        PinCode: '',
        State_Id: '', //select
        Branch_Id: storage?.BranchId,
        Gstno: '',
        Created_By: storage?.UserId,
        Updated_By: storage?.UserId,
        Latitude: null,
        Longitude: null,
        fileName: null,
        fileType: null,
        fileSize: null,
        isVisitedPlace: false,
        visitLogID: null,
    }

    const [retailerInput, setRetailerInput] = useState(initialRetailerInput);

    const location = useLocation();
    const retailerFromVisitLog = location.state?.retailer

    useEffect(() => {
        if (retailerFromVisitLog) {
            const { Reatailer_Name, Contact_Person, Contact_Mobile, Location_Address, Latitude, Longitude, ImageName, ImageType, ImageSize, Id } = retailerFromVisitLog
            setRetailerInput(pre => ({
                ...pre,
                Retailer_Name: Reatailer_Name,
                Contact_Person: Contact_Person,
                Mobile_No: Contact_Mobile,
                Reatailer_Address: Location_Address,
                Latitude: Latitude,
                Longitude: Longitude,
                fileName: ImageName,
                fileSize: ImageSize,
                fileType: ImageType,
                visitLogID: Id,
                isVisitedPlace: true
            }));
            setDialog(true);
        }
    }, [retailerFromVisitLog])

    useEffect(() => {
        fetch(`${api}masters/retailers?Company_Id=${storage?.Company_id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setRetailers(data.data);
                }
            }).catch(e => console.error(e))
    }, [reload, storage?.Company_id])

    useEffect(() => {
        fetch(`${api}masters/areas`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setArea(data.data)
                }
            }).catch(e => console.error(e))
        fetch(`${api}masters/outlets`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setOutlet(data.data)
                }
            }).catch(e => console.error(e))
        fetch(`${api}masters/routes`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setRoutes(data.data)
                }
            }).catch(e => console.error(e))
        fetch(`${api}masters/state`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setStates(data.data)
                }
            }).catch(e => console.error(e))
    }, [])

    useEffect(() => {
        const tempFilteredData = retailers.filter(o => {
            if (filters.area) {
                return Number(o?.Area_Id) === Number(filters.area);
            }
            if (filters.cust) {
                return Number(o?.Retailer_Id) === Number(filters.cust);
            }

            return true;
        });
        if (filters.area) {
            setFilters(pre => ({ ...pre, cust: '', custGet: 'All Retailer' }))
        }
        setFilteredData(tempFilteredData);
    }, [filters.area, filters.cust, retailers])

    const retailerColumn = [
        {
            name: 'Ledger',
            selector: (row) => row?.Retailer_Name,
            sortable: true,
        },
        {
            name: 'Incharge',
            selector: (row) => row?.Contact_Person,
            sortable: true,
        },
        {
            name: 'Mobile',
            selector: (row) => row.Mobile_No,
            sortable: true,
        },
        {
            name: 'Area',
            selector: (row) => row.AreaGet,
            sortable: true,
        },
        {
            name: 'Modified By',
            selector: (row) => row.lastModifiedBy,
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => (
                <>
                    <Tooltip title='Edit Retailer'>
                        <IconButton
                            size="small"
                            onClick={() => {
                                setDialog(true);
                                setIsEdit(true);
                                const {
                                    Company_Id, Retailer_Id, Retailer_Name, Contact_Person, Mobile_No,
                                    Retailer_Channel_Id, Retailer_Class, Route_Id, Area_Id, Reatailer_Address,
                                    Reatailer_City, PinCode, State_Id, Gstno,
                                } = row;
                                setRetailerInput(pre => ({
                                    ...pre,
                                    Company_Id, Retailer_Id, Retailer_Name, Contact_Person, Mobile_No,
                                    Retailer_Channel_Id, Retailer_Class, Route_Id, Area_Id, Reatailer_Address,
                                    Reatailer_City, PinCode, State_Id, Gstno
                                }))
                            }}
                        >
                            <Edit />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title='Verify Location'>
                        <IconButton
                            size="small"
                            onClick={() => { setMultipleLocationDialogs(true); setSelectedRetailer(row); }}
                            disabled={row?.AllLocations?.length === 0}
                        >
                            <Verified color={row?.AllLocations?.length === 0 ? 'disabled' : 'success'} />
                        </IconButton>
                    </Tooltip>

                    {(row?.VERIFIED_LOCATION?.latitude && row?.VERIFIED_LOCATION?.longitude) ? (
                        <Tooltip title='Open in Google Map'>
                            <IconButton
                                size="small"
                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${row?.VERIFIED_LOCATION?.latitude},${row?.VERIFIED_LOCATION?.longitude}`, '_blank')}
                                className="btn btn-info fa-14" color='primary'>
                                <LocationOn />
                            </IconButton>
                        </Tooltip>
                    ) : (row?.Latitude && row.Longitude) && (
                        <Tooltip title='Open in Google Map'>
                            <IconButton
                                size="small"
                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${row?.Latitude},${row?.Longitude}`, '_blank')}
                                className="btn btn-info fa-14" color='primary'>
                                <LocationOn />
                            </IconButton>
                        </Tooltip>
                    )
                    }
                </>
            )
        },
    ];

    const RetailerDetails = ({ data }) => {

        return (
            <div className="p-3">
                <Card sx={{ display: 'flex', mb: 1 }} >

                    <ImagePreviewDialog url={data?.imageUrl}>
                        <CardMedia
                            component="img"
                            sx={{ width: 350 }}
                            image={data?.imageUrl}
                            alt="retailer_picture"
                        />
                    </ImagePreviewDialog>

                    <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>

                        <h6 className="mb-2 fa-16 fw-bold text-primary">{data?.Reatailer_Address}</h6>
                        <p className="fw-bold fa-14 text-muted">Route: {data?.RouteGet}</p>
                        <p className="fw-bold fa-14 text-muted">Class: {data?.Retailer_Class}</p>
                        <p className="fw-bold fa-14 text-muted">
                            Created: {data?.Created_Date ? new Date(data?.Created_Date).toLocaleDateString('en-IN') : '--:--:--'}
                            &nbsp; - &nbsp;
                            {data?.createdBy}
                        </p>
                        <p><Person className="fa-13 text-primary" /> {data?.Contact_Person}</p>
                        <p><Call className="fa-13 text-primary" /> {data?.Mobile_No}</p>

                    </CardContent>
                </Card>
            </div>
        )
    }

    const closeDialog = () => {
        setDialog(false);
        setRetailerInput(initialRetailerInput);
        setIsEdit(false)
    }

    const closeMultipleLocationDialog = () => {
        setMultipleLocationDialogs(false);
        setSelectedRetailer({});

    }

    function onlynum(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    }

    const setValue = (key, value) => {
        setRetailerInput({ ...retailerInput, [key]: value });
    }

    const input = [
        {
            label: 'Retailer Name',
            elem: 'input',
            placeholder: "",
            event: (e) => setValue('Retailer_Name', e.target.value),
            required: true,
            value: retailerInput.Retailer_Name,
        },
        {
            label: 'Contact Person Name',
            elem: 'input',
            placeholder: "",
            event: (e) => setValue('Contact_Person', e.target.value),
            required: true,
            value: retailerInput.Contact_Person,
        },
        {
            label: 'Mobile Number',
            elem: 'input',
            placeholder: "",
            oninput: (e) => onlynum(e),
            event: (e) => setValue('Mobile_No', e.target.value),
            required: true,
            value: retailerInput.Mobile_No,
            // minLength: 10,
            maxLength: 10,
        },
        {
            label: 'Gstno',
            elem: 'input',
            placeholder: "",
            event: (e) => setValue('Gstno', e.target.value),
            value: retailerInput.Gstno,
            maxLength: 15,
        },
        {
            label: 'Outlet',
            elem: 'select',
            options: [
                { value: '', label: 'SELECT', disabled: true, selected: true },
                ...outlet?.map(o => ({ value: o?.Out_Let_Id, label: o?.Outlet_Type }))
            ],
            event: (e) => setValue('Retailer_Channel_Id', e.target.value),
            required: true,
            value: retailerInput.Retailer_Channel_Id,
        },
        {
            label: 'Retailer Class',
            elem: 'select',
            options: [
                { value: '', label: 'SELECT', disabled: true, selected: true },
                { value: 'A', label: 'A' },
                { value: 'B', label: 'B' },
                { value: 'C', label: 'C' }
            ],
            event: (e) => setValue('Retailer_Class', e.target.value),
            required: true,
            value: retailerInput.Retailer_Class,
        },
        {
            label: 'Route',
            elem: 'select',
            options: [
                { value: '', label: 'SELECT', disabled: true, selected: true },
                ...routes?.map(o => ({ value: o?.Route_Id, label: o?.Route_Name }))
            ],
            event: (e) => setValue('Route_Id', e.target.value),
            value: retailerInput.Route_Id,
            required: true
        },
        {
            label: 'Area',
            elem: 'select',
            options: [
                { value: '', label: 'SELECT', disabled: true, selected: true },
                ...area?.map(o => ({ value: o?.Area_Id, label: o?.Area_Name }))
            ],
            event: (e) => setValue('Area_Id', e.target.value),
            required: true,
            value: retailerInput.Area_Id,
        },
        {
            label: 'City',
            elem: 'input',
            event: (e) => setValue('Reatailer_City', e.target.value),
            value: retailerInput.Reatailer_City,
        },
        {
            label: 'Pincode',
            elem: 'input',
            placeholder: "",
            oninput: (e) => onlynum(e),
            event: (e) => setValue('PinCode', e.target.value),
            value: retailerInput.PinCode,
            maxLength: 6
        },
        {
            label: 'State',
            elem: 'select',
            options: [
                { value: '', label: 'SELECT', disabled: true, selected: true },
                ...states?.map(o => ({ value: o?.State_Id, label: o?.State_Name }))
            ],
            event: (e) => setValue('State_Id', e.target.value),
            required: true,
            value: retailerInput.State_Id,
        },
        {
            label: 'Address',
            elem: 'textarea',
            event: (e) => setValue('Reatailer_Address', e.target.value),
            required: true,
            value: retailerInput.Reatailer_Address,
        },
    ];

    useEffect(() => {
        console.log(selectedRetailer)
    }, [selectedRetailer])

    const postAndPutRetailers = () => {
        fetch(`${retailerInput.isVisitedPlace === false ? api + 'api/masters/retailers' : api + 'api/masters/retailer/convertAsRetailer'}`, {
            method: isEdit ? 'PUT' : 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(retailerInput)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    toast.success(data?.message)
                    closeDialog();
                    setReload(!reload)
                } else {
                    toast.error(data?.message)
                }
            }).catch(e => console.error(e))
    }

    const verifyRetailerLocation = (id) => {
        fetch(`${api}api/masters/retailerLocation`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Id: id })
        }).then(res => res.json())
            .then(data => {
                if (data.success) {
                    toast.success(data?.message)
                } else {
                    toast.error(data?.message)
                }
            }).catch(e => console.error(e))
    }


    return (
        <>

            <Card sx={{ mb: 1 }} >
                <div className="p-3 pb-0 d-flex align-items-center justify-content-between">
                    <h6 className="fa-18">Retailers</h6>
                    <Button variant='outlined' startIcon={<Add />} onClick={() => setDialog(true)}>Add Retailers</Button>
                </div>

                <CardContent>

                    <div className="row mb-3">

                        <div className="col-xl-3 col-md-4 col-sm-6">
                            <label>Area</label>
                            <Select
                                value={{ value: filters?.area, label: filters?.areaGet }}
                                onChange={(e) => setFilters({ ...filters, area: e.value, areaGet: e.label })}
                                options={[
                                    { value: '', label: 'All Area' },
                                    ...area.map(obj => ({ value: obj?.Area_Id, label: obj?.Area_Name }))
                                ]}
                                styles={customSelectStyles}
                                isSearchable={true}
                                placeholder={"Area Name"}
                            />
                        </div>

                        <div className="col-xl-3 col-md-4 col-sm-6">
                            <label>Retailer</label>
                            <Select
                                value={{ value: filters?.cust, label: filters?.custGet }}
                                onChange={(e) => setFilters({ ...filters, cust: e.value, custGet: e.label })}
                                options={[
                                    { value: '', label: 'All Retailer' },
                                    ...retailers.map(obj => ({ value: obj?.Retailer_Id, label: obj?.Retailer_Name }))
                                ]}
                                styles={customSelectStyles}
                                isSearchable={true}
                                placeholder={"Retailer Name"}
                                isDisabled={filters.area}
                            />
                        </div>

                    </div>

                    <div className="rounded-4 overflow-hidden" >
                        <DataTable
                            columns={retailerColumn}
                            data={
                                filteredData.length > 0
                                    ? filteredData
                                    : (filters?.area === '' && filters?.cust === '')
                                        ? retailers
                                        : []
                            }
                            pagination
                            highlightOnHover={true}
                            fixedHeader={true}
                            fixedHeaderScrollHeight={'60vh'}
                            customStyles={customTableStyles}
                            expandableRows
                            expandableRowsComponent={RetailerDetails}
                        />
                    </div>

                </CardContent>
            </Card>

            <Dialog
                open={dialog}
                onClose={closeDialog}
                fullScreen
            >
                <DialogTitle>
                    <IconButton size="small" onClick={closeDialog} className="me-2">
                        <ArrowBack />
                    </IconButton>
                    {isEdit ? 'Modify Retailer ' + retailerInput?.Retailer_Name : 'Create Retailer'}
                </DialogTitle>
                <form onSubmit={e => {
                    e.preventDefault();
                    postAndPutRetailers();
                }}>
                    <DialogContent>
                        <div className="row">
                            {input.map((field, index) => (
                                <div key={index} className={`p-2 px-3 ${field.elem !== 'textarea' ? 'col-lg-4 col-md-6' : 'col-12'}`}>
                                    <label>
                                        {field.label}
                                        {field.required && (
                                            <p style={{ color: 'red', display: 'inline', fontWeight: 'bold', fontSize: '1em' }}> *</p>
                                        )}
                                    </label>
                                    {field.elem === 'input' ? (
                                        <input
                                            type={field.type || 'text'}
                                            className='cus-inpt p-3 b-0'
                                            onChange={field.event}
                                            onInput={field.oninput}
                                            required={field.required || false}
                                            disabled={field.disabled} minLength={field.minLength}
                                            value={field.value} maxLength={field.maxLength}
                                        />
                                    ) : field.elem === 'select' ? (
                                        <select
                                            className={'cus-inpt p-3 b-0'}
                                            onChange={field.event}
                                            value={field.value}
                                            required={field.required || false}
                                        >
                                            {field.options.map((option, optionIndex) => (
                                                <option
                                                    key={optionIndex}
                                                    value={option.value}
                                                    disabled={option.disabled}
                                                    defaultValue={option.selected} >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : field.elem === 'textarea' ? (
                                        <textarea
                                            className='cus-inpt b-0'
                                            onChange={field.event}
                                            required={field.required || false}
                                            rows={4} value={field.value}
                                        />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                    <DialogActions >
                        <Button type="button" onClick={closeDialog}>cancel</Button>
                        <Button type="submit" variant='contained' color='success' >confirm</Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog
                open={multipleLocationDialogs}
                onClose={closeMultipleLocationDialog}
                maxWidth='md'
                fullWidth
            >

                <DialogTitle>Verify Location For <span className="text-primary">{selectedRetailer?.Retailer_Name}</span></DialogTitle>

                <DialogContent className="pb-0">
                    <div className="table-responsive mb-0">
                        <table className="table mb-0">
                            <thead>
                                <tr>
                                    <th className="text-center fa-14 border-0">Active</th>
                                    <th className="text-center fa-14 border-0">Created By</th>
                                    <th className="text-center fa-14 border-0">Date</th>
                                    <th className="text-center fa-14 border-0">Latitude</th>
                                    <th className="text-center fa-14 border-0">Longitude</th>
                                    <th className="text-center fa-14 border-0">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedRetailer?.AllLocations?.map((o, i) => (
                                    <tr key={i}>
                                        <td className="text-center fa-13 p-3 border-0">
                                            <input
                                                type="radio"
                                                name="location_list"
                                                defaultChecked={Number(o?.isActiveLocation) === 1}
                                                style={{ width: '20px', height: '20px' }}
                                                onChange={e => verifyRetailerLocation(o?.Id)}
                                            />
                                        </td>
                                        <td className="text-center fa-14 fw-bold p-3 border-0">{o?.EntryByGet}</td>
                                        <td className="text-center fa-13 p-3 border-0">
                                            {o?.EntryAt ? new Date(o?.EntryAt).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ' -'}
                                        </td>
                                        <td className="text-center fa-13 p-3 border-0">{o?.latitude}</td>
                                        <td className="text-center fa-13 p-3 border-0">{o?.longitude}</td>
                                        <td className="text-center fa-13 p-3 border-0">
                                            <IconButton className="me-2" size="small">
                                                <Delete className="fa-20" color='error' />
                                            </IconButton>

                                            {(o?.latitude && o.longitude) && (
                                                <Tooltip title='Open in Google Map'>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${o?.latitude},${o?.longitude}`, '_blank')}
                                                        className="btn btn-info fa-14" color='primary'>
                                                        <LocationOn />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>




                    {/* {selectedRetailer?.} */}
                </DialogContent>

                <DialogActions>
                    <Button variant='outlined' onClick={closeMultipleLocationDialog}>cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default RetailersMaster;