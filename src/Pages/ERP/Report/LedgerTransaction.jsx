import React, { useEffect, useState, Fragment } from "react";
import { Card, CardContent, IconButton, Tooltip } from "@mui/material";
import { getPreviousDate, ISOString } from "../../../Components/functions";
import LedgerBasedSalesReport from "./LedgerBasedTable";
import ProductBasedSalesReport from "./ProductBasedTable";
import { FilterAlt } from "@mui/icons-material";
import { fetchLink } from "../../../Components/fetchComponent";

const SalesReport = () => {
    const localData = localStorage.getItem("user");
    const parseData = JSON.parse(localData);
    const [salesData, setSalesData] = useState(null);
    const [salesDataOFProduct, setSalesDataOfProduct] = useState(null);
    const [filters, setFilters] = useState({
        Fromdate: getPreviousDate(30),
        Todate: ISOString(),
        ReportType: 'LedgerBased',
        filterDialog: false,
    });

    useEffect(() => {
        setSalesData(null);
        setSalesDataOfProduct(null);
        fetchLink({
            address: `reports/salesReport/ledger?Fromdate=${filters?.Fromdate}&Todate=${filters?.Todate}`,
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Db': parseData?.Company_id
            }
        }).then(data => {
            if (data.success) {
                setSalesData(data.data)
            } else {
                setSalesData([])
            }
        })
        .catch(e => console.error(e))

        fetchLink({
            address: `reports/salesReport/products?Fromdate=${filters?.Fromdate}&Todate=${filters?.Todate}`,
            method: 'GET',
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Db': parseData?.Company_id
            }
        }).then(data => {
            if (data.success) {
                const combinedData = Array.isArray(data.data) ? data?.data.map(o => ({
                    ...o,
                    M3_Avg: (data?.others?.LOSAbstract?.find(oo => (oo.Stock_Group === o.Stock_Group) && (oo.Item_Name_Modified === o.Item_Name_Modified)))?.ALL_Avg_M3 ?? 0,
                    M6_Avg: (data?.others?.LOSAbstract?.find(oo => (oo.Stock_Group === o.Stock_Group) && (oo.Item_Name_Modified === o.Item_Name_Modified)))?.ALL_Avg_M6 ?? 0,
                    M9_Avg: (data?.others?.LOSAbstract?.find(oo => (oo.Stock_Group === o.Stock_Group) && (oo.Item_Name_Modified === o.Item_Name_Modified)))?.ALL_Avg_M9 ?? 0,
                    M12_Avg: (data?.others?.LOSAbstract?.find(oo => (oo.Stock_Group === o.Stock_Group) && (oo.Item_Name_Modified === o.Item_Name_Modified)))?.ALL_Avg_One_Year ?? 0,
                })) : [];
                setSalesDataOfProduct(combinedData);
            } else {
                setSalesDataOfProduct([])
            }
        })
        .catch(e => console.error(e))            
    }, [filters.Fromdate, filters.Todate, parseData?.Company_id])

    const closeDialog = () => {
        setFilters(pre => ({ ...pre, filterDialog: false}))
    }

    return (
        <Fragment>
            <Card className="mt-3">
                <div className="px-3 py-2 d-flex justify-content-between align-items-center fw-bold text-dark" style={{ backgroundColor: '#eae0cc' }}>
                    <span>
                        {parseData?.Company_Name}
                    </span>
                    <span>
                        <select
                            value={filters.ReportType}
                            className="cus-inpt ps-3 w-100 rounded-5 border-0"
                            onChange={e => setFilters(pre => ({ ...pre, ReportType: e.target.value }))}
                        >
                            <option value={'LedgerBased'}>Ledger Based</option>
                            <option value={'ProductBased'}>Product Based</option>
                        </select>
                    </span>
                </div>

                <CardContent>

                    <div className="mb-3">
                        <input
                            type={'date'}
                            className='cus-inpt w-auto ps-3 border rounded-5 me-1'
                            value={filters.Fromdate}
                            onChange={e => setFilters(pre => ({ ...pre, Fromdate: e.target.value }))}
                        />

                        <input
                            type={'date'}
                            className='cus-inpt w-auto ps-3 border rounded-5'
                            value={filters.Todate}
                            onChange={e => setFilters(pre => ({ ...pre, Todate: e.target.value }))}
                        />

                        <Tooltip title="Filters">
                            <IconButton
                                onClick={() => setFilters(pre => ({ ...pre, filterDialog: true }))}
                                size="small"
                                className="d-md-none d-inline"
                            >
                                <FilterAlt />
                            </IconButton>
                        </Tooltip>
                    </div>

                    {salesData === null && filters.ReportType === "LedgerBased" && (
                        <h6 className="blue-text text-center">Fetching Ledger Based data...</h6>
                    )}

                    {(salesDataOFProduct === null && filters.ReportType === "ProductBased") && (
                        <h6 className="blue-text text-center">Fetching Product Based data...</h6>
                    )}

                    {(filters.ReportType === "LedgerBased" && Array.isArray(salesData)) && (
                        <LedgerBasedSalesReport filterDialog={filters.filterDialog} closeDialog={closeDialog} dataArray={salesData} />
                    )}
                    {(filters.ReportType === "ProductBased" && Array.isArray(salesDataOFProduct)) && (
                        <ProductBasedSalesReport filterDialog={filters.filterDialog} closeDialog={closeDialog} dataArray={salesDataOFProduct} />
                    )}
                </CardContent>
            </Card>
        </Fragment>
    )

}

export default SalesReport;