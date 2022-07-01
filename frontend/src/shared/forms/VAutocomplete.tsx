import { Label, SettingsVoiceTwoTone } from "@mui/icons-material"
import { Autocomplete, CircularProgress, TextField } from "@mui/material"
import { useField } from "@unform/core"
import { LoDashStatic } from "lodash"
import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { useDebounce } from "../hooks"

type TGenericList = {
    data: Array<any>,
    qtd: number
}

type TVAutocompleteProps = {
    name: string,
    getAll: (
        page?: number,
        filter?: string
    ) => Promise<TGenericList | Error>
    optionLabel: string,
    TFLabel: string,
    isExternalLoading?: boolean,
    onChange?: () => void,
    onInputchange?: () => void,
    onBlur?: () => any
}

export const VAutocomplete: React.FC<TVAutocompleteProps> = ({name, getAll, optionLabel, TFLabel, isExternalLoading = false, ...rest}) => {

    //HOOKS
    const { debounce } = useDebounce();
    const { fieldName, registerField, defaultValue, error, clearError } = useField(name);

    //STATES
    const [busca, setBusca] = useState('');
    const [options, setOptions] = useState<any[]>([]);
    const [selectedOption, setSelectedOption] = useState<any | undefined>(options[0]);
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
            getAll(1, busca)
                .then(result => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        toast.error(result.message);
                    } else {
                        setOptions(result.data);
                    }
                })
        })
    }, [busca])

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
            options={options}
            renderInput={params => (
                <TextField
                    {...params}
                    label={TFLabel} 
                    error={!!error}
                    helperText={error}
                />
            )}

            //REST PARAMS
            disablePortal
            getOptionLabel={option => option[optionLabel]}
            autoComplete
            blurOnSelect={true}

                

            //LOADING PARAMS
            loading={isLoading}
            disabled={isExternalLoading}
            value={autoCompleteSelectedOption}
            onBlur={() => {rest.onBlur?.()}}

            //ONCHANGE PARAMS
            onInputChange={(_, newValue) => {setBusca(newValue); rest.onInputchange?.()}}
            onChange={(_: any, newValue: any) => {setSelectedOption(newValue); setBusca(''); clearError(); rest.onChange?.()}}

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