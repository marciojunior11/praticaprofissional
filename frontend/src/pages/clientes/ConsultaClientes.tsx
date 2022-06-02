import { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { ListTools } from "../../shared/components";
import { useDebounce } from "../../shared/hooks";
import { LayoutBase } from "../../shared/layouts";
import { ClientesServices, IClientes } from "../../shared/services/api/clientes/ClientesServices";


export const ConsultaClientes: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();

    const [clientes, setClientes] = useState<IClientes[]>();
    const [qtdClientes, setQtdClientes] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const busca = useMemo(() => {
        return searchParams.get('busca') || '';    
    }, [searchParams]);

    useEffect(() => {
        setIsLoading(true);

        debounce(() => {
            ClientesServices.getAll(1, busca)
            .then((result) => {
                setIsLoading(false);

                if (result instanceof Error) {
                    alert(result.message)
                } else {
                    console.log(result);
                    setClientes(result.data);
                    setQtdClientes(result.count);
                }
            });
        })
    }, [busca]);

    return (
        <LayoutBase 
            titulo="Consulta de Cidades"
            barraDeFerramentas={
                <ListTools
                    mostrarInputBusca
                    textoDaBusca={busca}
                    handleSeachTextChange={texto => setSearchParams({ busca : texto }, { replace : true })}
                />
            }
        >
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ações</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>Nome</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clientes?.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>Ações</TableCell>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.nome}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </LayoutBase>
    );
};