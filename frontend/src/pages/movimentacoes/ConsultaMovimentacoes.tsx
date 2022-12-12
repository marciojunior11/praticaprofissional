// #region EXTERNAL IMPORTSIMPORTS
import { useEffect, useMemo, useState } from "react";
import { IconButton, Icon, Grid, Chip, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
// #endregion

// #region INTERNAL IMPORTS
import { CustomDialog, ListTools } from "../../shared/components";
import { useDebounce } from "../../shared/hooks";
import { LayoutBase } from "../../shared/layouts";
import { IMovimentacoes } from "../../shared/interfaces/entities/Movimentacoes";
import { DataTable, IHeaderProps } from "../../shared/components/data-table/DataTable";
import ControllerMovimentacoes from "../../shared/controllers/MovimentacoesController"
import { IConsultaProps } from "../../shared/interfaces/views/Consulta"
// #endregion

export const ConsultaMovimentacoes: React.FC<IConsultaProps> = ({ isDialog = false, onSelectItem, toggleDialogOpen }) => {
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
    const [rows, setRows] = useState<IMovimentacoes[]>([]);
    const [qtd, setQtd] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    // #endregion

    // #region ACTIONS

    const calcularFooterValue = (): string => {
        let total = 0;
        rows.forEach((row) => {
            if (row.tipo == 'E') {
                total -= row.valor;
            } else {
                total += row.valor;
            }
        })

        return new Intl.NumberFormat('pr-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(total);
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
                        console.log(result);
                        setRows(result.data);
                        setQtd(result.qtd);
                    }
                });
        })
    }, [busca, pagina]);

    // #endregion

    // #region CONTROLLERS
    const controller = new ControllerMovimentacoes();
    // #endregion

    const headers: IHeaderProps[] = [
        {
            label: "ID",
            name: "id",
            align: "right",   
        },
        {
            label: "Nm. Pessoa",
            name: "",
            align: "left", 
            render: (row) => {
                return (
                    <>
                        {row.tipo == 'E' && (
                            `${row.pessoa.razsocial}`
                        )}
                        {row.tipo == 'S' && (
                            `${row.pessoa.nmcliente}`
                        )}
                    </>
                )
            }
        },
        {
            label: "Dt. Movimentação",
            name: "dtmovimentacao",
            align: "center",
            render: (row) => {
                return (
                    <>
                        {new Date(row.dtmovimentacao).toLocaleDateString()}
                    </>
                )
            }
        },
        {
            label: "Valor",
            name: "valor", 
            align: "center", 
            render: (row) => {
                return (
                    new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(row.valor)
                )
            }
        },
        {
            label: "Tipo",
            name: "tipo",
            align: "center", 
            render: (row) => {
                return (
                    <>
                        <Grid item container spacing={2} justifyContent="center">
                            <Grid item>
                                {row.tipo == 'E' && (
                                    <Chip label="ENTRADA" color="error"/>
                                )}
                                {row.tipo == 'S' && (
                                    <Chip label="SAÍDA" color="success"/>
                                )}
                            </Grid>
                        </Grid>                     
                    </>
                )
            } 
        },        
    ]

    return (
        <LayoutBase 
            titulo="Consultar Movimentações"
        >
            <DataTable
                headers={headers}
                rows={rows}
                rowId="id"
                isLoading={isLoading}
                page={pagina}
                rowCount={qtd}
                onPageChange={(page) => setSearchParams({ busca, pagina: page.toString() }, { replace : true })}
                footer
                footerValue={<Typography variant="h6">{calcularFooterValue()}</Typography>}
                footerLabel={<Typography variant="h6">Total:</Typography>}   
            />
        </LayoutBase>
    );
};