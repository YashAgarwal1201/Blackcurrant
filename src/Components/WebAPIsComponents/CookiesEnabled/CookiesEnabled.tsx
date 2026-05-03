import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { WEB_APIS_CARDS_BASE_STYLES } from "../../../Services/Constants";

const checkCookies = (): boolean => {
  // navigator.cookieEnabled is the standard, reliable API
  if (typeof navigator.cookieEnabled === "boolean") {
    return navigator.cookieEnabled;
  }
  // Fallback: manual write-read-delete for very old browsers
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
  const [cookiesEnabled, setCookiesEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    setCookiesEnabled(checkCookies());
  }, []);

  return (
    <Card
      className={WEB_APIS_CARDS_BASE_STYLES}
      title={<h2 className="font-heading">Cookie Status</h2>}
      subTitle={
        <p className="font-subHeading">
          (may vary in private/sandboxed contexts)
        </p>
      }
    >
      {cookiesEnabled === null ? (
        <p>Checking cookie status...</p>
      ) : cookiesEnabled ? (
        <p>Cookies are enabled</p>
      ) : (
        <p>Cookies are disabled</p>
      )}
    </Card>
  );
};

export default CookieStatus;
