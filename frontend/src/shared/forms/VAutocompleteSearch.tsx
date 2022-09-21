import { Label, SettingsVoiceTwoTone } from "@mui/icons-material"
import { Autocomplete, Button, CircularProgress, Grid, Icon, TextField } from "@mui/material"
import { useField } from "@unform/core"
import { LoDashStatic } from "lodash"
import React, { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { useDebounce } from "../hooks"
import { getNestedObjectPropValue } from "../utils/objects"

type TGenericList = {
    data: Array<any>,
    qtd: number
}

type TVAutocompleteProps = {
    size?: 'medium' | 'small',
    name: string,
    getAll: (
        page?: number,
        filter?: string
    ) => Promise<TGenericList | Error>
    label: string[],
    TFLabel: string,
    isExternalLoading?: boolean,
    onChange?: (newValue: any) => void,
    onInputchange?: () => void,
    required?: boolean,
    onClickSearch?: () => void,
}

export const VAutocompleteSearch: React.FC<TVAutocompleteProps> = ({size, name, getAll, label, TFLabel, isExternalLoading = false, onClickSearch, ...rest}) => {

    //HOOKS
    const { debounce } = useDebounce();
    const { fieldName, registerField, defaultValue, error, clearError } = useField(name);

    //STATES
    const [busca, setBusca] = useState('');
    const [options, setOptions] = useState<any[]>([]);
    const [selectedOption, setSelectedOption] = useState<any | undefined>(defaultValue);
    const [isLoading, setIsLoading] = useState(false);

    //EFFECTS

    useEffect(() => {
        
        registerField({
            name: fieldName,
            getValue: () => selectedOption,
            setValue: (_, newValue) => setSelectedOption(newValue),
        })

    }, [registerField, fieldName, selectedOption])

    useEffect(() =>{
        setIsLoading(true);
        debounce(() => {
            getAll(0, busca)
                .then(result => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {
                        setOptions(result.data);
                    }
                })
        })
    }, [])

    //MEMOS
    const autoCompleteSelectedOption = useMemo(() => {
        if (!selectedOption) return null;

        const mSelectedOption = options.find(option => option.id === selectedOption.id);
        if (!selectedOption) return null;

        return mSelectedOption;

    }, [selectedOption, options])

    return (
        <Grid container direction="row" spacing={0} alignItems="start">
            <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                <Autocomplete
                    //REQUIRED PARAMS
                    size={size}
                    options={options}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label={TFLabel} 
                            error={!!error}
                            helperText={error}
                            required={rest.required}
                        />
                    )}

                    //REST PARAMS
                    disablePortal
                    getOptionLabel={option => {
                        var value: string = "";
                        label.forEach(item => {
                            value += getNestedObjectPropValue(option, item) + " "
                        })
                        return value;
                    }}

                    autoComplete
                    blurOnSelect={true}

                        

                    //LOADING PARAMS
                    loading={isLoading}
                    disabled={isExternalLoading}
                    value={autoCompleteSelectedOption}
                    //onBlur={() => {rest.onBlur?.()}}

                    //ONCHANGE PARAMS
                    onInputChange={(_, newValue) => {setBusca(newValue); rest.onInputchange?.()}}
                    onChange={(_: any, newValue: any) => {
                        console.log(selectedOption)
                        setSelectedOption(newValue); 
                        setBusca(''); 
                        clearError(); 
                        rest.onChange?.(newValue);
                    }}

                    //POPUP ICON
                    popupIcon={(isExternalLoading || isLoading) ? <CircularProgress size={28}/> : undefined}

                    //TRADUCOES
                    openText='Abrir'
                    closeText='Fechar'
                    noOptionsText='Sem opções'
                    loadingText='Carregando...'
                />
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                <Button variant="outlined" size="large" color={!!error ? 'error' : 'primary'} onClick={onClickSearch}>
                    <Icon>search</Icon>
                </Button>
            </Grid>
        </Grid>
    )
}