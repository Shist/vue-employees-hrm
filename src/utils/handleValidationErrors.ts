import type { ErrorObject } from "@vuelidate/core";

export const handleValidationErrors = <T extends Record<keyof T, string>>(
  errors: ErrorObject[]
): Record<keyof T, string> => {
  return errors.reduce((acc, value) => {
    return { ...acc, [value.$property]: value.$message };
  }, {} as Record<keyof T, string>);
};
