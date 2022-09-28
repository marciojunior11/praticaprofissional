// #region EXTERNAL IMPORTS
import { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter, LinearProgress, Pagination, IconButton, Icon, Chip } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
// #endregion

// #region INTERNAL IMPORTS
import { ListTools } from "../../shared/components";
import { useDebounce } from "../../shared/hooks";
import { LayoutBase } from "../../shared/layouts";
import { FornecedoresService, IFornecedores } from '../../shared/services/api/fornecedores/FornecedoresService';
import { Environment } from "../../shared/environment";
import { DataTable, IHeaderProps } from "../../shared/components/data-table/DataTable";
import { IConsultaProps } from "../../shared/interfaces/views/Consulta";
import { mask } from "../../shared/utils/functions";
// #endregion

export const ConsultaFornecedores: React.FC<IConsultaProps> = ({ isDialog = false, onSelectItem, toggleDialogOpen }) => {
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
    const [rows, setRows] = useState<IFornecedores[]>([]);
    const [qtd, setQtd] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    // #endregion

    // #region ACTIONS
    useEffect(() => {
        setIsLoading(true);
        console.log(busca, pagina);
        debounce(() => {
            FornecedoresService.getAll(pagina, busca)
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
            FornecedoresService.deleteById(id)
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
                return mask(row.cnpj, '#####-###');
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
                        <IconButton color="primary" size="small" onClick={() => navigate(`/fornecedores/cadastro/${row.id}`)}>
                            <Icon>edit</Icon>
                        </IconButton>
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
                    onClickNew={() => navigate('/fornecedores/cadastro/novo')}
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