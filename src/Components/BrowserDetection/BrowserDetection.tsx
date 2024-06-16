// import React, { useState, useEffect } from "react";
// import { Card } from "primereact/card"; // Assuming PrimeReact is installed

// const BrowserDetection = ({ baseStyle }: { baseStyle: string }) => {
//   const [browserName, setBrowserName] = useState<string | null>(null);

//   useEffect(() => {
//     const detectBrowser = () => {
//       const userAgent = navigator.userAgent;

//       if (userAgent.indexOf("Firefox") > -1) {
//         return "Mozilla Firefox";
//       } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
//         return "Opera";
//       } else if (userAgent.indexOf("Chrome") > -1) {
//         return "Google Chrome";
//       } else if (userAgent.indexOf("Safari") > -1) {
//         return "Apple Safari";
//       } else if (userAgent.indexOf("Edge") > -1) {
//         return "Microsoft Edge";
//       } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident/") > -1) {
//         return "Internet Explorer";
//       } else if (userAgent.indexOf("Samsung") > -1) {
//         return "Samsung Internet";
//       } else {
//         return "Unknown Browser";
//       }
//     };

//     const updateBrowserName = () => {
//       const detectedBrowser = detectBrowser();
//       setBrowserName(detectedBrowser);
//     };

//     updateBrowserName();
//   }, []); // Empty dependency array to run only once on component mount

//   return (
//     <Card
//       className={baseStyle}
//       title={<h2 className="font-heading">Browser Detection</h2>}
//       subTitle={
//         <p className="font-subHeading">(user agent identification)</p>
//       }
//     >
//       {browserName === null ? (
//         <p>Checking...</p>
//       ) : (
//         <p>Detected Browser: {browserName}</p>
//       )}
//       {navigator.userAgent}
//     </Card>
//   );
// };

// export default BrowserDetection;


// import React, { useState, useEffect } from "react";
// import { Card } from "primereact/card"; // Assuming PrimeReact is installed

// const BrowserDetection = ({ baseStyle }: { baseStyle: string }) => {
//   const [browserName, setBrowserName] = useState<string | null>(null);
//   const [browserEngine, setBrowserEngine] = useState<string | null>(null);

//   useEffect(() => {
//     const detectBrowser = () => {
//       const userAgent = navigator.userAgent;

//       if (userAgent.indexOf("Gecko/") > -1 && userAgent.indexOf("Firefox/") > -1) {
//         return "Mozilla Firefox";
//       } else if (userAgent.indexOf("AppleWebKit/") > -1 && userAgent.indexOf("Chrome/") > -1) {
//         return "Google Chrome";
//       } else if (userAgent.indexOf("AppleWebKit/") > -1 && userAgent.indexOf("Safari/") > -1) {
//         return "Apple Safari";
//       } else if (userAgent.indexOf("AppleWebKit/") > -1 && userAgent.indexOf("Edge/") > -1) {
//         return "Microsoft Edge";
//       } else if (userAgent.indexOf("Trident/") > -1 || userAgent.indexOf("MSIE ") > -1) {
//         return "Internet Explorer";
//       } else if (userAgent.indexOf("SamsungBrowser/") > -1) {
//         return "Samsung Internet";
//       } else {
//         return "Unknown Browser";
//       }
//     };

//     const detectBrowserEngine = () => {
//       const userAgent = navigator.userAgent;

//       if (userAgent.indexOf("Gecko/") > -1) {
//         return "Gecko";
//       } else if (userAgent.indexOf("AppleWebKit/") > -1) {
//         return "WebKit";
//       } else if (userAgent.indexOf("Trident/") > -1 || userAgent.indexOf("MSIE ") > -1) {
//         return "Trident/MSIE";
//       } else {
//         return "Unknown Engine";
//       }
//     };

//     const updateBrowserInfo = () => {
//       const detectedBrowser = detectBrowser();
//       setBrowserName(detectedBrowser);

//       const detectedEngine = detectBrowserEngine();
//       setBrowserEngine(detectedEngine);
//     };

//     updateBrowserInfo();
//   }, []); // Empty dependency array to run only once on component mount

//   return (
//     <Card
//       className={baseStyle}
//       title={<h2 className="font-heading">Browser Detection</h2>}
//       subTitle={<p className="font-subHeading">(based on browser engine)</p>}
//     >
//       {browserName === null ? (
//         <p>Checking...</p>
//       ) : (
//         <>
//           <p>Detected Browser: {browserName}</p>
//           <p>Detected Engine: {browserEngine}</p>
//         </>
//       )}
//       <p>User Agent: {navigator.userAgent}</p>
//     </Card>
//   );
// };

// export default BrowserDetection;


import React, { useState, useEffect } from "react";
import { Card } from "primereact/card"; // Assuming PrimeReact is installed

const BrowserDetection = ({ baseStyle }: { baseStyle: string }) => {
  const [browserName, setBrowserName] = useState<string | null>(null);
  const [browserEngine, setBrowserEngine] = useState<string | null>(null);

  useEffect(() => {
    const detectBrowser = () => {
      const userAgent = navigator.userAgent;

      if (userAgent.indexOf("Firefox") > -1) {
        return "Mozilla Firefox";
      } else if (userAgent.indexOf("OPR") > -1 || userAgent.indexOf("Opera") > -1) {
        return "Opera";
      } else if (userAgent.indexOf("Edg") > -1) {
        return "Microsoft Edge";
      } else if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1) {
        return "Google Chrome"; // Chrome often includes "Safari" in its user agent
      } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
        return "Apple Safari";
      } else if (userAgent.indexOf("Trident/") > -1 || userAgent.indexOf("MSIE ") > -1) {
        return "Internet Explorer";
      } else if (userAgent.indexOf("SamsungBrowser") > -1) {
        return "Samsung Internet";
      } else {
        return "Unknown Browser";
      }
    };

    const detectBrowserEngine = () => {
      const userAgent = navigator.userAgent;

      if (userAgent.indexOf("Gecko/") > -1) {
        return "Gecko";
      } else if (userAgent.indexOf("AppleWebKit/") > -1) {
        return "WebKit";
      } else if (userAgent.indexOf("Trident/") > -1 || userAgent.indexOf("MSIE ") > -1) {
        return "Trident/MSIE";
      } else {
        return "Unknown Engine";
      }
    };

    const updateBrowserInfo = () => {
      const detectedBrowser = detectBrowser();
      setBrowserName(detectedBrowser);

      const detectedEngine = detectBrowserEngine();
      setBrowserEngine(detectedEngine);
    };

    updateBrowserInfo();
  }, []); // Empty dependency array to run only once on component mount

  return (
    <Card
      className={baseStyle}
      title={<h2 className="font-heading">Browser Detection</h2>}
      subTitle={<p className="font-subHeading">(based on browser engine)</p>}
    >
      {browserName === null ? (
        <p>Checking...</p>
      ) : (
        <>
          <p>Detected Browser: {browserName}</p>
          <p>Detected Engine: {browserEngine}</p>
        </>
      )}
      <p>User Agent: {navigator.userAgent}</p>
    </Card>
  );
};

export default BrowserDetection;
