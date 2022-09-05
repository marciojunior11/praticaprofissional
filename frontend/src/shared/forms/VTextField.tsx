import { useEffect, useState } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { useField } from "@unform/core";
import { format } from "path";

type TVTextFieldProps = TextFieldProps & {
    name: string;
    format?: RegExp;
}

export const VTextField: React.FC<TVTextFieldProps> = ({ name, format, ...rest }) => {
    const { fieldName, registerField, defaultValue, error, clearError } = useField(name);

    const [value, setValue] = useState(defaultValue || '');

    const validateFormat = (value: any): any => {
        return value = format?.test(String(value)) ? value : "";
    }

    useEffect(() => {
        registerField({
            name: fieldName,
            getValue: () => value,
            setValue: (_, newValue) => setValue(newValue)
        });
    }, [registerField, fieldName, value]);

    return (
        <TextField
            {...rest}

            error={!!error}
            helperText={error}
            defaultValue={defaultValue}

            
            value={value}
            onChange={e => { 
                rest.onChange?.(e); 
                setValue(format ? validateFormat(e.target.value) : e.target.value.toUpperCase());
            }}

            onKeyDown={(e) => {
                error && clearError();
                rest.onKeyDown?.(e);
            }}
        />
    );
};