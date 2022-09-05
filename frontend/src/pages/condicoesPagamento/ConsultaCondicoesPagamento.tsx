import React, { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter, LinearProgress, Pagination, IconButton, Icon, Collapse, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ListTools } from "../../shared/components";
import { useDebounce } from "../../shared/hooks";
import { LayoutBase } from "../../shared/layouts";
import { CondicoesPagamentoService } from '../../shared/services/api/condicoesPagamento/CondicoesPagamentoService';
import { ICondicoesPagamento } from "../../shared/models/ModelCondicoesPagamento";
import { Environment } from "../../shared/environment";
import { toast } from "react-toastify";
import { Box } from "@mui/system";

export const ConsultaCondicoesPagamento: React.FC = () => {
    
    const Row = (props: { row: ICondicoesPagamento }) => {
        const { row } = props;
        const [open, setOpen] = useState(false);
        return (
            <React.Fragment>
                <TableRow key={row.id}>
                    <TableCell>
                        <IconButton 
                            aria-label="expand-row" 
                            size="small" 
                            onClick={() => setOpen(!open)}
                        >
                            <Icon>{open ? "keyboard_arrow_up_icon" : "keyboard_arrow_down_icon"}</Icon>
                        </IconButton>
                    </TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.descricao}</TableCell>
                    <TableCell>{row.txdesc}</TableCell>
                    <TableCell>{row.txmulta}</TableCell>
                    <TableCell>{row.txjuros}</TableCell>
                    <TableCell align="right">
                        <IconButton color="error" size="small" onClick={() => handleDelete(row.id)}>
                            <Icon>delete</Icon>
                        </IconButton>
                        <IconButton color="primary" size="small" onClick={() => navigate(`/condicoespagamento/cadastro/${row.id}`)}>
                            <Icon>edit</Icon>
                        </IconButton>
                    </TableCell>
                </TableRow>
                <TableRow sx={{ backgroundColor: "#ECECEC" }}>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6">
                                    Parcelas
                                </Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Número</TableCell>
                                            <TableCell>Dias</TableCell>
                                            <TableCell>Percentual</TableCell>
                                            <TableCell>Forma de pagamento</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.listaparcelas?.map((item) => (
                                            <TableRow key={item.numero}>
                                                <TableCell>{item.numero}</TableCell>
                                                <TableCell>{item.dias}</TableCell>
                                                <TableCell>{item.percentual+"%"}</TableCell>
                                                <TableCell>{item.formapagamento.descricao}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        )
    }
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();

    const [rows, setRows] = useState<ICondicoesPagamento[]>([]);
    const [rowOpen, setRowOpen] = useState(false);
    const [qtd, setQtd] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const reloadDataTable = () => {
        setIsLoading(true);

        debounce(() => {
            CondicoesPagamentoService.getAll(pagina, busca)
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
    }

    const busca = useMemo(() => {
        return searchParams.get('busca')?.toUpperCase() || ''; 
    }, [searchParams]);

    const pagina = useMemo(() => {
        return Number(searchParams.get('pagina') || '1');   
    }, [searchParams]);

    useEffect(() => {
        setIsLoading(true);

        debounce(() => {
            let data = new Date();
            console.log(data.toLocaleString());
            CondicoesPagamentoService.getAll(pagina, busca)
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
            CondicoesPagamentoService.deleteById(id)
                .then(result => {
                    console.log(result);
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {
                        // setRows(oldRows => [
                        //     ...oldRows.filter(oldRow => oldRow.id !== id)
                        // ]);
                        reloadDataTable();
                        toast.success('Apagado com sucesso!');
                    }
                })
        }

    }

    return (
        <LayoutBase 
            titulo="Consultar Condições de Pagamento"
            barraDeFerramentas={
                <ListTools
                    mostrarInputBusca
                    textoDaBusca={busca}
                    handleSeachTextChange={texto => setSearchParams({ busca : texto, pagina: '1' }, { replace : true })}
                    onClickNew={() => navigate('/condicoespagamento/cadastro/novo')}
                />
            }
        >
            <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell/>
                            <TableCell>ID</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Desconto</TableCell>
                            <TableCell>Multa</TableCell>
                            <TableCell>Juros</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows?.map((row) => (
                            <Row key={row.id} row={row}/>
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