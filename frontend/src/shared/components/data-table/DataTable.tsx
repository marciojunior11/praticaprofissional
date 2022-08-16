import { Icon, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableRowProps } from "@mui/material";
import { useState } from "react";
import { render } from "react-dom";

export interface IHeaderProps {
    label?: string;
    name: string;
    render?: (row: any) => React.ReactNode;
    sortable?: boolean;
    order?: 'asc' | 'desc';
    onClick?: () => void; 
}

interface IDataTableProps {
    headers: IHeaderProps[];
    rows: any[];
    rowId: string;
}

export const DataTable: React.FC<IDataTableProps> = ( { headers, rows, rowId } ) => {
    const [selectedValue, setSelectedValue] = useState();

    return (
        <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: "auto" }}>
            <Table>
                <TableHead>
                    <TableRow>
                        { headers.map(header => {
                            return (
                                <TableCell>
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
                                hover 
                                key={row[rowId]}
                                onClick={() => {
                                    const mSelectedValue = rows[index];
                                    console.log(mSelectedValue);
                                }}
                            >
                                { headers.map((header) => {
                                    return (
                                        <TableCell>
                                            { !header.render ? row[header.name] : header.render(row) }
                                        </TableCell>
                                    )
                                }) }
                            </TableRow>
                        )
                    }) }
                </TableBody>
            </Table>
        </TableContainer>
    )
}