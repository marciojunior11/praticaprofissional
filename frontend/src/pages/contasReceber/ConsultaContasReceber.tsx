// #region EXTERNAL IMPORTS
import React, { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter, LinearProgress, Pagination, IconButton, Icon, Collapse, Typography, Chip, Divider, Grid } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Box } from "@mui/system";
// #endregion

// #region INTERNAL IMPORTS
import { CustomDialog, ListTools } from "../../shared/components";
import { useDebounce } from "../../shared/hooks";
import { LayoutBase } from "../../shared/layouts";
import { IVendas, IValidator } from "../../shared/interfaces/entities/Vendas";
import { Environment } from "../../shared/environment";
import ControllerVendas from "../../shared/controllers/VendasController";
import { DataTable, IHeaderProps } from "../../shared/components/data-table/DataTable";
import { IConsultaProps } from "../../shared/interfaces/views/Consulta";
import { CollapsedDataTable } from "../../shared/components/data-table/CollapsedDataTable";
import { CadastroContasReceber } from "./CadastroContasReceber";
import { IContasReceber } from "../../shared/interfaces/entities/ContasReceber";
// #endregion

export const ConsultaContasReceber: React.FC<IConsultaProps> = ({ isDialog = false, onSelectItem, toggleDialogOpen }) => {
    // #region CONTROLLERS
    const controller = new ControllerVendas();
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
    const [rows, setRows] = useState<any[]>([]);
    const [rowOpen, setRowOpen] = useState(false);
    const [qtd, setQtd] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isCadastroVendasDialogOpen, setIsCadastroVendasDialogOpen] = useState(false);
    // #endregion

    // #region ACTIONS
    const toggleCadastroVendasDialogOpen = () => {
        setIsCadastroVendasDialogOpen(oldValue => !oldValue);
    }

    const headers: IHeaderProps[] = [
        {
            label: 'ID Compra',
            name: "id",
            align: "center",
        },
        {
            label: 'Cliente',
            name: 'cliente.nmcliente',
            align: 'left'
        },
        {
            label: "Nr. Parcela",
            name: "nrparcela",
        },
        {
            label: "Vl. Total",
            name: "vltotal", 
            align: "center", 
            render: (row) => {
                return (
                    new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(row.vltotal)
                )
            }
        },
        {
            label: "Dt. Vencimento",
            name: "dtvencimento",
            align: "center", 
            render: (row) => {
                return (
                    <Typography sx={{
                        color: (new Date(row.dtvencimento).toLocaleDateString() == new Date().toLocaleDateString()) && (row.flSituacao == "A") ? '#ed6c02' : (new Date(row.dtvencimento).toLocaleDateString() < new Date().toLocaleDateString()) && (row.flsituacao == "A") ? '#d32f2f' : '#000000de',
                    }}>{new Date(row.dtvencimento).toLocaleDateString()}</Typography>
                )
            }
        },
        {
            label: "Situação",
            name: "flsituacao",
            align: "center",
            render: (row) => {
                return (
                    <>
                        <Grid item container spacing={2} justifyContent="center">
                            <Grid item>
                                {row.flsituacao == 'A' && new Date(row.dtvencimento).toLocaleDateString() > new Date().toLocaleDateString() ? (
                                    <Chip label="ABERTA" color="info"/>
                                ) : row.flsituacao == 'P' ? (
                                    <Chip label="RECEBIDA" color="success"/>
                                ) : new Date(row.dtvencimento).toLocaleDateString() == new Date().toLocaleDateString() && (row.flsituacao == "A") ? (
                                    <Chip label="VENCE HOJE" color="warning"/>
                                ) : new Date(row.dtvencimento).toLocaleDateString() < new Date().toLocaleDateString() && (row.flsituacao == "A") ? (
                                    <Chip label="VENCIDA" color="error"/>
                                ) : null}
                            </Grid>
                        </Grid>                     
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
                        <IconButton disabled={row.flsituacao != 'A'} color="success" size="small" onClick={() => handlePay(row)}>
                            <Icon>paid</Icon>
                            <Icon>check</Icon>
                        </IconButton>
                        <IconButton color="primary" size="small" onClick={() => {
                            navigate(`/contasreceber/cadastro/nrparcela=${row.nrparcela}_id=${row.id}`);
                        }}>
                            <Icon>visibility</Icon>
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
    
    const reloadDataTable = () => {
        setIsLoading(true);

        debounce(() => {
            controller.getAll(pagina, busca)
                .then((result) => {
                    setIsLoading(false);

                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {
                        var mLista: IContasReceber[] = [];
                        result.data.forEach((compra) => {
                            compra.listacontasreceber.forEach((conta) => {
                                mLista.push(conta);
                            })
                        })
                        setRows(mLista);
                        setQtd(result.data.length);
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
                        var mLista: any[] = [];
                        result.data.forEach((compra) => {
                            compra.listacontasreceber.forEach((conta) => {
                                mLista.push({
                                    ...conta,
                                    id: compra.id
                                });
                            })
                        })
                        console.log(mLista);
                        setRows(mLista);
                        setQtd(result.data.length);
                    }
                });
        })
    }, [busca, pagina]);

    const handlePay = (dados: IContasReceber) => {

        if (window.confirm('Deseja receber esta conta?')) {
            controller.receberConta(dados)
                .then(result => {
                    console.log(result);
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {
                        reloadDataTable();
                        toast.success('Conta paga com sucesso!');
                    }
                })
        }

    }
    // #endregion

    return (
        <LayoutBase 
            titulo="Consultar Contas a Receber"
            barraDeFerramentas={
                <ListTools
                    mostrarInputBusca
                    textoDaBusca={busca}
                    handleSeachTextChange={texto => setSearchParams({ busca : texto, pagina: '1' }, { replace : true })}
                    onClickNew={() => {
                        if (isDialog) {
                            setSelectedId(0);
                            toggleCadastroVendasDialogOpen();
                        } else {
                            navigate('/compras/cadastro/novo')
                        }
                    }}
                />
            }
        >
            <DataTable
                rowId="nrParcela"
                headers={headers}
                rows={rows}
                rowCount={qtd}
                onRowClick={(row) => {
                    if (isDialog)
                    {
                        onSelectItem?.(row);
                        toggleDialogOpen?.();
                    }
                }}
            />

            <CustomDialog
                fullWidth
                maxWidth="xl"
                onClose={toggleCadastroVendasDialogOpen}
                handleClose={toggleCadastroVendasDialogOpen}
                open={isCadastroVendasDialogOpen}
                title="Cadastrar Compra"
            >
                <CadastroContasReceber
                    isDialog
                    toggleOpen={toggleCadastroVendasDialogOpen}
                    selectedId={selectedId}
                    reloadDataTableIfDialog={reloadDataTable}
                />
            </CustomDialog>
        </LayoutBase>
    );
};