import { Fragment, useEffect, useState } from "react";
import FilterableTable from "../../../Components/filterableTable2";
import { groupData, calcTotal, calcAvg } from "../../../Components/functions";
import { Autocomplete, Button, Checkbox, Dialog, DialogActions, DialogContent, IconButton, TextField, Tooltip } from "@mui/material";
import { CheckBoxOutlineBlank, CheckBox, FilterAltOff } from '@mui/icons-material'

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

const ProductBasedSalesReport = ({ dataArray, filterDialog, closeDialog }) => {
    const [filters, setFilters] = useState({});
    const [showData, setShowData] = useState([]);
    const [filteredData, setFilteredData] = useState(showData);
    const columns = [
        {
            Fied_Data: "string",
            Field_Name: "Stock_Group",
            isVisible: 1
        },
        {
            Fied_Data: "string",
            Field_Name: "Item_Name_Modified",
            isVisible: 1
        },
        // {
        //     Fied_Data: "date",
        //     Field_Name: "invoice_date",
        //     isVisible: 1
        // },
        // {
        //     Fied_Data: "number",
        //     Field_Name: "bill_qty",
        //     isVisible: 1
        // },
    ];

    useEffect(() => {
        applyFilters();
    }, [filters]);

    const handleFilterChange = (column, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [column]: value,
        }));
    };

    const applyFilters = () => {
        let filtered = [...dataArray];
        for (const column of columns) {
            if (filters[column.Field_Name]) {
                if (filters[column.Field_Name].type === 'range') {
                    const { min, max } = filters[column.Field_Name];
                    filtered = filtered.filter(item => {
                        const value = item[column.Field_Name];
                        return (min === undefined || value >= min) && (max === undefined || value <= max);
                    });
                } else if (filters[column.Field_Name].type === 'date') {
                    const { start, end } = filters[column.Field_Name].value;
                    filtered = filtered.filter(item => {
                        const dateValue = new Date(item[column.Field_Name]);
                        return (start === undefined || dateValue >= new Date(start)) && (end === undefined || dateValue <= new Date(end));
                    });
                } else if (Array.isArray(filters[column.Field_Name])) {
                    filtered = filters[column.Field_Name]?.length > 0 ? filtered.filter(item => filters[column.Field_Name].includes(item[column.Field_Name].toLowerCase().trim())) : filtered
                }
            }
        }
        setFilteredData(filtered);
    };

    const renderFilter = (column) => {
        const { Field_Name, Fied_Data } = column;
        if (Fied_Data === 'number') {
            return (
                <div className='d-flex justify-content-between px-2'>
                    <input
                        placeholder="Min"
                        type="number"
                        className="bg-light border-0 m-1 p-1 w-50"
                        value={filters[Field_Name]?.min ?? ''}
                        onChange={(e) => handleFilterChange(Field_Name, { type: 'range', ...filters[Field_Name], min: e.target.value ? parseFloat(e.target.value) : undefined })}
                    />
                    <input
                        placeholder="Max"
                        type="number"
                        className="bg-light border-0 m-1 p-1 w-50"
                        value={filters[Field_Name]?.max ?? ''}
                        onChange={(e) => handleFilterChange(Field_Name, { type: 'range', ...filters[Field_Name], max: e.target.value ? parseFloat(e.target.value) : undefined })}
                    />
                </div>
            );
        } else if (Fied_Data === 'date') {
            return (
                <div className='d-flex justify-content-between px-2'>
                    <input
                        placeholder="Start Date"
                        type="date"
                        className="bg-light border-0 m-1 p-1 w-50"
                        value={filters[Field_Name]?.value?.start ?? ''}
                        onChange={(e) => handleFilterChange(Field_Name, { type: 'date', value: { ...filters[Field_Name]?.value, start: e.target.value || undefined } })}
                    />
                    <input
                        placeholder="End Date"
                        type="date"
                        className="bg-light border-0 m-1 p-1 w-50"
                        value={filters[Field_Name]?.value?.end ?? ''}
                        onChange={(e) => handleFilterChange(Field_Name, { type: 'date', value: { ...filters[Field_Name]?.value, end: e.target.value || undefined } })}
                    />
                </div>
            );
        } else if (Fied_Data === 'string') {
            const distinctValues = [...new Set(dataArray.map(item => item[Field_Name]?.toLowerCase()?.trim()))];
            return (
                <Autocomplete
                    multiple
                    id={`${Field_Name}-filter`}
                    options={distinctValues}
                    disableCloseOnSelect
                    getOptionLabel={option => option}
                    value={filters[Field_Name] || []}
                    onChange={(event, newValue) => handleFilterChange(Field_Name, newValue)}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                            />
                            {option}
                        </li>
                    )}
                    isOptionEqualToValue={(opt, val) => opt === val}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={Field_Name}
                            placeholder={`Select ${Field_Name?.replace(/_/g, ' ')}`}
                        />
                    )}
                />
            );
        }
    };

    useEffect(() => {
        const dataToUse = (Object.keys(filters).length > 0) ? filteredData : dataArray;

        const stockGroup = groupData(dataToUse, 'Stock_Group');

        const stockGroupAggregation = Array.isArray(stockGroup) ? stockGroup.map(grpPro => ({
            ...grpPro,
            Items_Count: Array.isArray(grpPro.groupedData) ? grpPro.groupedData.length : 0,
            Billed_Qty: calcTotal(grpPro.groupedData, 'bill_qty'),
            Average_Billed_Quantity: calcAvg(grpPro.groupedData, 'bill_qty'),
            M3_Avg: calcAvg(grpPro.groupedData, 'M3_Avg'),
            M6_Avg: calcAvg(grpPro.groupedData, 'M6_Avg'),
            M9_Avg: calcAvg(grpPro.groupedData, 'M9_Avg'),
            M12_Avg: calcAvg(grpPro.groupedData, 'M12_Avg'),
        })) : [];

        const groupINM = Array.isArray(stockGroupAggregation) ? stockGroupAggregation.map(sGrp => ({
            ...sGrp,
            groupedData: Array.isArray(sGrp.groupedData) ? groupData(sGrp.groupedData, 'Item_Name_Modified') : []
        })) : []

        const groupedProductAggregations = Array.isArray(groupINM) ? groupINM.map(sGrp => ({
            ...sGrp,
            groupedData: Array.isArray(sGrp.groupedData) ? sGrp.groupedData.map(inm => ({
                ...inm,
                Total_Quantity: calcTotal(inm.groupedData, 'bill_qty'),
                Billed_Qty: calcTotal(inm.groupedData, 'bill_qty'),
                Billed_Qty_Avg: calcAvg(inm.groupedData, 'bill_qty'),
                M3_Avg: calcAvg(inm.groupedData, 'M3_Avg'),
                M6_Avg: calcAvg(inm.groupedData, 'M6_Avg'),
                M9_Avg: calcAvg(inm.groupedData, 'M9_Avg'),
                M12_Avg: calcAvg(inm.groupedData, 'M12_Avg'),
                Product_Groups: Array.isArray(inm.groupedData) ? inm.groupedData.length : 0,
            })) : [],
        })) : []

        const invoiceDates = Array.isArray(groupedProductAggregations) ? groupedProductAggregations.map(sGrp => ({
            ...sGrp,
            groupedData: Array.isArray(sGrp.groupedData) ? sGrp.groupedData.map(inm => ({
                ...inm,
                groupedData: Array.isArray(inm.groupedData) ? groupData(inm.groupedData, 'invoice_date') : []
            })) : []
        })) : []

        const invoiceDatesAggregations = Array.isArray(invoiceDates) ? invoiceDates.map(sGrp => ({
            ...sGrp,
            groupedData: Array.isArray(sGrp.groupedData) ? sGrp.groupedData.map(inm => ({
                ...inm,
                groupedData: Array.isArray(inm.groupedData) ? inm.groupedData.map(invDate => ({
                    ...invDate,
                    Total_Quantity: calcTotal(invDate.groupedData, 'bill_qty'),
                    Billed_Qty: calcTotal(invDate.groupedData, 'bill_qty'),
                    Billed_Qty_Avg: calcAvg(invDate.groupedData, 'bill_qty'),
                    M3_Avg: calcAvg(invDate.groupedData, 'M3_Avg'),
                    M6_Avg: calcAvg(invDate.groupedData, 'M6_Avg'),
                    M9_Avg: calcAvg(invDate.groupedData, 'M9_Avg'),
                    M12_Avg: calcAvg(invDate.groupedData, 'M12_Avg'),
                    Date_Groups: Array.isArray(invDate.groupedData) ? invDate.groupedData.length : 0,
                })) : []
            })) : []
        })) : []


        setShowData(invoiceDatesAggregations)

    }, [filters, dataArray, filteredData])





    // console.log(invoiceDatesAggregations)

    return (
        <Fragment>
            <div className="row">
                <div className="col-xxl-10 col-lg-9 col-md-8">
                    <FilterableTable
                        dataArray={showData}
                        isExpendable={true}
                        columns={[
                            {
                                Field_Name: 'Stock_Group',
                                isVisible: 1,
                                Fied_Data: 'string',
                            },
                            {
                                Field_Name: 'Billed_Qty',
                                isVisible: 1,
                                Fied_Data: 'number',
                            },
                            {
                                Field_Name: 'M3_Avg',
                                isVisible: 1,
                                Fied_Data: 'number',
                            },
                            {
                                Field_Name: 'M6_Avg',
                                isVisible: 1,
                                Fied_Data: 'number',
                            },
                            {
                                Field_Name: 'M9_Avg',
                                isVisible: 1,
                                Fied_Data: 'number',
                            },
                            {
                                Field_Name: 'M12_Avg',
                                isVisible: 1,
                                Fied_Data: 'number',
                            },
                        ]}
                        expandableComp={({ row }) => {
                            return (
                                <FilterableTable
                                    initialPageCount={10}
                                    dataArray={Array.isArray(row.groupedData) ? row.groupedData : []}
                                    columns={[
                                        {
                                            Field_Name: 'Item_Name_Modified',
                                            isVisible: 1,
                                            Fied_Data: 'string',
                                        },
                                        {
                                            Field_Name: 'Billed_Qty',
                                            isVisible: 1,
                                            Fied_Data: 'number',
                                        },
                                        {
                                            Field_Name: 'M3_Avg',
                                            isVisible: 1,
                                            Fied_Data: 'number',
                                        },
                                        {
                                            Field_Name: 'M6_Avg',
                                            isVisible: 1,
                                            Fied_Data: 'number',
                                        },
                                        {
                                            Field_Name: 'M9_Avg',
                                            isVisible: 1,
                                            Fied_Data: 'number',
                                        },
                                        {
                                            Field_Name: 'M12_Avg',
                                            isVisible: 1,
                                            Fied_Data: 'number',
                                        },
                                    ]}
                                    isExpendable={true}
                                    expandableComp={({ row }) => {
                                        return (
                                            <FilterableTable
                                                dataArray={row.groupedData}
                                                initialPageCount={10}
                                                columns={[
                                                    {
                                                        Field_Name: 'invoice_date',
                                                        isVisible: 1,
                                                        Fied_Data: 'date',
                                                    },
                                                    {
                                                        Field_Name: 'Billed_Qty',
                                                        isVisible: 1,
                                                        Fied_Data: 'number',
                                                    },
                                                ]}
                                            />
                                        )
                                    }}
                                />
                            )
                        }}
                        tableMaxHeight={540}
                    />
                </div>

                <div className="col-xxl-2 col-lg-3 col-md-4 d-none d-md-block">
                    <h5 className="d-flex justify-content-between px-2">
                        Filters
                        <Tooltip title='Clear Filters'>
                            <IconButton
                                size="small"
                                onClick={() => setFilters({})}
                            >
                                <FilterAltOff />
                            </IconButton>
                        </Tooltip>
                    </h5>
                    <div className="border rounded-3 " style={{ maxHeight: '70vh', overflow: 'auto' }}>
                        {columns.map((column, ke) => (
                            <div key={ke} className="py-3 px-3 hov-bg border-bottom">
                                <label className='mt-2 mb-1'>{column?.Field_Name?.replace(/_/g, ' ')}</label>
                                {renderFilter(column)}
                            </div>
                        ))}
                        <br />
                    </div>
                </div>
            </div>

            <Dialog
                open={filterDialog}
                onClose={closeDialog}
                maxWidth='sm' fullWidth
            >
                <DialogContent>
                    <h5 className="d-flex justify-content-between px-2">
                        Filters
                        <Tooltip title='Clear Filters'>
                            <IconButton
                                size="small"
                                onClick={() => setFilters({})}
                            >
                                <FilterAltOff />
                            </IconButton>
                        </Tooltip>
                    </h5>
                    <div className="border rounded-3 " style={{ maxHeight: '70vh', overflow: 'auto' }}>
                        {columns.map((column, ke) => (
                            <div key={ke} className="py-3 px-3 hov-bg border-bottom">
                                <label className='mt-2 mb-1'>{column?.Field_Name?.replace(/_/g, ' ')}</label>
                                {renderFilter(column)}
                            </div>
                        ))}
                        <br />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color='error'>close</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    )

}

export default ProductBasedSalesReport;