import React, { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { IconButton, Collapse, Tooltip } from '@mui/material';
import { Menu, KeyboardArrowRight, KeyboardArrowDown, Circle, Logout, Dashboard, TaskAlt, Tune, BarChart, Home, TwoWheeler, Payments, SellOutlined } from '@mui/icons-material'
// import { GrAnalytics } from "react-icons/gr";
import "./layout.css";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { MyContext } from "../contextApi";
import { api } from "../../host";

const setLoclStoreage = (pageId, menu) => {
    localStorage.setItem('CurrentPage', JSON.stringify({ id: pageId, type: menu }));
}

const DispNavButtons = ({ mainBtn, subMenus, nav, sideClose, page, setPage }) => {
    const [open, setOpen] = useState(page.Main_Menu_Id === mainBtn.Main_Menu_Id);

    useEffect(() => setOpen(page.Main_Menu_Id === mainBtn.Main_Menu_Id), [page, page.Main_Menu_Id, mainBtn.Main_Menu_Id])

    const closeSide = () => {
        sideClose()
    }

    const getIcon = () => {
        const icon = [
            {
                id: 1,
                IconComp: <Dashboard className="me-2 fa-20" />
            },
            {
                id: 2,
                IconComp: <Tune className="me-2 fa-20" />
            },
            {
                id: 3,
                IconComp: <Payments className="me-2 fa-20" />
            },
            {
                id: 4,
                IconComp: <TwoWheeler className="me-2 fa-20" />
            },
            {
                id: 5,
                IconComp: <SellOutlined className="me-2 fa-20" />
            },
            {
                id: 6,
                IconComp: <TaskAlt className="me-2 fa-20" />
            },
            {
                id: 7,
                IconComp: <BarChart className="me-2 fa-20" />
            },
        ];

        const matchedIcon = icon.find(item => item.id === mainBtn.Main_Menu_Id);
        return matchedIcon ? matchedIcon.IconComp : null;
    }


    return Number(mainBtn.Read_Rights) === 1 && (
        <>

            <button className={page.Main_Menu_Id === mainBtn.Main_Menu_Id ? "sidebutton btn-active" : 'sidebutton'}
                onClick={
                    mainBtn?.PageUrl !== ""
                        ? () => {
                            nav(mainBtn?.PageUrl);
                            sideClose();
                            setPage(mainBtn);
                            setLoclStoreage(mainBtn.Main_Menu_Id, 1)
                        }
                        : () => setOpen(!open)}
            >
                <span className="flex-grow-1 d-flex justify-content-start">
                    {getIcon()}
                    {mainBtn?.MenuName}
                </span>
                {mainBtn?.PageUrl === "" && <span className=" text-end">{open ? <KeyboardArrowDown /> : <KeyboardArrowRight />}</span>}
            </button>

            {mainBtn?.PageUrl === ""
                && (
                    <Collapse in={open} timeout="auto" unmountOnExit >
                        {subMenus.map((obj, i) => (
                            Number(mainBtn?.Main_Menu_Id) === Number(obj?.Main_Menu_Id) && Number(obj?.Read_Rights) === 1
                                ? <SubMenu
                                    key={i}
                                    subBtn={obj}
                                    nav={nav}
                                    sideClose={closeSide}
                                    page={page}
                                    setPage={setPage} />
                                : null
                        ))}
                    </Collapse>
                )}
        </>
    )
}

const SubMenu = ({ subBtn, nav, page, sideClose, setPage }) => {
    return (
        <>
            <button
                className={page.Sub_Menu_Id === subBtn.Sub_Menu_Id ? 'sidebutton sub-btn-active tes' : 'sidebutton tes'}
                onClick={() => {
                    nav(subBtn?.PageUrl);
                    sideClose();
                    setPage(subBtn);
                    setLoclStoreage(subBtn.Sub_Menu_Id, 2)
                }} >
                <Circle sx={{ fontSize: '6px', marginRight: '5px' }} />{' ' + subBtn?.SubMenuName}
            </button>
        </>
    );
}

function MainComponent(props) {
    const nav = useNavigate();
    const localData = localStorage.getItem("user");
    const parseData = JSON.parse(localData);
    const [sidebar, setSidebar] = useState({ MainMenu: [], SubMenu: [] });
    const { contextObj, setContextObj } = useContext(MyContext);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        fetch(`${api}api/sidebar?Auth=${'F76CCBA0B0C24EDEAFB5EA131B67F297'}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSidebar({ MainMenu: data.data[0] ? data.data[0] : [], SubMenu: data.data[1] ? data.data[1] : [] });
                    let navigated = false;
                    if (localStorage.getItem('CurrentPage')) {
                        const getPageId = JSON.parse(localStorage.getItem('CurrentPage'))
                        if (Number(getPageId?.type) === 1) {
                            for (let o of data?.data[0]) {
                                if (Number(o.Read_Rights) === 1 && o.PageUrl !== '' && (parseInt(getPageId?.id) === parseInt(o.Main_Menu_Id))) {
                                    setContextObj(o); nav(o.PageUrl);
                                    navigated = true;
                                    break;
                                }
                            }
                        } else {
                            for (let o of data?.data[1]) {
                                if (Number(o.Read_Rights) === 1 && (parseInt(o?.Sub_Menu_Id) === parseInt(getPageId.id))) {
                                    setContextObj(o); nav(o.PageUrl);
                                    navigated = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (!navigated) {
                        for (let o of data?.data[0]) {
                            if (Number(o.Read_Rights) === 1 && o.PageUrl !== '' && !navigated) {
                                setLoclStoreage(o?.Main_Menu_Id, 1)
                                setContextObj(o); nav(o.PageUrl);
                                navigated = true;
                                break;
                            }
                        }
                    }
                    if (!navigated) {
                        for (let o of data?.data[1]) {
                            if (Number(o.Read_Rights) === 1 && o.PageUrl !== '' && !navigated) {
                                setLoclStoreage(o?.Sub_Menu_Id, 2)
                                setContextObj(o); nav(o.PageUrl);
                                navigated = true;
                                break;
                            }
                        }
                    }

                    if (!navigated) {
                        navigated = true;
                        nav('/invalid-credentials')
                    }

                }
            })
            .catch(e => console.error(e))
    }, [parseData?.Autheticate_Id, parseData?.UserId, api])

    return (
        <Fragment>
            <div className="fullscreen-div">

                {/* sidebar */}

                <aside className="fixed-fullheight-sidebar">
                    <div className="sidebar-head">
                        <h4 className="my-0 ps-3">DPMS</h4>
                    </div>
                    <hr className="my-2" />
                    <div className="sidebar-body-div">

                        {sidebar.MainMenu.map((o, i) => (
                            <DispNavButtons
                                key={i}
                                mainBtn={o}
                                subMenus={sidebar.SubMenu}
                                nav={nav}
                                sideOpen={handleShow}
                                sideClose={handleClose}
                                page={contextObj}
                                setPage={setContextObj} />
                        ))}

                    </div>
                    <div className="sidebar-bottom">
                        <button className="logout-btn" onClick={props.logout}>
                            <span className=" flex-grow-1 text-start">Logout</span>
                            <Logout className="fa-in" />
                        </button>
                    </div>
                </aside>

                <div className="content-div">

                    <div className="navbar-div">

                        <div className="fa-16 fw-bold mb-0 d-flex align-items-center" >

                            <span className="open-icon">
                                <IconButton onClick={handleShow} className="text-dark" size="small">
                                    <Menu />
                                </IconButton>
                            </span>

                            <div className="ms-2 flex-grow-1 d-flex flex-column">
                                <span className="flex-grow-1">Welcome {parseData?.Name + " !"}</span>
                                <span className="text-muted fa-12">Login Time: { }</span>
                            </div>

                            <Tooltip title="Logout">
                                <IconButton onClick={props.logout} color="primary" size="small"><Logout /></IconButton>
                            </Tooltip>


                        </div>
                        
                    </div>

                    <div className="content-body">
                        <Breadcrumb>
                            {!contextObj?.Sub_Menu_Id ? (
                                <Breadcrumb.Item href="#">{contextObj?.MenuName}</Breadcrumb.Item>
                            ) : (
                                <>
                                    {sidebar?.MainMenu.map((o, i) => (
                                        parseInt(o?.Main_Menu_Id) === parseInt(contextObj?.Main_Menu_Id) && (
                                            <Breadcrumb.Item href="#" key={i}>{o?.MenuName}</Breadcrumb.Item>
                                        )
                                    ))}
                                    <Breadcrumb.Item href="#">{contextObj?.SubMenuName}</Breadcrumb.Item>
                                </>
                            )}
                        </Breadcrumb>
                        {Number(contextObj?.Read_Rights) === 1 ? props.children : (
                            <div className="d-flex flex-column align-items-center justify-content-center p-5">
                                <h5>404 Page Not Found ☹️</h5>
                                <button
                                    className="btn btn-primary rounded-5 px-5"
                                    onClick={() => window.location.reload()}
                                >
                                    Refresh
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>


            <Offcanvas show={show} onHide={handleClose}>
                <Offcanvas.Header style={{ backgroundColor: '#333', color: 'white' }} closeButton>
                    <Offcanvas.Title >Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body style={{ backgroundColor: '#333' }}>

                    <button className={'sidebutton'} onClick={() => window.location.href = `${process.env.REACT_APP_ERP_ADDRESS}?Auth=${parseData?.Autheticate_Id}`}>
                        <span className="flex-grow-1 d-flex justify-content-start">
                            <Home className="me-2 fa-20" style={{ color: '#FDD017' }} />
                            {'ERP HOME'}
                        </span>
                    </button>

                    {sidebar.MainMenu.map((o, i) => (
                        <DispNavButtons
                            key={i}
                            mainBtn={o}
                            subMenus={sidebar.SubMenu}
                            nav={nav}
                            sideOpen={handleShow}
                            sideClose={handleClose}
                            page={contextObj}
                            setPage={setContextObj} />
                    ))}
                </Offcanvas.Body>
            </Offcanvas>

        </Fragment>
    );
}

export default MainComponent;