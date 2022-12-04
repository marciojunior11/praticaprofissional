import { useEffect, useState } from "react";
import { useField } from "@unform/core";
import dayjs, { Dayjs } from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField } from "@mui/material";

type TVDatePickerProps = {
    name: string;
    label: string;
    onChange?: (e: Dayjs | null) => void;
    disabled?: boolean;
    disableFuture?: boolean;
}

export const VDatePicker: React.FC<TVDatePickerProps> = ({ name, label, onChange, disabled, disableFuture, ...rest }) => {
    const { fieldName, registerField, defaultValue, error, clearError } = useField(name);

    const [value, setValue] = useState<Dayjs | null>(dayjs(new Date().toLocaleString()));

    useEffect(() => {
        registerField({
            name: fieldName,
            getValue: () => value!,
            setValue: (_, newValue: Dayjs) => setValue(newValue)
        });
    }, [registerField, fieldName, value]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
                disableFuture={disableFuture}
                disabled={disabled}
                label={label}
                inputFormat="DD/MM/YYYY"
                value={value}
                onChange={(e) => {
                    setValue(e);
                    onChange?.(e);
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
            />
        </LocalizationProvider>
    );
};