import { Label, SettingsVoiceTwoTone } from "@mui/icons-material"
import { Autocomplete, CircularProgress, TextField } from "@mui/material"
import { useField } from "@unform/core"
import { LoDashStatic } from "lodash"
import React, { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { useDebounce } from "../hooks"

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
    label: string,
    secLabel?: string[],
    tercLabel?: string[],
    TFLabel: string,
    isExternalLoading?: boolean,
    onChange?: (newValue: any) => void,
    onInputchange?: () => void,
    required?: boolean
}

export const VAutocomplete: React.FC<TVAutocompleteProps> = ({size, name, getAll, label, TFLabel, isExternalLoading = false, ...rest}) => {

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
            getOptionLabel={option => (rest.tercLabel && rest.secLabel) ? option[label] + ' - ' + option[rest.secLabel[0]][rest.secLabel[1]] + ' - ' + option[rest.tercLabel[0]][rest.tercLabel[1]][rest.tercLabel[2]] : rest.secLabel ? option[label] + ' - ' + option[rest.secLabel[0]][rest.secLabel[1]] : option[label]}
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
    )
}