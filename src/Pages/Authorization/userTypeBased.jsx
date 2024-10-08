import React, { useState, useEffect, useContext } from "react";
import { Dialog, DialogActions, DialogContent, Button } from '@mui/material';
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, Checkbox } from "@mui/material";
import { UnfoldMore } from '@mui/icons-material'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { MainMenu, customSelectStyles } from "../../Components/tablecolumn";
import { MyContext } from "../../Components/context/contextProvider";
import InvalidPageComp from "../../Components/invalidCredential";
import { fetchLink } from "../../Components/fetchComponent";


const postCheck = (param, Menu_id, Menu_Type, UserId) => {
    fetchLink({
        address: `authorization/userTypeRights`,
        method: 'POST',
        bodyData: {
            MenuId: Menu_id,
            MenuType: Menu_Type,
            UserType: Number(UserId),
            ReadRights: param.readRights === true ? 1 : 0,
            AddRights: param.addRights === true ? 1 : 0,
            EditRights: param.editRights === true ? 1 : 0,
            DeleteRights: param.deleteRights === true ? 1 : 0,
            PrintRights: param.printRights === true ? 1 : 0
        },
        headers: { 'Content-Type': 'application/json' }
    }).then(data => {
        if (!data.success) {
            toast.error(data.message)
        }
    }).catch(e => console.error(e));        
}

const TRow = ({ UserId, subMenu, data }) => {
    const [open, setOpen] = useState(false);
    const [readRights, setReadRights] = useState(data.Read_Rights === 1)
    const [addRights, setAddRights] = useState(data.Add_Rights === 1)
    const [editRights, setEditRights] = useState(data.Edit_Rights === 1)
    const [deleteRights, setDeleteRights] = useState(data.Delete_Rights === 1)
    const [printRights, setPrintRights] = useState(data.Print_Rights === 1)
    const [pflag, setpFlag] = useState(false);

    useEffect(() => {
        setReadRights(data.Read_Rights === 1);
        setAddRights(data.Add_Rights === 1);
        setEditRights(data.Edit_Rights === 1);
        setDeleteRights(data.Delete_Rights === 1);
        setPrintRights(data.Print_Rights === 1);
    }, [data])

    useEffect(() => {
        if (pflag === true) {
            postCheck({ readRights, addRights, editRights, deleteRights, printRights }, data.Main_Menu_Id, 1, UserId)
        }
    }, [readRights, addRights, editRights, deleteRights, printRights])

    return (
        <>
            <TableRow key={data.Main_Menu_Id} hover={true}>
                <TableCell>{data.Main_Menu_Id}</TableCell>
                <TableCell>{data.MenuName}</TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={readRights}
                        onChange={() => { setpFlag(true); setReadRights(!readRights) }} />
                </TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={addRights}
                        onChange={() => { setpFlag(true); setAddRights(!addRights) }} />
                </TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={editRights}
                        onChange={() => { setpFlag(true); setEditRights(!editRights) }} />
                </TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={deleteRights}
                        onChange={() => { setpFlag(true); setDeleteRights(!deleteRights) }} />
                </TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={printRights}
                        onChange={() => { setpFlag(true); setPrintRights(!printRights) }} />
                </TableCell>
                <TableCell>
                    {data.PageUrl === ""
                        && <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            <UnfoldMore />
                        </IconButton>}
                </TableCell>
            </TableRow>
            <Dialog open={open} onClose={() => setOpen(!open)} maxWidth="lg" fullWidth>
                <DialogContent>
                    <h3 style={{ paddingBottom: '0.5em' }}>
                        Sub Menu
                    </h3>
                    <TableContainer component={Paper} sx={{ maxHeight: 650 }}>
                        <Table stickyHeader aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    {MainMenu.map(obj => (
                                        <TableCell
                                            key={obj.id}
                                            variant={obj.variant}
                                            align={obj.align}
                                            width={obj.width}
                                            sx={{ backgroundColor: 'rgb(15, 11, 42)', color: 'white' }}>
                                            {obj.headname}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {subMenu.map(obj => (
                                    obj.Main_Menu_Id === data.Main_Menu_Id && obj.headname !== 'Action'
                                        ? <STrow key={obj.Sub_Menu_Id} data={obj} UserId={UserId} />
                                        : null
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(!open)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}


const STrow = (props) => {
    const [open, setOpen] = useState(false);
    const { data, UserId } = props;
    const [readRights, setReadRights] = useState(data.Read_Rights === 1)
    const [addRights, setAddRights] = useState(data.Add_Rights === 1)
    const [editRights, setEditRights] = useState(data.Edit_Rights === 1)
    const [deleteRights, setDeleteRights] = useState(data.Delete_Rights === 1)
    const [printRights, setPrintRights] = useState(data.Print_Rights === 1)
    const [pflag, setpFlag] = useState(false);

    useEffect(() => {
        if (pflag === true) {
            postCheck({ readRights, addRights, editRights, deleteRights, printRights }, data.Sub_Menu_Id, 2, UserId)
        }
    }, [readRights, addRights, editRights, deleteRights, printRights])

    return (
        <>
            <TableRow key={data.Sub_Menu_Id} hover={true}>
                <TableCell>{data.Sub_Menu_Id}</TableCell>
                <TableCell>{data.SubMenuName}</TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={readRights}
                        onChange={() => { setpFlag(true); setReadRights(!readRights) }} />
                </TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={addRights}
                        onChange={() => { setpFlag(true); setAddRights(!addRights) }} />
                </TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={editRights}
                        onChange={() => { setpFlag(true); setEditRights(!editRights) }} />
                </TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={deleteRights}
                        onChange={() => { setpFlag(true); setDeleteRights(!deleteRights) }} />
                </TableCell>
                <TableCell>
                    <Checkbox
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        checked={printRights}
                        onChange={() => { setpFlag(true); setPrintRights(!printRights) }} />
                </TableCell>
                <TableCell>
                    {data.PageUrl === ""
                        && <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            <UnfoldMore />
                        </IconButton>}
                </TableCell>
            </TableRow>
        </>
    );
}



const UserTypeBased = () => {
    const localData = localStorage.getItem("user");
    const parseData = JSON.parse(localData);
    const [authData, setAuthData] = useState({ MainMenu: [], SubMenu: [] });
    const [usersType, setUserTypes] = useState([])
    const { contextObj } = useContext(MyContext);
    const [currentTypeId, setCurrentTypeId] = useState({ value: parseData?.UserTypeId, label: parseData?.UserType });

    useEffect(() => {
        fetchLink({
            address: `authorization/userTypeRights?UserType=${currentTypeId?.value}`
        }).then(data => {
            if (data.success) {
                setAuthData({ MainMenu: data?.MainMenu, SubMenu: data?.SubMenu })
            }
        })            
    }, [currentTypeId])

    useEffect(() => {
        fetchLink({
            address: `masters/userType`
        }).then((data) => {
            if (data.success) {
                setUserTypes(data.data);
            }
        });            
    }, [])



    return Number(contextObj?.Read_Rights) === 1 ? (
        <>
            <ToastContainer />
            <div className="row">
                <div className="col-sm-4 pt-1">
                    <Select
                        value={currentTypeId}
                        onChange={(e) => setCurrentTypeId({ value: e.value, label: e.label })}
                        options={[...usersType.map(obj => ({ value: obj?.Id, label: obj?.UserType }))]}
                        styles={customSelectStyles}
                        isSearchable={true}
                        placeholder={"Select UserType"}
                    />
                </div>
            </div>
            <br />
            <h6 style={{ marginBottom: '0.5em', borderBottom: '2px solid blue', width: 'fit-content' }}>Main Menu</h6>
            <TableContainer component={Paper} sx={{ maxHeight: 650 }}>
                <Table stickyHeader aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {MainMenu.map(obj => (
                                <TableCell
                                    key={obj.id}
                                    variant={obj.variant}
                                    align={obj.align}
                                    width={obj.width}
                                    sx={{ backgroundColor: 'rgb(15, 11, 42)', color: 'white' }}>
                                    {obj.headname}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {authData?.MainMenu?.map((obj, index) => (
                            <TRow
                                key={index}
                                data={obj}
                                UserId={currentTypeId.value}
                                subMenu={authData?.SubMenu} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    ) : <InvalidPageComp />
}

export default UserTypeBased;