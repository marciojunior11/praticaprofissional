import { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter, LinearProgress, Pagination, IconButton, Icon } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ListTools } from "../../shared/components";
import { useDebounce } from "../../shared/hooks";
import { LayoutBase } from "../../shared/layouts";
import { TiposProdutoService, ITiposProduto } from '../../shared/services/api/tiposProduto/TiposProdutoService';
import { Environment } from "../../shared/environment";
import { toast } from "react-toastify";

export const ConsultaTiposProduto: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();

    const [rows, setRows] = useState<ITiposProduto[]>([]);
    const [qtd, setQtd] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const busca = useMemo(() => {
        return searchParams.get('busca')?.toUpperCase() || ''; 
    }, [searchParams]);

    const pagina = useMemo(() => {
        return Number(searchParams.get('pagina') || '1');   
    }, [searchParams]);

    useEffect(() => {
        setIsLoading(true);

        debounce(() => {
            TiposProdutoService.getAll(pagina, busca)
                .then((result) => {
                    setIsLoading(false);

                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {
                        console.log('RESULT', result);
                        setRows(result.data);
                        setQtd(result.qtd);
                    }
                });
        })
    }, [busca, pagina]);

    const handleDelete = (id: number) => {

        if (window.confirm('Deseja apagar o registro?')) {
            TiposProdutoService.deleteById(id)
                .then(result => {
                    console.log(result);
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {
                        setRows(oldRows => [
                            ...oldRows.filter(oldRow => oldRow.id !== id)
                        ]);
                        toast.success('Apagado com sucesso!');
                    }
                })
        }

    }

    return (
        <LayoutBase 
            titulo="Consultar Tipos de Produto"
            barraDeFerramentas={
                <ListTools
                    mostrarInputBusca
                    textoDaBusca={busca}
                    handleSeachTextChange={texto => setSearchParams({ busca : texto, pagina: '1' }, { replace : true })}
                    onClickNew={() => navigate('/tiposProduto/cadastro/novo')}
                />
            }
        >
            <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows?.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.descricao}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="error" size="small" onClick={() => handleDelete(row.id)}>
                                        <Icon>delete</Icon>
                                    </IconButton>
                                    <IconButton color="primary" size="small" onClick={() => navigate(`/tiposProduto/cadastro/${row.id}`)}>
                                        <Icon>edit</Icon>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    { qtd === 0 && !isLoading && (
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
                        {(qtd > 0 && qtd > Environment.LIMITE_DE_LINHAS) && (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Pagination 
                                        page={pagina}
                                        count={Math.ceil(qtd / Environment.LIMITE_DE_LINHAS)}
                                        onChange={(_, newPage) => setSearchParams({ busca, pagina: newPage.toString() }, { replace : true })}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableFooter>
                </Table>
            </TableContainer>
        </LayoutBase>
    );
};