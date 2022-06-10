import { Box, Button, TextField, Paper, useTheme, InputAdornment, Icon } from "@mui/material"

import { Environment } from "../../environment";

interface IListTools {
    textoDaBusca?: string;
    mostrarInputBusca?: boolean;
    handleSeachTextChange?: (novoTexto: string) => void;
    textoBotaoNovo?: string;
    mostrarBotaoNovo?: boolean;
    onClickNew?: () => void;
}

export const ListTools: React.FC<IListTools> = ({
    textoDaBusca = '',
    mostrarInputBusca = false,
    handleSeachTextChange,
    textoBotaoNovo = 'Novo',
    mostrarBotaoNovo = true,
    onClickNew,
}) => {

    const theme = useTheme();

    return (
        <Box 
            height={theme.spacing(5)} 
            marginX={1} 
            padding={1} 
            paddingX={2} 
            display='flex' 
            gap={1} 
            alignItems='center' 
            component={Paper}
        >

            { mostrarInputBusca && (
                <TextField
                    size='small'
                    value={textoDaBusca}
                    onChange={(e) => handleSeachTextChange?.(e.target.value)}
                    placeholder={Environment.INPUT_DE_BUSCA}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <Icon>search</Icon>
                            </InputAdornment>
                        )
                    }}
                />
            )}

            <Box flex={1} display='flex' justifyContent='end'>
                { mostrarBotaoNovo && (
                    <Button
                        color='primary'
                        endIcon={<Icon>add</Icon>}
                        variant='contained'
                        disableElevation
                        onClick={onClickNew}
                    >
                        {textoBotaoNovo}
                    </Button>
                )}
            </Box>
        </Box>
    );
};