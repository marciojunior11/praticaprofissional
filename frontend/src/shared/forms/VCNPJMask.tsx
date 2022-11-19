import React, { useEffect, useState } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { useField } from "@unform/core";
import { IMaskInput } from "react-imask";

type TVCNPJInputProps = TextFieldProps & {
    name: string;
    inputProps?: React.ReactNode;
}

const TextMaskCustom = React.forwardRef<HTMLElement, TVCNPJInputProps>((props: any, ref) => {
    const { onChange, ...other } = props;

    return (
        <IMaskInput
            {...other}

            mask="00.000.000/0000-0"
            definitions={{
                '#': /[1-9]/
            }}
            inputRef={ref}
            onAccept={(value: any, mask) => {
                onChange({
                    target: {
                        name: props.name,
                        value: mask.unmaskedValue
                    }
                })
            }}
            overwrite
        />
    )
})

export const VCNPJMask: React.FC<TVCNPJInputProps> = ({ name, inputProps, ...rest }) => {
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
        <TextField
            {...rest}

            // InputLabelProps={{
            //     shrink: true,
            // }}

            error={!!error}
            helperText={error}
            defaultValue={defaultValue}

            InputProps={{
                endAdornment: (
                    inputProps
                ),
                inputComponent: TextMaskCustom as any,
            }}

            value={value}
            onChange={e => { 
                rest.onChange?.(e); 
                setValue(e.target.value);
            }}

            onKeyDown={(e) => {
                error && clearError();
                rest.onKeyDown?.(e);
            }}
        />
    );
};