import { useEffect, useState } from "react";
import { FormHelperText, Select, SelectProps, Typography } from "@mui/material";
import { useField } from "@unform/core";
import { format } from "path";

type TVSelectProps = SelectProps & {
    name: string;
    children: React.ReactNode;
}

export const VSelect: React.FC<TVSelectProps> = ({ children, name, ...rest }) => {
    const { fieldName, registerField, defaultValue, error, clearError } = useField(name);

    const [value, setValue] = useState(defaultValue || '');

    useEffect(() => {
        registerField({
            name: fieldName,
            getValue: () => value,
            setValue: (_, newValue) => setValue(newValue)
        });
    }, [registerField, fieldName, value]);

    return (
        <Select
            {...rest}

            error={!!error}
            defaultValue={defaultValue}

            value={value}
            onChange={e => { 
                error && clearError();
                rest.onChange?.(e, null);
                setValue(typeof e.target.value == 'string' ?  e.target.value.toUpperCase() : e.target.value);
            }}

            onKeyDown={(e) => {
                error && clearError();
                rest.onKeyDown?.(e);
            }}
        >
            {children}
        </Select>
    );
};