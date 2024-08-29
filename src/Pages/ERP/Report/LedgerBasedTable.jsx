import { Fragment, useEffect, useState } from "react";
import FilterableTable from "../../../Components/filterableTable2";
import { groupData, calcTotal, calcAvg } from "../../../Components/functions";
import { Autocomplete, Button, Checkbox, Dialog, DialogActions, DialogContent, IconButton, TextField, Tooltip } from "@mui/material";
import { CheckBoxOutlineBlank, CheckBox, FilterAltOff } from '@mui/icons-material'

const icon = <CheckBoxOutlineBlank fontSize="small" />;
const checkedIcon = <CheckBox fontSize="small" />;

const LedgerBasedSalesReport = ({ dataArray, filterDialog, closeDialog }) => {
    const [filters, setFilters] = useState({});
    const [showData, setShowData] = useState([]);
    const [filteredData, setFilteredData] = useState(showData);
    const columns = [
        {
            Fied_Data: "string",
            Field_Name: "Ledger_Name",
            isVisible: 1
        },
        {
            Fied_Data: "string",
            Field_Name: "Party_District",
            isVisible: 1
        },
        {
            Fied_Data: "string",
            Field_Name: "Party_Group",
            isVisible: 1
        },
        {
            Fied_Data: "string",
            Field_Name: "Party_Nature",
            isVisible: 1
        },
        {
            Fied_Data: "string",
            Field_Name: "Ref_Brokers",
            isVisible: 1
        },
        // {
        //     Fied_Data: "string",
        //     Field_Name: "Ref_Owners",
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

    const getFirstValue = (arr, column) => {
        if (Array.isArray(arr) && arr[0] && column && arr[0][column]) {
            return arr[0][column]
        } else {
            return '-'
        }
    }

    useEffect(() => {
        const dataToUse = (Object.keys(filters).length > 0) ? filteredData : dataArray;

        const groupedLedger = groupData(dataToUse, 'Ledger_Name');

        const groupedLedgerAggregations = Array.isArray(groupedLedger) ? groupedLedger.map(grpLed => ({
            ...grpLed,
            Transaction: Array.isArray(grpLed.groupedData) ? grpLed.groupedData.length : 0,
            M3_AVG_Qty: calcAvg(grpLed.groupedData, 'M3_AVG_Qty'),
            M6_AVG_Qty: calcAvg(grpLed.groupedData, 'M6_AVG_Qty'),
            M9_AVG_Qty: calcAvg(grpLed.groupedData, 'M9_AVG_Qty'),
            One_Year_AVG_Qty: calcAvg(grpLed.groupedData, 'One_Year_AVG_Qty'),
            Party_District: getFirstValue(grpLed.groupedData, 'Party_District'),
            Party_Location: getFirstValue(grpLed.groupedData, 'Party_Location'),
            Ledger_Tally_Id: getFirstValue(grpLed.groupedData, 'Ledger_Tally_Id'),
            Party_Group: getFirstValue(grpLed.groupedData, 'Party_Group'),
            Party_Nature: getFirstValue(grpLed.groupedData, 'Party_Nature'),
            Ref_Brokers: getFirstValue(grpLed.groupedData, 'Ref_Brokers'),
            Ref_Owners: getFirstValue(grpLed.groupedData, 'Ref_Owners'),
            M3_Avg: getFirstValue(grpLed.groupedData, 'ALL_Avg_M3'),
            M6_Avg: getFirstValue(grpLed.groupedData, 'ALL_Avg_M6'),
            M9_Avg: getFirstValue(grpLed.groupedData, 'ALL_Avg_M9'),
            M12_Avg: getFirstValue(grpLed.groupedData, 'ALL_Avg_One_Year'),
            Billed_Qty: calcTotal(grpLed.groupedData, 'bill_qty')
        })) : []

        const groupProuductGroup = Array.isArray(groupedLedgerAggregations) ? groupedLedgerAggregations.map(grpLed => ({
            ...grpLed,
            groupedData: Array.isArray(grpLed.groupedData) ? groupData(grpLed.groupedData, 'Stock_Group') : []
        })) : [];

        const groupedProductAggregations = Array.isArray(groupProuductGroup) ? groupProuductGroup.map(prGrp => ({
            ...prGrp,
            groupedData: Array.isArray(prGrp.groupedData) ? prGrp.groupedData.map(sGrp => ({
                ...sGrp,
                M3_AVG_Qty: calcAvg(sGrp.groupedData, 'M3_AVG_Qty'),
                M6_AVG_Qty: calcAvg(sGrp.groupedData, 'M6_AVG_Qty'),
                M9_AVG_Qty: calcAvg(sGrp.groupedData, 'M9_AVG_Qty'),
                One_Year_AVG_Qty: calcAvg(sGrp.groupedData, 'One_Year_AVG_Qty'),
                Billed_Qty: calcTotal(sGrp.groupedData, 'bill_qty'),
                Product_Groups: Array.isArray(sGrp.groupedData) ? sGrp.groupedData.length : 0,
            })) : [],
        })) : [];

        setShowData(groupedProductAggregations);
    }, [filters, dataArray, filteredData])

    // console.log(groupedLedgerAggregations)

    return (
        <Fragment>
            <div className="row">
                <div className="col-xxl-10 col-lg-9 col-md-8">
                    <FilterableTable
                        columns={[
                            {
                                Field_Name: 'Ledger_Name',
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
                            {
                                Field_Name: 'Party_District',
                                isVisible: 1,
                                Fied_Data: 'string',
                            },
                            {
                                Field_Name: 'Party_Group',
                                isVisible: 1,
                                Fied_Data: 'string',
                            },
                            // {
                            //     Field_Name: 'Party_Nature',
                            //     isVisible: 1,
                            //     Fied_Data: 'string',
                            // },
                            {
                                Field_Name: 'Ref_Brokers',
                                isVisible: 1,
                                Fied_Data: 'string',
                            },
                        ]}
                        dataArray={showData}
                        isExpendable={true}
                        expandableComp={({ row }) => {
                            return (
                                <FilterableTable
                                    initialPageCount={15}
                                    dataArray={Array.isArray(row.groupedData) ? row.groupedData : []}
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
                                            Field_Name: 'M3_AVG_Qty',
                                            isVisible: 1,
                                            Fied_Data: 'number',
                                        },
                                        {
                                            Field_Name: 'M6_AVG_Qty',
                                            isVisible: 1,
                                            Fied_Data: 'number',
                                        },
                                        {
                                            Field_Name: 'M9_AVG_Qty',
                                            isVisible: 1,
                                            Fied_Data: 'number',
                                        },
                                        {
                                            Field_Name: 'One_Year_AVG_Qty',
                                            isVisible: 1,
                                            Fied_Data: 'number',
                                        },
                                    ]}
                                    isExpendable={true}
                                    expandableComp={({ row }) => {
                                        return (
                                            <FilterableTable
                                                dataArray={row.groupedData}
                                                initialPageCount={5}
                                                columns={[
                                                    {
                                                        Field_Name: 'Item_Name',
                                                        isVisible: 1,
                                                        Fied_Data: 'string',
                                                    },
                                                    {
                                                        Field_Name: 'bill_qty',
                                                        isVisible: 1,
                                                        Fied_Data: 'number',
                                                    },
                                                    {
                                                        Field_Name: 'invoice_date',
                                                        isVisible: 1,
                                                        Fied_Data: 'date',
                                                    },
                                                    {
                                                        Field_Name: 'M3_AVG_Qty',
                                                        isVisible: 1,
                                                        Fied_Data: 'number',
                                                    },
                                                    {
                                                        Field_Name: 'M6_AVG_Qty',
                                                        isVisible: 1,
                                                        Fied_Data: 'number',
                                                    },
                                                    {
                                                        Field_Name: 'M9_AVG_Qty',
                                                        isVisible: 1,
                                                        Fied_Data: 'number',
                                                    },
                                                    {
                                                        Field_Name: 'One_Year_AVG_Qty',
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

export default LedgerBasedSalesReport;