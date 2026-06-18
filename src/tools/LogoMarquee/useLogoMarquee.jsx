// tools/LogoMarquee/useLogoMarquee.js
// Separated from index.jsx to satisfy Vite Fast Refresh rule:
// .jsx files must only export React components.

import { useState, useCallback, useMemo } from "react";
import { DEFAULT_LOGO_SETTINGS } from "./settings";
import { generateLogoCode } from "./generator";

export function useLogoMarquee() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const [logos, setLogos] = useState([]);
  const [logoSettings, setLogoSettings] = useState(DEFAULT_LOGO_SETTINGS);

  const set = useCallback(
    (k, v) => setLogoSettings((s) => ({ ...s, [k]: v })),
    [],
  );
  const addLogo = useCallback((l) => setLogos((p) => [...p, l]), []);
  const removeLogo = useCallback(
    (id) => setLogos((p) => p.filter((l) => l.id !== id)),
    [],
  );
  const renameLogo = useCallback(
    (id, name) =>
      setLogos((p) => p.map((l) => (l.id === id ? { ...l, name } : l))),
    [],
  );

  const logoCode = useMemo(
    () => generateLogoCode(logos, logoSettings),
    [logos, logoSettings],
  );

  const bpVal = (k) => {
    const bp = logoSettings.breakpoint;
    return bp === "desktop"
      ? logoSettings[k]
      : (logoSettings[bp]?.[k] ?? logoSettings[k]);
  };

  return {
    logos,
    logoSettings,
    logoCode,
    set,
    addLogo,
    removeLogo,
    renameLogo,
    supabaseUrl,
    supabaseAnonKey,
    bpVal,
  };
}
