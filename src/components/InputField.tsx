import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Field, FormikErrors, FormikValues } from "formik";

export interface InputFieldProps
  extends React.ComponentPropsWithoutRef<"input"> {
  label: string;
  errors: FormikErrors<FormikValues>;
  name: string;
  variant: string;
  validate?: (arg0: string) => string | undefined;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  errors,
  type,
  name,
  variant,
}) => {
  return (
    <FormControl isInvalid={!!errors[name]}>
      <FormLabel htmlFor={id}>{label}</FormLabel>
      <Field as={Input} id={id} name={name} type={type} variant={variant} />
      {errors[name] ? (
        <FormErrorMessage>{errors[name]}</FormErrorMessage>
      ) : null}
    </FormControl>
  );
};
