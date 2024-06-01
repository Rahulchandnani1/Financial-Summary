import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Select, MenuItem, FormControl,
    Typography, IconButton, Button
} from '@mui/material';
import { makeStyles } from '@mui/styles';

//dependencies to implement drag and drop
import DragHandleIcon from '@mui/icons-material/DragHandle';
import {
    DndContext, closestCenter
} from '@dnd-kit/core';
import {
    arrayMove, SortableContext, useSortable, verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import "./App.css";

//data for the table
import data from "./data.json";

//Styles for the table
const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    formControl: {
        marginBottom: '20px',
        marginRight: '20px',
    },
    container: {
        padding: '20px',
    },
    pagination: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'center',
    },
    button1: {
        marginRight: "20px",
    },
    dragHandle: {
        cursor: 'move',
    },
    '@media print': {
        container: {
            width: '210mm',
            height: '297mm',
            padding: '10mm',
            boxSizing: 'border-box',
        },
        table: {
            fontSize: '8pt',
        },
        header: {
            fontSize: '10pt',
        },
    },
});

//functionality to implement drag and drop
const DraggableRow = ({ row, formatValue }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: row.Overhead });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <TableRow ref={setNodeRef} style={style}>
            <TableCell {...attributes} {...listeners}>
                <IconButton className={useStyles().dragHandle}>
                    <DragHandleIcon />
                </IconButton>
            </TableCell>
            <TableCell>{row.Overhead}</TableCell>
            {Object.keys(row).slice(1).map((month, i) => (
                <TableCell key={i}>{formatValue(row[month])}</TableCell>
            ))}
        </TableRow>
    );
};

//table component
const FinancialSummaryTable = () => {
    const classes = useStyles();
    const data1 = data.Sheet1;
    const [currency, setCurrency] = useState('$');
    const [decimalPlaces, setDecimalPlaces] = useState(2);
    const [pageIndex, setPageIndex] = useState(0);
    const [rows, setRows] = useState(data1);
    const rowsPerPage = 10;

//column name declaration
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const currencySymbols = {
        '$': '$',
        '€': '€',
        '£': '£'
    };

//logic to handle currency change
    const handleCurrencyChange = (event) => {
        setCurrency(event.target.value);
    };

//logic to show value till 0,1,2 decimal points
    const handleDecimalChange = (event) => {
        setDecimalPlaces(parseInt(event.target.value));
    };

    const formatValue = (value) => {
        return currencySymbols[currency] + value.toFixed(decimalPlaces);
    };

//functionality to implement drag and drop
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setRows((items) => {
                const oldIndex = items.findIndex(item => item.Overhead === active.id);
                const newIndex = items.findIndex(item => item.Overhead === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

//logic to change value to next 10 items    
    const handleNextPage = () => {
        setPageIndex((prevIndex) => Math.min(prevIndex + 1, Math.ceil(data1.length / rowsPerPage) - 1));
    };
//logic to change value to previous 10 items    
    const handlePreviousPage = () => {
        setPageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const displayedRows = rows.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage);

    return (
        <div className={classes.container}  >
            <Typography variant="h6" gutterBottom>
                Financial Summary Table
            </Typography>
            <FormControl variant="outlined" style={{ marginBottom: '20px', marginRight: '20px' }} className={classes.formControl}>

                <Select value={currency} onChange={handleCurrencyChange} >
                    <MenuItem value="$">USD ($)</MenuItem>
                    <MenuItem value="€">EUR (€)</MenuItem>
                    <MenuItem value="£">GBP (£)</MenuItem>
                </Select>
            </FormControl>

            <FormControl variant="outlined" style={{ marginBottom: '20px' }} className={classes.formControl}>
                <Select value={decimalPlaces} onChange={handleDecimalChange}>
                    <MenuItem value={0}>Decimal View 0</MenuItem>
                    <MenuItem value={1}>Decimal View 1</MenuItem>
                    <MenuItem value={2}>Decimal View 2</MenuItem>
                </Select>
            </FormControl>

            <TableContainer component={Paper}>
                <Table className={classes.table}>

                {/* Table column names */}
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.header}></TableCell>
                            <TableCell className={classes.header}>Cashflow</TableCell>
                            {Array.from({ length: 12 }, (_, i) => (
                                <TableCell key={i} className={classes.header}>{month[i]}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>


                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={displayedRows} strategy={verticalListSortingStrategy}>
                            <TableBody>
                                {displayedRows.map((row) => (
                                    <DraggableRow
                                        key={row.Overhead}
                                        row={row}
                                        formatValue={formatValue}
                                    />
                                ))}
                            </TableBody>
                        </SortableContext>
                    </DndContext>

                </Table>
            </TableContainer>
            {/* Previous and next button div */}
            <div className={classes.pagination}>
                <Button variant="contained" onClick={handlePreviousPage} className={classes.Button1} disabled={pageIndex === 0}>
                    Previous
                </Button>
                <Button variant="contained" onClick={handleNextPage} disabled={(pageIndex + 1) * rowsPerPage >= rows.length}>
                    Next
                </Button>
            </div>
        </div>
    );
};

export default FinancialSummaryTable;
