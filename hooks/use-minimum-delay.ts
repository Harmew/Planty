import React from "react";

export function useMinimumDelay(ready: boolean, delay = 1500) {
  const [canProceed, setCanProceed] = React.useState(false);

  React.useEffect(() => {
    if (!ready) return;

    const timeout = setTimeout(() => {
      setCanProceed(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [ready, delay]);

  return canProceed;
}
