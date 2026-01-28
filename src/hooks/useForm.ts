import { useReducer, useCallback } from 'react';

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

type FormAction<T> =
  | { type: 'SET_VALUE'; field: keyof T; value: T[keyof T] }
  | { type: 'SET_ERROR'; field: keyof T; error: string }
  | { type: 'CLEAR_ERROR'; field: keyof T }
  | { type: 'SET_TOUCHED'; field: keyof T }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'RESET'; initialValues: T }
  | { type: 'SET_ERRORS'; errors: Partial<Record<keyof T, string>> };

function formReducer<T>(state: FormState<T>, action: FormAction<T>): FormState<T> {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
        isValid: false,
      };
    case 'CLEAR_ERROR': {
      const newErrors = { ...state.errors };
      delete newErrors[action.field];
      return {
        ...state,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0,
      };
    }
    case 'SET_TOUCHED':
      return {
        ...state,
        touched: { ...state.touched, [action.field]: true },
      };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.isSubmitting };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
        isValid: Object.keys(action.errors).length === 0,
      };
    case 'RESET':
      return {
        values: action.initialValues,
        errors: {},
        touched: {},
        isSubmitting: false,
        isValid: true,
      };
    default:
      return state;
  }
}

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, unknown>>({ 
  initialValues, 
  validate, 
  onSubmit 
}: UseFormOptions<T>) {
  const [state, dispatch] = useReducer(formReducer<T>, {
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true,
  });

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    dispatch({ type: 'SET_VALUE', field, value });
  }, []);

  const setTouched = useCallback((field: keyof T) => {
    dispatch({ type: 'SET_TOUCHED', field });
  }, []);

  const handleChange = useCallback((field: keyof T) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setValue(field, e.target.value as T[keyof T]);
  }, [setValue]);

  const handleBlur = useCallback((field: keyof T) => () => {
    setTouched(field);
    if (validate) {
      const errors = validate(state.values);
      if (errors[field]) {
        dispatch({ type: 'SET_ERROR', field, error: errors[field] as string });
      } else {
        dispatch({ type: 'CLEAR_ERROR', field });
      }
    }
  }, [validate, state.values, setTouched]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (validate) {
      const errors = validate(state.values);
      if (Object.keys(errors).length > 0) {
        dispatch({ type: 'SET_ERRORS', errors });
        return;
      }
    }
    
    dispatch({ type: 'SET_SUBMITTING', isSubmitting: true });
    try {
      await onSubmit(state.values);
    } finally {
      dispatch({ type: 'SET_SUBMITTING', isSubmitting: false });
    }
  }, [validate, onSubmit, state.values]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET', initialValues });
  }, [initialValues]);

  return {
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    isValid: state.isValid,
    setValue,
    setTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
}
