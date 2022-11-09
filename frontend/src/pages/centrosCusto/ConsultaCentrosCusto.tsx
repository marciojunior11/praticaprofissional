// #region EXTERNAL IMPORTSIMPORTS
import { useEffect, useMemo, useState } from "react";
import { IconButton, Icon } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
// #endregion

// #region INTERNAL IMPORTS
import { CustomDialog, ListTools } from "../../shared/components";
import { useDebounce } from "../../shared/hooks";
import { LayoutBase } from "../../shared/layouts";
import { ICentrosCusto } from "../../shared/interfaces/entities/CentrosCusto";
import { CadastroCentrosCusto } from "./CadastroCentrosCusto";
import { DataTable, IHeaderProps } from "../../shared/components/data-table/DataTable";
import ControllerCentrosCusto from "../../shared/controllers/CentrosCustoController"
import { IConsultaProps } from "../../shared/interfaces/views/Consulta"
// #endregion

export const ConsultaCentrosCusto: React.FC<IConsultaProps> = ({ isDialog = false, onSelectItem, toggleDialogOpen }) => {
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
    const [rows, setRows] = useState<ICentrosCusto[]>([]);
    const [qtd, setQtd] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isCadastroCentrosCustoDialogOpen, setIsCadastroCentrosCustoDialogOpen] = useState(false);
    // #endregion

    // #region ACTIONS
    const toggleCadastroCentrosCustoDialogOpen = () => {
        setIsCadastroCentrosCustoDialogOpen(oldValue => !oldValue);
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

    // #region CONTROLLERS
    const controller = new ControllerCentrosCusto();
    // #endregion

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
                                toggleCadastroCentrosCustoDialogOpen();
                            } else {
                                navigate(`/centroscusto/cadastro/${row.id}`)
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

    return (
        <LayoutBase 
            titulo="Consultar Centros de Custo"
            barraDeFerramentas={
                <ListTools
                    mostrarInputBusca
                    textoDaBusca={busca}
                    handleSeachTextChange={texto => setSearchParams({ busca : texto, pagina: '1' }, { replace : true })}
                    onClickNew={() => {
                        if (isDialog) {
                            setSelectedId(0);
                            toggleCadastroCentrosCustoDialogOpen();
                        } else {
                            navigate('/centroscusto/cadastro/novo')
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
                onClose={toggleCadastroCentrosCustoDialogOpen}
                handleClose={toggleCadastroCentrosCustoDialogOpen}
                open={isCadastroCentrosCustoDialogOpen}
                title="Cadastrar Centro de Custo"
            >
                <CadastroCentrosCusto
                    isDialog
                    toggleOpen={toggleCadastroCentrosCustoDialogOpen}
                    selectedId={Number(selectedId)}
                    reloadDataTableIfDialog={reloadDataTable}
                />
            </CustomDialog>
        </LayoutBase>
    );
};