// #region EXTERNAL IMPORTS
import { useEffect, useMemo, useState } from "react";
import { IconButton, Icon, Typography, Grid, Chip } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
// #endregion

// #region INTERNAL IMPORTS
import { CustomDialog, ListTools } from "../../shared/components";
import { useDebounce } from "../../shared/hooks";
import { LayoutBase } from "../../shared/layouts";
import { IContratos } from "../../shared/interfaces/entities/Contratos";
import { CadastroContratos } from "./CadastroContratos";
import { DataTable, IHeaderProps } from "../../shared/components/data-table/DataTable";
import ControllerContratos from "../../shared/controllers/ContratosController"
import { IConsultaProps } from "../../shared/interfaces/views/Consulta"
// #endregion

export const ConsultaContratos: React.FC<IConsultaProps> = ({ isDialog = false, onSelectItem, toggleDialogOpen }) => {
    // #region CONTROLLERS
    const controller = new ControllerContratos();
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
    const [rows, setRows] = useState<IContratos[]>([]);
    const [qtd, setQtd] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isCadastroContratosDialogOpen, setIsCadastroContratosDialogOpen] = useState(false);
    // #endregion

    // #region ACTIONS
    const toggleCadastroContratosDialogOpen = () => {
        setIsCadastroContratosDialogOpen(oldValue => !oldValue);
    }

    const reloadDataTable = () => {
        setIsLoading(true);
        debounce(() => {
            controller.getAll(pagina, busca)
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {
                        setRows(result.data);
                        setQtd(result.qtd);
                    }
                });
        })        
    }

    useEffect(() => {
        setIsLoading(true);
        debounce(() => {
            controller.getAll(pagina, busca)
                .then((result) => {
                    console.log(result);
                    setIsLoading(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {
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

    const headers: IHeaderProps[] = [
        {
            label: "ID",
            name: "id",
            align: "right",  
        },
        {
            label: "Cliente",
            name: "cliente.nmcliente",
            align: "left",  
        },        
        {
            label: "Dt. Validade",
            name: "datavalidade",
            render: (row) => {
                return (
                    <Typography sx={{
                        color: (new Date(row.datavalidade).toLocaleDateString() == new Date().toLocaleDateString()) && (row.flSituacao == "V") ? '#ed6c02' : (new Date(row.datavalidade).toLocaleDateString() < new Date().toLocaleDateString()) && (row.flsituacao == "V") ? '#d32f2f' : '#000000de',
                    }}>{new Date(row.datavalidade).toLocaleDateString()}</Typography>
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
                                {new Date(row.datavalidade).toLocaleDateString() <= new Date().toLocaleDateString() ? (
                                    <Chip label="VIGENTE" color="info"/>
                                ) : (
                                    <Chip label="ENCERRADO" color="error"/>
                                )}
                            </Grid>
                        </Grid>                     
                    </>
                )
            }
        }
    ]

    return (
        <LayoutBase 
            titulo="Consultar Contratos"
            barraDeFerramentas={
                <ListTools
                    mostrarInputBusca
                    textoDaBusca={busca}
                    handleSeachTextChange={texto => setSearchParams({ busca : texto, pagina: '1' }, { replace : true })}
                    onClickNew={() => {
                        if (isDialog) {
                            setSelectedId(0);
                            toggleCadastroContratosDialogOpen();
                        } else {
                            navigate('/contratos/cadastro/novo')
                        }
                    }}
                />
            }
        >
            <DataTable
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
                onClose={toggleCadastroContratosDialogOpen}
                handleClose={toggleCadastroContratosDialogOpen}
                open={isCadastroContratosDialogOpen}
                title="Cadastrar Contrato"
            >
                <CadastroContratos
                    isDialog
                    toggleOpen={toggleCadastroContratosDialogOpen}
                    selectedId={Number(selectedId)}
                    reloadDataTableIfDialog={reloadDataTable}
                />
            </CustomDialog>
        </LayoutBase>
    );
};