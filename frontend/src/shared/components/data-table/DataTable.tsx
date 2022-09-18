import { Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TableRowProps } from "@mui/material";
import { useState } from "react";
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
    headers: IHeaderProps[];
    rows: any[];
    rowId: string;
    selectable?: boolean;
    onRowClick?: (row: any) => void;
    rowCount?: number;
    isLoading?: boolean;
    page?: number;
    onPageChange?: (page: number) => void;
}

export const DataTable: React.FC<IDataTableProps> = ( { headers, rows, rowId, selectable = false, onRowClick, rowCount, isLoading, page, onPageChange } ) => {
    const [selectedValue, setSelectedValue] = useState();

    return (
        <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: "auto" }}>
            <Table>
                <TableHead>
                    <TableRow>
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
                            <TableRow 
                                hover={selectable} 
                                key={row[rowId]}
                                onDoubleClick={() => {
                                    selectable && (
                                        onRowClick?.(row)
                                    )
                                }}
                            >
                                { headers.map((header) => {
                                    return (
                                        <TableCell align={header.align && header.align}>
                                            { !header.render ? getNestedObjectPropValue(row, header.name) : header.render(row) }
                                        </TableCell>
                                    )
                                }) }
                            </TableRow>
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