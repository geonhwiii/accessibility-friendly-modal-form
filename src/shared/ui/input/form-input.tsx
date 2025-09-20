import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { Input, type InputProps } from './input';

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<InputProps, 'name'> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
}

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  className,
  ...inputProps
}: FormInputProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1">
          {label && (
            <label htmlFor={field.name} className="text-sm font-medium text-gray-900">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
          <Input
            {...inputProps}
            {...field}
            id={field.name}
            variant={fieldState.error ? 'error' : 'default'}
            aria-invalid={fieldState.error ? 'true' : 'false'}
            aria-describedby={
              fieldState.error
                ? `${field.name}-error`
                : description
                ? `${field.name}-description`
                : undefined
            }
          />
          {fieldState.error && (
            <p
              id={`${field.name}-error`}
              className="text-sm text-red-600"
              role="alert"
            >
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}