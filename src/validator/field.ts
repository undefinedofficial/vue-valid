import {
  type MaybeRef,
  type UnwrapRef,
  type Ref,
  ref,
  toValue,
  reactive,
  watch,
  nextTick,
} from "vue";
import type { FormType } from "./form";

export type AnyObject = Record<string, any>;

export type MaybePromise<T> = T | Promise<T>;

/**
 * Initial function for acquiring values
 */
export type InitialFn<M extends AnyObject> = (
  field: { value: Ref<any>; check: () => void },
  fiels: FormType<M>
) => void;
/**
 * Validation function
 * @param value
 * @return boolean true for invalid, false for valid
 */
export type ValidationFn<T, M extends AnyObject> = (
  value: UnwrapRef<T>,
  fiels: FormType<M>
) => MaybePromise<boolean>;
export type ValidationObj<T, M extends AnyObject> = {
  initial: InitialFn<M>;
  check: ValidationFn<T, M>;
};
export type ValidationRecord<T, M extends AnyObject> = Record<
  string,
  ValidationFn<T, M> | ValidationObj<T, M>
>;
export type ValidationErrors = Record<string, boolean>;
export type UseFieldType<T, K extends AnyObject> = ReturnType<typeof useField<T, K>>;

export interface FieldOptions<T, M extends AnyObject> {
  initialValue: MaybeRef<T>;
  validators: ValidationRecord<T, M>;
}

function isFn(val: any): val is Function {
  return typeof val === "function";
}

function isPromise<T>(fn: T | Promise<T>): fn is Promise<T> {
  return fn && typeof (fn as Promise<T>).then === "function";
}

/**
 * Value hook watch changes in the input field and update the error
 */
export function useField<T = string, K extends AnyObject = {}>(
  { initialValue, validators }: FieldOptions<T, K>,
  fields: K
) {
  const value = ref<T>(toValue(initialValue));
  const errors = reactive<ValidationErrors>({});
  const isInvalid = ref(false);
  const isChanged = ref(false);

  let skipCheck = false;
  async function check() {
    if (skipCheck) {
      skipCheck = false;
      isInvalid.value = false;
      return;
    }

    for (const key in errors) errors[key] = false;

    let isValidValue = false;
    for (const [key, validator] of Object.entries(validators)) {
      let result = isFn(validator)
        ? validator(value.value, fields)
        : validator.check(value.value, fields);

      if (isPromise(result)) result = await result;

      if (result) isValidValue = result;
      errors[key] = result;
    }
    isInvalid.value = isValidValue;

    isChanged.value = true;
  }
  watch(value, check);

  Object.values(validators).forEach((validator) => {
    if (!isFn(validator)) validator.initial({ value, check }, fields);
  });

  function emitError(key: string) {
    errors[key] = true;
    isInvalid.value = true;
  }

  async function reset() {
    for (const key in errors) errors[key] = false;
    value.value = toValue(initialValue) as any;
    await nextTick();
    skipCheck = true;
    isInvalid.value = false;
    isChanged.value = false;
    for (const key in errors) errors[key] = false;
  }

  function addRule(key: string, rule: ValidationFn<T, K> | ValidationObj<T, K>) {
    validators[key] = rule;
    if (!isFn(rule)) rule.initial({ value, check }, fields);

    check();
  }

  function removeRule(key: string) {
    delete validators[key];

    check();
  }

  return { value, errors, isInvalid, isChanged, check, emitError, reset, addRule, removeRule };
}
