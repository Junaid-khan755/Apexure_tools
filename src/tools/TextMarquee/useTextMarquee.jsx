// tools/TextMarquee/useTextMarquee.js
// Separated from index.jsx to satisfy Vite Fast Refresh rule.

import { useState, useCallback, useMemo } from "react";
import { DEFAULT_TEXT_SETTINGS } from "./settings";
import { generateTextCode } from "./generator";

export function useTextMarquee() {
  const [textSettings, setTextSettings] = useState(DEFAULT_TEXT_SETTINGS);

  const set = useCallback(
    (k, v) => setTextSettings((s) => ({ ...s, [k]: v })),
    [],
  );

  const setBp = useCallback((bp, k, v) => {
    if (bp === "desktop") {
      setTextSettings((s) => ({ ...s, [k]: v }));
    } else {
      setTextSettings((s) => ({
        ...s,
        [bp]: { ...(s[bp] || {}), [k]: v },
      }));
    }
  }, []);

  const textCode = useMemo(
    () => generateTextCode(textSettings),
    [textSettings],
  );
  return { textSettings, textCode, set, setBp };
}
