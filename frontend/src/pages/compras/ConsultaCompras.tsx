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
import { ICompras, IValidator } from "../../shared/interfaces/entities/Compras";
import { Environment } from "../../shared/environment";
import ControllerCompras from "../../shared/controllers/ComprasController";
import { IHeaderProps } from "../../shared/components/data-table/DataTable";
import { IConsultaProps } from "../../shared/interfaces/views/Consulta";
import { CollapsedDataTable } from "../../shared/components/data-table/CollapsedDataTable";
import { CadastroCompras } from "./CadastroCompras";
// #endregion

export const ConsultaCompras: React.FC<IConsultaProps> = ({ isDialog = false, onSelectItem, toggleDialogOpen }) => {
    // #region CONTROLLERS
    const controller = new ControllerCompras();
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
    const [selectedId, setSelectedId] = useState<IValidator | undefined>();
    const [rows, setRows] = useState<ICompras[]>([]);
    const [rowOpen, setRowOpen] = useState(false);
    const [qtd, setQtd] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isCadastroComprasDialogOpen, setIsCadastroComprasDialogOpen] = useState(false);
    // #endregion

    // #region ACTIONS
    const toggleCadastroComprasDialogOpen = () => {
        setIsCadastroComprasDialogOpen(oldValue => !oldValue);
    }

    const headers: IHeaderProps[] = [
        {
            label: "NF",
            name: "numnf",  
        },
        {
            label: "Série",
            name: "serienf",  
        },        
        {
            label: "Modelo",
            name: "modelonf",  
        },
        {
            label: "Fornecedor",
            name: "fornecedor.razsocial",  
        },
        {
            label: "Situação",
            name: "flsituacao",
            align: "center",
            render: (row) => {
                return (
                    <>
                        {row.flsituacao == 'A' ? (
                            <Chip label="FINALIZADA" color="success"/>
                        ) : (
                            <Chip label="CANCELADA" color="error"/>
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
                        <IconButton color="error" size="small" onClick={() => handleDelete(row)}>
                            <Icon>delete</Icon>
                        </IconButton>
                        <IconButton color="primary" size="small" onClick={() => {
                            if (isDialog) {
                                setSelectedId(row.id);
                                toggleCadastroComprasDialogOpen();
                            } else {
                                navigate(`/compras/cadastro/numnf=${row.numnf}_serienf=${row.serienf}_modelonf=${row.modelonf}_idfornecedor=${row.idfornecedor}`);
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

    const handleDelete = (dados: ICompras) => {

        if (window.confirm('Deseja apagar o registro?')) {
            controller.delete({
                numnf: dados.numnf,
                serienf: dados.serienf,
                modelonf: dados.modelonf,
                fornecedor: dados.fornecedor
            })
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
            titulo="Consultar Compras"
            barraDeFerramentas={
                <ListTools
                    mostrarInputBusca
                    textoDaBusca={busca}
                    handleSeachTextChange={texto => setSearchParams({ busca : texto, pagina: '1' }, { replace : true })}
                    onClickNew={() => {
                        if (isDialog) {
                            setSelectedId({
                                numnf: "",
                                serienf: "",
                                modelonf: "",
                                fornecedor: null
                            });
                            toggleCadastroComprasDialogOpen();
                        } else {
                            navigate('/compras/cadastro/novo')
                        }
                    }}
                />
            }
        >
            <CollapsedDataTable
                collapseLabel="Contas à Pagar"
                collapseHeaders={collapsedHeaders}
                collapseRowId="nrparcela"
                collapseRows="listacontaspagar"
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
                onClose={toggleCadastroComprasDialogOpen}
                handleClose={toggleCadastroComprasDialogOpen}
                open={isCadastroComprasDialogOpen}
                title="Cadastrar Compra"
            >
                <CadastroCompras
                    isDialog
                    toggleOpen={toggleCadastroComprasDialogOpen}
                    selectedId={Number(selectedId)}
                    reloadDataTableIfDialog={reloadDataTable}
                />
            </CustomDialog>
        </LayoutBase>
    );
};