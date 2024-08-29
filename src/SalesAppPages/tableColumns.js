const customSelectStyles = {
    control: (provided, state) => ({
        ...provided,
        height: '45px',
        background: 'rgba(255, 255, 255, 0.322)'
    }),
    menu: (provided, state) => ({
        ...provided,
        zIndex: 9999,
    }),
};

const customSelectStyles2 = {
    control: (provided, state) => ({
        ...provided,
        background: 'transparent',
        border: 'none',
        color: 'rgba(255, 255, 255, 0.322)',
        // minWidth: '160px'
    }),
    menu: (provided, state) => ({
        ...provided,
        color: 'black',
        zIndex: 9999,
    }),
};

const customTableStyles = {
    table: {
        style: {
            width: 'auto',
            backgroundColor: 'transparent',
            // borderRadius: '5px',
        }
    },
    rows: {
        style: {
            backgroundColor: 'transparent',
        },
    },
    headCells: {
        style: {
            backgroundColor: '#6b9080f8',
            color: 'white',
            fontSize: '14px',
            // borderRadius: '5px',
        },
    },
};

const MainMenu = [
    {
        id: 1,
        headname: 'Menu ID',
        variant: 'head',
        align: 'left',
        width: 100
    },
    {
        id: 2,
        headname: 'MenuName',
    },
    {
        id: 3,
        headname: 'Read Rights'
    },
    {
        id: 4,
        headname: 'Add Rights'
    },
    {
        id: 5,
        headname: 'Edit Rights'
    },
    {
        id: 6,
        headname: 'Delete Rights'
    },
    {
        id: 7,
        headname: 'Print Rights'
    },
    {
        id: 8,
        headname: 'Action'
    }
];

const prodetails = [
    {
        name: 'SNo',
        selector: (row, i) => i + 1,
        sortable: false,
        width: '60px'
    },
    {
        name: 'Product Name',
        selector: (row) => row.Product_Name,
        sortable: true,
        minWidth: '350px',
    },
    {
        name: 'Quantity',
        selector: (row) => row.Bill_Qty,
        sortable: true,
    },
    {
        name: 'Rate',
        selector: (row) => row.Item_Rate,
        sortable: true,
    },
    {
        name: 'Amount',
        selector: (row) => row.Amount,
        sortable: true,
    },
]

export {
    MainMenu,
    customSelectStyles,
    customSelectStyles2,
    customTableStyles,
    prodetails,
}