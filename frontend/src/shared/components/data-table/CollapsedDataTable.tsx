import { Collapse, Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TableRowProps, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { render } from "react-dom";
import { URLSearchParamsInit } from "react-router-dom";
import { Environment } from "../../environment";
import { getNestedObjectPropValue } from "../../utils/objects";

export interface IHeaderProps {
    label?: string;
    name: string;
    align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
    render?: (row: any) => React.ReactNode | null;
    sortable?: boolean;
    order?: 'asc' | 'desc';
    onClick?: () => void; 
}

interface IDataTableProps {
    collapseLabel: string;
    headers: IHeaderProps[];
    collapseHeaders: IHeaderProps[];
    rows: any[];
    collapseRows: string;
    rowId: string;
    collapseRowId: string;
    selectable?: boolean;
    onRowClick?: (row: any) => void;
    rowCount?: number;
    isLoading?: boolean;
    page?: number;
    onPageChange?: (page: number) => void;
}

export const CollapsedDataTable: React.FC<IDataTableProps> = ( { collapseLabel, headers, collapseHeaders, rows, collapseRows, rowId, collapseRowId, selectable = false, onRowClick, rowCount, isLoading, page, onPageChange } ) => {
    const [selectedValue, setSelectedValue] = useState();

    const Row = (props: { row: any }) => {
        const { row } = props;
        const [open, setOpen] = useState(false);
        return (
            <React.Fragment>
                <TableRow 
                    hover={selectable} 
                    key={row[rowId]}
                    onDoubleClick={() => {
                        selectable && (
                            onRowClick?.(row)
                        )
                    }}
                >
                    <TableCell>
                        <IconButton 
                            aria-label="expand-row" 
                            size="small" 
                            onClick={() => setOpen(!open)}
                        >
                            <Icon>{open ? "keyboard_arrow_up_icon" : "keyboard_arrow_down_icon"}</Icon>
                        </IconButton>
                    </TableCell>
                    { headers.map((header) => {
                        return (
                            <TableCell align={header.align && header.align}>
                                { !header.render ? getNestedObjectPropValue(row, header.name) : header.render(row) }
                            </TableCell>
                        )
                    }) }
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6">
                                    {collapseLabel}
                                </Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            { collapseHeaders.map(header => {
                                                return (
                                                    <TableCell align={header.align && header.align}>
                                                        {header.label}
                                                    </TableCell>
                                                )
                                            }) }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {collapseRows != "" ? (
                                            row[collapseRows].map((item: any) => (
                                                <TableRow key={item[collapseRowId]}>
                                                    { collapseHeaders.map((header) => {
                                                        return (
                                                            <TableCell align={header.align && header.align}>
                                                                { !header.render ? getNestedObjectPropValue(item, header.name) : header.render(row) }
                                                            </TableCell>
                                                        )
                                                    }) }
                                                </TableRow>
                                            ))
                                        ) : (
                                            rows.map((item: any) => (
                                                <TableRow key={item[collapseRowId]}>
                                                    { collapseHeaders.map((header) => {
                                                        return (
                                                            <TableCell align={header.align && header.align}>
                                                                { !header.render ? getNestedObjectPropValue(item, header.name) : header.render(row) }
                                                            </TableCell>
                                                        )
                                                    }) }
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>        
            </React.Fragment>
        )
    }

    return (
        <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: "auto" }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        { headers.map(header => {
                            return (
                                <TableCell align={header.align && header.align}>
                                    {header.label}
                                </TableCell>
                            )
                        }) }
                    </TableRow>
                </TableHead>
                <TableBody>
                    { rows.map((row, index) => {
                        return (
                            <Row 
                                row={row}
                                key={row[rowId]}
                            />
                        )
                    }) }
                </TableBody>
                { ((rowCount === 0) || (rows.length === 0)) && !isLoading && (
                    <caption>{Environment.LISTAGEM_VAZIA}</caption>
                )}
                <TableFooter>
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={4}>
                                <LinearProgress variant="indeterminate"/> 
                            </TableCell>
                        </TableRow>
                    )}
                    {(rowCount && ((rowCount > 0) && (rowCount > Environment.LIMITE_DE_LINHAS))) && (
                        <TableRow>
                            <TableCell colSpan={4}>
                                <Pagination 
                                    page={page}
                                    count={Math.ceil(rowCount / Environment.LIMITE_DE_LINHAS)}
                                    onChange={(_, newPage) => onPageChange?.(newPage)}
                                />
                            </TableCell>
                        </TableRow>
                    )}
                </TableFooter>
            </Table>
        </TableContainer>
    )
}