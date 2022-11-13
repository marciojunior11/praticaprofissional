// #region EXTERNAL IMPORTS
import { useEffect, useMemo, useState } from "react";
import { IconButton, Icon } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
// #endregion

// #region INTERNAL IMPORTS
import { CustomDialog, ListTools } from "../../shared/components";
import { useDebounce } from "../../shared/hooks";
import { LayoutBase } from "../../shared/layouts";
import { IProdutos } from "../../shared/interfaces/entities/Produtos";
//import { CadastroProdutos } from "./CadastroProdutos";
import { DataTable, IHeaderProps } from "../../shared/components/data-table/DataTable";
import ControllerProdutos from "../../shared/controllers/ProdutosController"
import { IConsultaProps } from "../../shared/interfaces/views/Consulta"
import { CollapsedDataTable } from "../../shared/components/data-table/CollapsedDataTable";
import { CadastroProdutos } from "./CadastroProdutos";
// #endregion

export const ConsultaProdutos: React.FC<IConsultaProps> = ({ isDialog = false, onSelectItem, toggleDialogOpen }) => {
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
    const [rows, setRows] = useState<IProdutos[]>([]);
    const [qtd, setQtd] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isCadastroProdutosDialogOpen, setIsCadastroProdutosDialogOpen] = useState(false);
    // #endregion

    // #region ACTIONS
    const toggleCadastroProdutosDialogOpen = () => {
        setIsCadastroProdutosDialogOpen(oldValue => !oldValue);
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
    const controller = new ControllerProdutos();
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
            label: "Marca",
            name: "marca",  
        },
        {
            label: "Fornecedor",
            name: "fornecedor.razsocial",  
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
                                toggleCadastroProdutosDialogOpen();
                            } else {
                                navigate(`/produtos/cadastro/${row.id}`)
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
            label: "Qtd. Estoque",
            name: "qtdatual"
        },
        {
            label: "Vl. Custo",
            name: "vlcusto",
        },
        {
            label: "Vl. Compra",
            name: "vlcompra",
        },
        {
            label: "Vl. Venda",
            name: "vlvenda",
        },
    ]


    return (
        <LayoutBase 
            titulo="Consultar Produtos"
            barraDeFerramentas={
                <ListTools
                    mostrarInputBusca
                    textoDaBusca={busca}
                    handleSeachTextChange={texto => setSearchParams({ busca : texto, pagina: '1' }, { replace : true })}
                    onClickNew={() => {
                        if (isDialog) {
                            setSelectedId(0);
                            toggleCadastroProdutosDialogOpen();
                        } else {
                            navigate('/produtos/cadastro/novo')
                        }
                    }}
                />
            }
        >
            <CollapsedDataTable
                collapseLabel="Outras Informações"
                collapseHeaders={collapsedHeaders}
                collapseRowId="id"
                collapseRows=""
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
                onClose={toggleCadastroProdutosDialogOpen}
                handleClose={toggleCadastroProdutosDialogOpen}
                open={isCadastroProdutosDialogOpen}
                title="Cadastrar Produto"
            >
                <CadastroProdutos
                    isDialog
                    toggleOpen={toggleCadastroProdutosDialogOpen}
                    selectedId={Number(selectedId)}
                    reloadDataTableIfDialog={reloadDataTable}
                />
            </CustomDialog>
        </LayoutBase>
    );
};