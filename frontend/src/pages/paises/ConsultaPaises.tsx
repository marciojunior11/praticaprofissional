import { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { ListTools } from "../../shared/components";
import { useDebounce } from "../../shared/hooks";
import { LayoutBase } from "../../shared/layouts";
import { PaisesService, IPaises } from '../../shared/services/api/paises/PaisesService';

export const ConsultaPaises: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();

    const [paises, setPaises] = useState<IPaises[]>();
    const [qtdPaises, setQtdPaises] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const busca = useMemo(() => {
        return searchParams.get('busca') || '';    
    }, [searchParams]);

    useEffect(() => {
        setIsLoading(true);

        debounce(() => {
            PaisesService.getAll(1, busca)
            .then((result) => {
                setIsLoading(false);

                if (result instanceof Error) {
                    alert(result.message)
                } else {
                    console.log(result);
                    setPaises(result.data);
                    setQtdPaises(result.qtd);
                }
            });
        })
    }, [busca]);

    return (
        <LayoutBase 
            titulo="Consulta de Países"
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
                            <TableCell>País</TableCell>
                            <TableCell>Sigla</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paises?.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>Ações</TableCell>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.pais}</TableCell>
                                <TableCell>{row.sigla}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </LayoutBase>
    );
};