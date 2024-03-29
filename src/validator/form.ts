import { reactive } from "vue";
import { useField, type FieldOptions, type UseFieldType } from "./field";

export type FormType<T extends Record<string, FieldOptions<any, any>>> = ReturnType<
  typeof useForm<T, any>
>;

type FieldsType<T extends Record<string, FieldOptions<any, any>>> = {
  [K in keyof T]: UseFieldType<T[K]["initialValue"], FieldsType<T>>;
};

export function useForm<T extends Record<string, FieldOptions<any, any>>, K extends FieldsType<T>>(
  initialFields: T
) {
  const fields = reactive<K>({} as any);

  Object.entries(initialFields).forEach(([key, field]) => {
    (fields as any)[key] = useField(field, fields);
  });
  /**
   * Checks if the fields are valid.
   *
   * @return {boolean} Returns true if all fields are valid, false otherwise.
   */
  async function checkValid() {
    let isInvalid = false;
    for (const field of Object.values(fields)) {
      await field.check();
      if (field.isInvalid === true) isInvalid = true;
    }
    return !isInvalid;
  }

  /**
   * Resets the fields.
   */
  function reset() {
    for (const field of Object.values(fields)) {
      field.reset();
    }
  }

  /**
   * Checks if the fields are changed
   */
  function isChanged() {
    for (const field of Object.values(fields)) {
      if (field.isChanged.value) return true;
    }
    return false;
  }

  return { ...fields, checkValid, reset, isChanged };
}
