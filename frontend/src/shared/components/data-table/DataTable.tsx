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

export interface IActionProps {
    action: () => void;
    icon: string;
    color: 'inherit' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

interface IDataTableProps {
    headers: IHeaderProps[];
    rows: any[];
    rowId: string;
    actions?: IActionProps[];
}

export const DataTable: React.FC<IDataTableProps> = ( { headers, rows, rowId, actions } ) => {
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
                            <TableRow key={row[rowId]}>
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