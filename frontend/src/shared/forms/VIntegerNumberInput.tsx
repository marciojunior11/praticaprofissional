import React, { useEffect, useState } from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { useField } from "@unform/core";
import { InputAttributes, NumberFormatBaseProps, NumericFormat, NumericFormatProps } from 'react-number-format';

type TVNumberInputProps = TextFieldProps & {
    name: string;
    initialValue?: number;
    readOnly?: boolean;
}

const CustomNumberFormat = React.forwardRef<NumericFormatProps<InputAttributes>, TVNumberInputProps>((props: any, ref) => {
    const { onChange, prefix, ...other } = props;

    return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: parseFloat(Number(values.value).toFixed(2))
                    },
                });
            }}
            allowNegative={false}
            allowedDecimalSeparators={false}
        />
    )
})

export const VIntegerNumberInput: React.FC<TVNumberInputProps> = ({ name, initialValue, readOnly, ...rest }) => {
    const { fieldName, registerField, defaultValue, error, clearError } = useField(name);

    const [value, setValue] = useState(defaultValue || initialValue);

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

            InputLabelProps={{
                shrink: true,
            }}

            error={!!error}
            helperText={error}
            defaultValue={defaultValue}

            InputProps={{
                inputComponent: CustomNumberFormat as any,
                readOnly: readOnly
            }}

            value={value}
            onChange={e => { 
                rest.onChange?.(e); 
                setValue(Number(e.target.value));
            }}

            onKeyDown={(e) => {
                error && clearError();
                rest.onKeyDown?.(e);
            }}
        />
    );
};