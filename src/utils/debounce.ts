export const debounce = <F extends (...args: string[]) => ReturnType<F>>( func: F, waitFor: number ) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
  
    return (...args: Parameters<F>): void => {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => func(...args), waitFor);
    };
  };