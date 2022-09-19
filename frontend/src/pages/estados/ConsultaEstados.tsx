// #region EXTERNAL IMPORTS
import { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter, LinearProgress, Pagination, IconButton, Icon } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
// #endregion

// #region INTERNAL IMPORTS
import { useDebounce } from "../../shared/hooks";
import { ListTools } from "../../shared/components";
import { LayoutBase } from "../../shared/layouts";
import { IEstados } from "../../shared/interfaces/entities/Estados";
import { Environment } from "../../shared/environment";
import ControllerEstados from "../../shared/controllers/EstadosController";
import { DataTable, IHeaderProps } from "../../shared/components/data-table/DataTable";
// #endregion

// #region INTERFACES
interface IConsultaProps {
    isDialog?: boolean;
    toggleDialogOpen?: () => void;
    onSelectItem?: (row: any) => void;
}
// #endregion

export const ConsultaEstados: React.FC<IConsultaProps> = ({ isDialog = false, onSelectItem, toggleDialogOpen }) => {
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
    const [rows, setRows] = useState<IEstados[]>([]);
    const [qtd, setQtd] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    // #endregion
    
    // #region ACTIONS
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
                        console.log(result);
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

    // #region CONTROLLERS
    const controller = new ControllerEstados();
    // #endregion

    const headers: IHeaderProps[] = [
        {
            label: "ID",
            name: "id",  
        },
        {
            label: "Estado",
            name: "nmestado",  
        },        
        {
            label: "UF",
            name: "uf",  
        },
        {
            label: "País",
            name: "pais.nmpais",  
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
                        <IconButton color="primary" size="small" onClick={() => navigate(`/estados/cadastro/${row.id}`)}>
                            <Icon>edit</Icon>
                        </IconButton>
                    </>
                )
            }
        }
    ]

    return (
        <LayoutBase 
            titulo="Consultar Estados"
            barraDeFerramentas={
                <ListTools
                    mostrarInputBusca
                    textoDaBusca={busca}
                    handleSeachTextChange={texto => setSearchParams({ busca : texto, pagina: '1' }, { replace : true })}
                    onClickNew={() => navigate('/estados/cadastro/novo')}
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
        </LayoutBase>
    );
};