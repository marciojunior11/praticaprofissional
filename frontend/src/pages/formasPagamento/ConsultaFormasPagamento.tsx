import { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter, LinearProgress, Pagination, IconButton, Icon } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CustomDialog, ListTools } from "../../shared/components";
import { useDebounce } from "../../shared/hooks";
import { LayoutBase } from "../../shared/layouts";
import { FormasPagamentoService } from '../../shared/services/api/formasPagamento/FormasPagamentoService';
import { IFormasPagamento } from "../../shared/models/ModelFormasPagamento";
import { Environment } from "../../shared/environment";
import { toast } from "react-toastify";
import { CadastroFormasPagamento } from "./CadastroFormasPagamento";
import { DataTable, IHeaderProps } from "../../shared/components/data-table/DataTable";

interface IConsultaProps {
    isDialog?: boolean;
    toggleDialogOpen?: () => void;
    onSelectItem?: (row: any) => void;
}

export const ConsultaFormasPagamento: React.FC<IConsultaProps> = ({ isDialog = false, onSelectItem, toggleDialogOpen }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState<number | undefined>();

    const headers: IHeaderProps[] = useMemo(() => [
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
                                toggleCadastroFormaPgtoDialogOpen();
                            } else {
                                navigate(`/estados/cadastro/${row.id}`)
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
    ], [])

    const [rows, setRows] = useState<IFormasPagamento[]>([]);
    const [qtd, setQtd] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [isCadastroFormaPgtoDialogOpen, setIsCadastroFormaPgtoDialogOpen] = useState(false);
    const toggleCadastroFormaPgtoDialogOpen = () => {
        setIsCadastroFormaPgtoDialogOpen(oldValue => !oldValue);
    }

    const reloadDataTable = () => {
        setIsLoading(true);

        debounce(() => {
            FormasPagamentoService.getAll(pagina, busca)
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
            FormasPagamentoService.getAll(pagina, busca)
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
            FormasPagamentoService.deleteById(id)
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
            titulo={!isDialog ? "Consultar Formas de Pagamento" : ""}
            barraDeFerramentas={
                <ListTools
                    mostrarInputBusca
                    textoDaBusca={busca}
                    handleSeachTextChange={texto => setSearchParams({ busca : texto, pagina: '1' }, { replace : true })}
                    onClickNew={() => {
                        if (isDialog) {
                            setSelectedId(0);
                            toggleCadastroFormaPgtoDialogOpen();
                        } else {
                            navigate('/formaspagamento/cadastro/novo');
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
                maxWidth="md"
                onClose={toggleCadastroFormaPgtoDialogOpen}
                handleClose={toggleCadastroFormaPgtoDialogOpen} 
                open={isCadastroFormaPgtoDialogOpen} 
                title="Cadastrar Forma de Pagamento"
            >
                <CadastroFormasPagamento 
                    isDialog
                    toggleOpen={toggleCadastroFormaPgtoDialogOpen}
                    selectedId={Number(selectedId)}
                    reloadDataTableIfDialog={reloadDataTable}
                />
            </CustomDialog>
        </LayoutBase>
    );
};