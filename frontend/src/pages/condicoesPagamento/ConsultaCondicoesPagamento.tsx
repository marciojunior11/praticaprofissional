// #region EXTERNAL IMPORTS
import React, { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter, LinearProgress, Pagination, IconButton, Icon, Collapse, Typography, Chip } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Box } from "@mui/system";
// #endregion

// #region INTERNAL IMPORTS
import { CustomDialog, ListTools } from "../../shared/components";
import { useDebounce } from "../../shared/hooks";
import { LayoutBase } from "../../shared/layouts";
import { CondicoesPagamentoService } from '../../shared/services/api/condicoesPagamento/CondicoesPagamentoService';
import { ICondicoesPagamento } from "../../shared/interfaces/entities/CondicoesPagamento";
import { Environment } from "../../shared/environment";
import ControllerCondicoesPagamento from "../../shared/controllers/CondicoesPagamentoController";
import { IHeaderProps } from "../../shared/components/data-table/DataTable";
import { IConsultaProps } from "../../shared/interfaces/views/Consulta";
import { CollapsedDataTable } from "../../shared/components/data-table/CollapsedDataTable";
import { CadastroCondicoesPagamento } from "./CadastroCondicoesPagamento";
// #endregion

export const ConsultaCondicoesPagamento: React.FC<IConsultaProps> = ({ isDialog = false, onSelectItem, toggleDialogOpen }) => {
    // #region CONTROLLERS
    const controller = new ControllerCondicoesPagamento();
    // #endregion

    // #region HOOKS
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();
    const busca = useMemo(() => {
        return searchParams.get('busca')?.toUpperCase() || ''; 
    }, [searchParams]);

    const pagina = useMemo(() => {
        return Number(searchParams.get('pagina') || '1');   
    }, [searchParams]);
    // #endregion

    // #region STATES
    const [selectedId, setSelectedId] = useState<number | undefined>();
    const [rows, setRows] = useState<ICondicoesPagamento[]>([]);
    const [rowOpen, setRowOpen] = useState(false);
    const [qtd, setQtd] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isCadastroCondicoesPagamentoDialogOpen, setIsCadastroCondicoesPagamentoDialogOpen] = useState(false);
    // #endregion

    // #region ACTIONS
    const toggleCadastroCondicoesPagamentoDialogOpen = () => {
        setIsCadastroCondicoesPagamentoDialogOpen(oldValue => !oldValue);
    }

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
                    <TableCell>{row.flsituacao == 'A' ? (
                        <Chip label="ATIVO" color="success"/>
                    ) : (
                        <Chip label="INATIVO" color="error"/>
                    )}</TableCell>
                    <TableCell align="right">
                        <IconButton color="error" size="small" onClick={() => handleDelete(row.id)}>
                            <Icon>delete</Icon>
                        </IconButton>
                        <IconButton color="primary" size="small" onClick={() => navigate(`/condicoespagamento/cadastro/${row.id}`)}>
                            <Icon>edit</Icon>
                        </IconButton>
                    </TableCell>
                </TableRow>
                <TableRow>
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

    const headers: IHeaderProps[] = [
        {
            label: "ID",
            name: "id",  
        },
        {
            label: "Descrição",
            name: "descricao",  
        },        
        {
            label: "Desconto",
            name: "txdesc",  
        },
        {
            label: "Multa",
            name: "txmulta",  
        },
        {
            label: "Juros",
            name: "txjuros",  
        },
        {
            label: "Situação",
            name: "flsituacao",
            align: "center",
            render: (row) => {
                return (
                    <>
                        {row.flsituacao == 'A' ? (
                            <Chip label="ATIVO" color="success"/>
                        ) : (
                            <Chip label="INATIVO" color="error"/>
                        )}                        
                    </>
                )
            } 
        },
        {
            label: "Ações",
            name: ' ',
            align: "right",
            render: (row) => {
                return (
                    <>
                        <IconButton color="error" size="small" onClick={() => handleDelete(row.id)}>
                            <Icon>delete</Icon>
                        </IconButton>
                        <IconButton color="primary" size="small" onClick={() => {
                            if (isDialog) {
                                setSelectedId(row.id);
                                toggleCadastroCondicoesPagamentoDialogOpen();
                            } else {
                                navigate(`/condicoespagamento/cadastro/${row.id}`)
                            }
                        }}>
                            <Icon>edit</Icon>
                        </IconButton>
                        {isDialog && (
                            <IconButton color="success" size="small" onClick={() => {
                                onSelectItem?.(row);
                                toggleDialogOpen?.();
                            }}>
                                <Icon>checkbox</Icon>
                            </IconButton>
                        )}
                    </>
                )
            }
        }
    ]

    const collapsedHeaders: IHeaderProps[] = [
        {
            label: "Número",
            name: "numero",  
        },
        {
            label: "Dias",
            name: "dias",  
        },        
        {
            label: "Percentual",
            name: "percentual",  
        },
        {
            label: "Forma de Pagamento",
            name: "formapagamento.descricao",  
        },
    ]
    
    const reloadDataTable = () => {
        setIsLoading(true);

        debounce(() => {
            controller.getAll(pagina, busca)
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

    useEffect(() => {
        setIsLoading(true);

        debounce(() => {
            let data = new Date();
            console.log(data.toLocaleString());
            controller.getAll(pagina, busca)
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
    // #endregion

    return (
        <LayoutBase 
            titulo="Consultar Condições de Pagamento"
            barraDeFerramentas={
                <ListTools
                    mostrarInputBusca
                    textoDaBusca={busca}
                    handleSeachTextChange={texto => setSearchParams({ busca : texto, pagina: '1' }, { replace : true })}
                    onClickNew={() => {
                        if (isDialog) {
                            setSelectedId(0);
                            toggleCadastroCondicoesPagamentoDialogOpen();
                        } else {
                            navigate('/condicoespagamento/cadastro/novo')
                        }
                    }}
                />
            }
        >
            <CollapsedDataTable
                collapseHeaders={collapsedHeaders}
                collapseRowId="numero"
                collapseRows="listaparcelas"
                headers={headers}
                rows={rows}
                rowId="id"
                selectable={isDialog}
                onRowClick={(row) => {
                    if (isDialog)
                    {
                        onSelectItem?.(row);
                        toggleDialogOpen?.();
                    }
                }}   
                isLoading={isLoading}
                page={pagina}
                rowCount={qtd}
                onPageChange={(page) => setSearchParams({ busca, pagina: page.toString() }, { replace : true })}   
            />

            <CustomDialog
                fullWidth
                maxWidth="xl"
                onClose={toggleCadastroCondicoesPagamentoDialogOpen}
                handleClose={toggleCadastroCondicoesPagamentoDialogOpen}
                open={isCadastroCondicoesPagamentoDialogOpen}
                title="Cadastrar Condição de Pagamento"
            >
                <CadastroCondicoesPagamento
                    isDialog
                    toggleOpen={toggleCadastroCondicoesPagamentoDialogOpen}
                    selectedId={Number(selectedId)}
                    reloadDataTableIfDialog={reloadDataTable}
                />
            </CustomDialog>

            {/* <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell/>
                            <TableCell>ID</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Desconto</TableCell>
                            <TableCell>Multa</TableCell>
                            <TableCell>Juros</TableCell>
                            <TableCell>Situação</TableCell>
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
            </TableContainer> */}
        </LayoutBase>
    );
};