import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { Select, type SelectProps } from './select';

interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<SelectProps, 'name' | 'children'> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  children: React.ReactNode;
}

export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  children,
  className,
  ...selectProps
}: FormSelectProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          {label && (
            <label htmlFor={field.name} className="text-sm font-medium text-gray-900">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
          <Select
            {...selectProps}
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
          >
            {children}
          </Select>
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