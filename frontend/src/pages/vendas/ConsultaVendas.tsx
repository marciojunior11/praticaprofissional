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
import { IVendas, IValidator } from "../../shared/interfaces/entities/Vendas";
import { Environment } from "../../shared/environment";
import ControllerVendas from "../../shared/controllers/VendasController";
import { IHeaderProps } from "../../shared/components/data-table/DataTable";
import { IConsultaProps } from "../../shared/interfaces/views/Consulta";
import { CollapsedDataTable } from "../../shared/components/data-table/CollapsedDataTable";
import { CadastroVendas } from "./CadastroVendas";
// #endregion

export const ConsultaVendas: React.FC<IConsultaProps> = ({ isDialog = false, onSelectItem, toggleDialogOpen }) => {
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
    const [rows, setRows] = useState<IVendas[]>([]);
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
            label: "ID",
            name: "id",
            align: "center", 
        },
        {
            label: "Cliente",
            name: "cliente.nmcliente", 
            align: "center", 
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
            label: "Ações",
            name: ' ',
            align: "right",
            render: (row) => {
                return (
                    <>
                        <IconButton color="error" size="small" onClick={() => handleDelete(row)}>
                            <Icon>block</Icon>
                        </IconButton>
                        <IconButton color="primary" size="small" onClick={() => {
                            if (isDialog) {
                                setSelectedId(row.id);
                                toggleCadastroVendasDialogOpen();
                            } else {
                                navigate(`/compras/cadastro/numnf=${row.numnf}_serienf=${row.serienf}_modelonf=${row.modelonf}_idfornecedor=${row.fornecedor.id}`);
                            }
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

    const collapsedHeaders: IHeaderProps[] = [
        {
            label: "ID",
            name: "id",
            align: "right",  
        },
        {
            label: "Descrição",
            name: "descricao",  
            align: "left",
        },        
        {
            label: "QTD",
            name: "qtd",
            align: "center", 
        },
        {   
            name: "vlcompra",
            label: "Vl. Unitário",
            align: "center",
            render: (row) => {
                return (
                    new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(row.vlcompra)
                )
            }
        },
        {
            name: "vlcusto",
            label: "Custo Uni.",
            align: "center",
            render: (row) => {
                return (
                    new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(row.vlcusto)
                )
            }
        },
        {
            name: "vltotal",
            label: "Total",
            align: "center",
            render: (row) => {
                return (
                    new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(row.vltotal)
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
            controller.delete(id)
                .then(result => {
                    console.log(result);
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {
                        reloadDataTable();
                        toast.success('Apagado com sucesso!');
                    }
                })
        }

    }
    // #endregion

    return (
        <LayoutBase 
            titulo="Consultar Vendas"
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
            <CollapsedDataTable
                collapseLabel="Produtos"
                collapseHeaders={collapsedHeaders}
                collapseRowId="id"
                collapseRows="listaprodutos"
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
                onClose={toggleCadastroVendasDialogOpen}
                handleClose={toggleCadastroVendasDialogOpen}
                open={isCadastroVendasDialogOpen}
                title="Cadastrar Compra"
            >
                <CadastroVendas
                    isDialog
                    toggleOpen={toggleCadastroVendasDialogOpen}
                    selectedId={Number(selectedId)}
                    reloadDataTableIfDialog={reloadDataTable}
                />
            </CustomDialog>
        </LayoutBase>
    );
};