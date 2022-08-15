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

interface IConsultaProps {
    isDialog?: boolean;
}

export const ConsultaFormasPagamento: React.FC<IConsultaProps> = ({ isDialog = false }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();

    const [rows, setRows] = useState<IFormasPagamento[]>([]);
    const [qtd, setQtd] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [isCadastroFormaPgtoDialogOpen, setIsCadastroFormaPgtoDialogOpen] = useState(false);
    const toggleCadastroFormaPgtoDialogOpen = () => {
        setIsCadastroFormaPgtoDialogOpen(oldValue => !oldValue);
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
            let data = new Date();
            console.log(data.toLocaleString());
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
                        setRows(oldRows => [
                            ...oldRows.filter(oldRow => oldRow.id !== id)
                        ]);
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
                        isDialog ? (
                            toggleCadastroFormaPgtoDialogOpen()
                        ) : (
                            navigate('/formaspagamento/cadastro/novo')
                        )
                    }}
                />
            }
        >
            <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows?.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.descricao}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="error" size="small" onClick={() => handleDelete(row.id)}>
                                        <Icon>delete</Icon>
                                    </IconButton>
                                    <IconButton color="primary" size="small" onClick={() => navigate(`/formasPagamento/cadastro/${row.id}`)}>
                                        <Icon>edit</Icon>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    { qtd === 0 && !isLoading && (
                        <caption>{Environment.LISTAGEM_VAZIA}</caption>
                    )}
                    <TableFooter>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <LinearProgress variant="indeterminate"/> 
                                </TableCell>
                            </TableRow>
                        )}
                        {(qtd > 0 && qtd > Environment.LIMITE_DE_LINHAS) && (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Pagination 
                                        page={pagina}
                                        count={Math.ceil(qtd / Environment.LIMITE_DE_LINHAS)}
                                        onChange={(_, newPage) => setSearchParams({ busca, pagina: newPage.toString() }, { replace : true })}
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableFooter>
                </Table>
            </TableContainer>
            <CustomDialog
                onClose={toggleCadastroFormaPgtoDialogOpen}
                handleClose={toggleCadastroFormaPgtoDialogOpen} 
                open={isCadastroFormaPgtoDialogOpen} 
                title="Cadastrar Forma de Pagamento"
            >
                <CadastroFormasPagamento 
                    isDialog
                    handleClose={toggleCadastroFormaPgtoDialogOpen}
                />
            </CustomDialog>
        </LayoutBase>
    );
};