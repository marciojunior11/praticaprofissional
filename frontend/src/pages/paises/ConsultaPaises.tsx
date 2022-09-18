// #region EXTERNAL IMPORTS
import { useEffect, useMemo, useState } from "react";
import { IconButton, Icon } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
// #endregion

// #region INTERNAL IMPORTS
import { ListTools } from "../../shared/components";
import { useDebounce } from "../../shared/hooks";
import { LayoutBase } from "../../shared/layouts";
import { IPaises } from "../../shared/interfaces/entities/Paises";
import { DataTable, IHeaderProps } from "../../shared/components/data-table/DataTable";
import ControllerPaises from "../../shared/controllers/PaisesController"
// #endregion

// #region INTERFACES
interface IConsultaProps {
    isDialog?: boolean;
    toggleDialogOpen?: () => void;
    onSelectItem?: (row: any) => void;
}
// #endregion

export const ConsultaPaises: React.FC<IConsultaProps> = ({ isDialog = false, onSelectItem, toggleDialogOpen }) => {
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
    const [rows, setRows] = useState<IPaises[]>([]);
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
    // #endregion

    // #region CONTROLLERS
    const controller = new ControllerPaises();
    // #endregion

    const headers: IHeaderProps[] = [
        {
            label: "ID",
            name: "id",  
        },
        {
            label: "País",
            name: "nmpais",  
        },        
        {
            label: "Sigla",
            name: "sigla",  
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
                        <IconButton color="primary" size="small" onClick={() => navigate(`/paises/cadastro/${row.id}`)}>
                            <Icon>edit</Icon>
                        </IconButton>
                    </>
                )
            }
        }
    ]

    return (
        <LayoutBase 
            titulo="Consultar Países"
            barraDeFerramentas={
                <ListTools
                    mostrarInputBusca
                    textoDaBusca={busca}
                    handleSeachTextChange={texto => setSearchParams({ busca : texto, pagina: '1' }, { replace : true })}
                    onClickNew={() => navigate('/paises/cadastro/novo')}
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