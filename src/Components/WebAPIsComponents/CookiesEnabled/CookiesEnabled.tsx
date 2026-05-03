import { useEffect, useState } from "react";
import { ApiCard, DataRow, DetailSection } from "../Shared/ApiCard";

const checkCookies = (): boolean => {
  if (typeof navigator.cookieEnabled === "boolean")
    return navigator.cookieEnabled;
  try {
    document.cookie = "__bc_test=1; path=/; SameSite=Lax";
    const enabled = document.cookie.includes("__bc_test");
    document.cookie =
      "__bc_test=; path=/; SameSite=Lax; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    return enabled;
  } catch {
    return false;
  }
};

const CookieStatus = () => {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    setEnabled(checkCookies());
  }, []);

  const status =
    enabled === null ? undefined : enabled ? "supported" : "unsupported";
  const statusLabel =
    enabled === null ? undefined : enabled ? "Enabled" : "Disabled";

  return (
    <ApiCard
      title="Cookie Status"
      icon="🍪"
      status={status}
      statusLabel={statusLabel}
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/cookieEnabled"
      detailTitle="Cookie Status — Details"
      detailContent={
        <div>
          <DetailSection heading="What cookies are">
            <p className="text-sm text-color5/80 leading-relaxed">
              Cookies are small key-value pairs stored in the browser, used for
              sessions, preferences, and tracking.
              <code className="text-xs bg-white/10 px-1 rounded">
                navigator.cookieEnabled
              </code>{" "}
              checks whether the browser permits writing cookies in the current
              context.
            </p>
          </DetailSection>
          <DetailSection heading="When this can be wrong">
            <ul className="text-sm text-color5/80 space-y-1 list-disc list-inside leading-relaxed">
              <li>
                Private/Incognito mode may allow cookies for the session only
              </li>
              <li>
                Sandboxed iframes may block cookies even if the browser allows
                them
              </li>
              <li>
                Third-party cookie restrictions don't affect this top-level
                check
              </li>
            </ul>
          </DetailSection>
        </div>
      }
    >
      {enabled === null ? (
        <p className="text-sm text-color5/50">Checking…</p>
      ) : (
        <DataRow
          label="Cookie access"
          value={
            enabled
              ? "Cookies can be read and written"
              : "Cookies are blocked in this context"
          }
        />
      )}
    </ApiCard>
  );
};

export default CookieStatus;
