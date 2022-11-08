// #region EXTERNAL IMPORTS
import { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter, LinearProgress, Pagination, IconButton, Icon, Chip } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
// #endregion

// #region INTERNAL IMPORTS
import { CustomDialog, ListTools } from "../../shared/components";
import { useDebounce } from "../../shared/hooks";
import { LayoutBase } from "../../shared/layouts";
import { Environment } from "../../shared/environment";
import { IFornecedores } from "../../shared/interfaces/entities/Fornecedores";
import { DataTable, IHeaderProps } from "../../shared/components/data-table/DataTable";
import { IConsultaProps } from "../../shared/interfaces/views/Consulta";
import { mask } from "../../shared/utils/functions";
import ControllerFornecedores from "../../shared/controllers/FornecedoresController";
import { CadastroFornecedores } from "./CadastroFornecedores";
// #endregion

export const ConsultaFornecedores: React.FC<IConsultaProps> = ({ isDialog = false, onSelectItem, toggleDialogOpen }) => {
    // #region CONTROLLERS
    const controller = new ControllerFornecedores();
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
    const [rows, setRows] = useState<IFornecedores[]>([]);
    const [qtd, setQtd] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isCadastroFornecedoresOpen, setIsCadastroFornecedoresOpen] = useState(false);
    // #endregion

    // #region ACTIONS
    const toggleCadastroFornecedoresOpen = () => {
        setIsCadastroFornecedoresOpen(oldValue => !oldValue);
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
        console.log(busca, pagina);
        debounce(() => {
            controller.getAll(pagina, busca)
                .then((result) => {
                    setIsLoading(false);

                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {
                        console.log(result);
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
                        setRows(oldRows => [
                            ...oldRows.filter(oldRow => oldRow.id !== id)
                        ]);
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
        },
        {
            label: "Raz. Social",
            name: "razsocial",  
        },        
        {
            label: "Nm. Fantasia",
            name: "nmfantasia",  
        },
        {
            label: "CNPJ",
            name: ' ',
            render: (row) => {
                return mask(row.cnpj, '##.###.###/0001-##');
            }
        },
        {
            label: "CEP",
            name: '',
            render: (row) => {
                return mask(row.cep, '#####-###');
            }
        },
        {
            label: "Endereço",
            name: ' ',
            render: (row) => {
                return `${row.endereco}, ${row.numend}, Bairro ${row.bairro}`
            }
        },
        {
            label: "Cidade",
            name: ' ',
            render: (row) => {
                return `${row.cidade.nmcidade}, ${row.cidade.estado.nmestado}, ${row.cidade.estado.pais.nmpais}`
            }
        },
        {
            label: "Situação",
            name: ' ',
            align: "center",
            render: (row) => {
                return (
                    <>
                        {row.flsituacao == "A" && (
                            <Chip label="ATIVO" color="success"/>
                        )}
                        {row.flsituacao == "I" && (
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
                                toggleCadastroFornecedoresOpen();
                            } else {
                                navigate(`/fornecedores/cadastro/${row.id}`)
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
            titulo="Consultar Fornecedores"
            barraDeFerramentas={
                <ListTools
                    mostrarInputBusca
                    textoDaBusca={busca}
                    handleSeachTextChange={texto => setSearchParams({ busca : texto, pagina: '1' }, { replace : true })}
                    onClickNew={() => {
                        if (isDialog) {
                            setSelectedId(0);
                            toggleCadastroFornecedoresOpen();
                        } else {
                            navigate('/fornecedores/cadastro/novo')
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
                onClose={toggleCadastroFornecedoresOpen}
                handleClose={toggleCadastroFornecedoresOpen}
                open={isCadastroFornecedoresOpen}
                title="Cadastrar País"
            >
                <CadastroFornecedores
                    isDialog
                    toggleOpen={toggleCadastroFornecedoresOpen}
                    selectedId={Number(selectedId)}
                    reloadDataTableIfDialog={reloadDataTable}
                />
            </CustomDialog>
        </LayoutBase>
    );
};