import React, { useEffect, useState } from "react";
import { Card } from "primereact/card"; // Assuming PrimeReact is installed

const CookieStatus: React.FC = () => {
  const [cookiesEnabled, setCookiesEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const checkCookiesEnabled = () => {
      // Attempt to set a test cookie
      document.cookie = "testCookie=1";

      // Check if the test cookie was set
      const cookieEnabled = document.cookie.indexOf("testCookie") !== -1;

      // Delete the test cookie
      document.cookie =
        "testCookie=1; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      setCookiesEnabled(cookieEnabled);
    };

    checkCookiesEnabled(); // Call the function within useEffect
  }, []); // Empty dependency array to run only once on component mount

  const cardStyle = "rounded-md"; // Card styling

  return (
    <Card
      className={cardStyle}
      title={<h2>Cookie Status</h2>}
      subTitle={<p>(can be wrong for some browsers)</p>}
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
