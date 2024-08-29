
import SMT_LOGO from './smt.png'

export const customSelectStyles = {
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

export const customSelectStyles2 = {
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

export const MainMenu = [
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

export const companyDetails = [
    {
        dataBase: 1,
        name: 'SHANKAR TRADERS',
        business: 'Wholesale Merchant in Dhall',
        address: '32, Chitrakara Street, Madurai - 01 <br /> Bill of Supply -Disclaimer Affidavlt Field Extemped',
        logo: SMT_LOGO,
        gstin: '33AADFS6973R1ZD',
        phone: '984-313-1353, 984-335-5166',
        fssai: '12418012000818',
        bankAccount: '0021 5032 0885 122',
        ifsc: 'TMBL0000002'
    },
    {
        dataBase: 2,
        name: 'SMT AGRO PRODUCTS',
        business: '',
        address: 'H.O: 153, Chitrakara Street, 2nd Floor, Madurai -01 <br /> G.O: 746 Puliyur, Sayanapuram, Svga <br /> Bill of Supply -Disclaimer Affidavlt Field Extemped',
        logo: SMT_LOGO,
        gstin: '33ACMFS3420Q1ZQ',
        phone: '0452-4371625',
        fssai: '12418012000818',
        bankAccount: '0025 3031 0875 947',
        ifsc: 'TMBL0000002'
    },
    {
        dataBase: 3,
        name: 'BHAVANI TRADERS',
        business: '',
        address: 'H.O: 152-A, Chitrakara Street, Madurai -01 <br /> G.O: 30/1-Rajman Nagar, Chintamani Main Road, Mdu-01 <br /> Tax Invoice',
        logo: SMT_LOGO,
        gstin: '33AAEFB6728J1ZG',
        phone: '958-559-7641, 958-559-7614',
        fssai: '12418012000670',
        bankAccount: '0021 5005 0800 309',
        ifsc: 'TMBL0000002'
    },
]

export const prodetails = [
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