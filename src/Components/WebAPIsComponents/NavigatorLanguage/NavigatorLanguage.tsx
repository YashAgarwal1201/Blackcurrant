import { useState, useEffect } from "react";
import { ApiCard, DataRow, DetailSection } from "../Shared/ApiCard";

const getLanguageInfo = () => {
  const primary = navigator.language;
  const all = Array.from(navigator.languages ?? [primary]);
  return { primary, all };
};

const NavigatorLanguage = () => {
  const [info, setInfo] = useState(getLanguageInfo);

  useEffect(() => {
    const handleChange = () => setInfo(getLanguageInfo());
    window.addEventListener("languagechange", handleChange);
    return () => window.removeEventListener("languagechange", handleChange);
  }, []);

  return (
    <ApiCard
      title="Navigator Language"
      icon="🗣️"
      category="time-locale"
      purpose="The browser's preferred language tag (BCP 47). Use this to auto-select a locale for i18n without requiring the user to pick manually."
      status="info"
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language"
      detailTitle="Navigator Language — Details"
      detailContent={
        <div>
          <DetailSection heading="What these values are">
            <p className="text-sm text-color5/80 leading-relaxed">
              <code className="text-xs bg-white/10 px-1 rounded">
                navigator.language
              </code>{" "}
              returns the single primary language the browser is configured to
              use, in BCP 47 format (e.g.{" "}
              <code className="text-xs bg-white/10 px-1 rounded">en-US</code>,{" "}
              <code className="text-xs bg-white/10 px-1 rounded">hi-IN</code>).{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                navigator.languages
              </code>{" "}
              returns the full ordered list of preferred languages — what the
              browser sends in the{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                Accept-Language
              </code>{" "}
              HTTP header.
            </p>
          </DetailSection>
          <DetailSection heading="Use in i18n">
            <p className="text-sm text-color5/80 leading-relaxed">
              Pass{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                navigator.languages
              </code>{" "}
              to{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                Intl.DateTimeFormat
              </code>
              ,{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                Intl.NumberFormat
              </code>
              , or your i18n library to format dates, numbers, and strings
              according to user preference — no server round-trip needed.
            </p>
          </DetailSection>
          <DetailSection heading="Browser support">
            <p className="text-sm text-color5/80 leading-relaxed">
              Universally supported across all modern browsers.{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                navigator.languages
              </code>{" "}
              (plural) requires Chrome 37+, Firefox 32+, Safari 10.1+.
            </p>
          </DetailSection>
        </div>
      }
    >
      <DataRow label="Primary Language" value={info.primary} copyable />
      <DataRow
        label="Preferred Languages"
        value={info.all.join(", ")}
        mono
        copyable
      />
    </ApiCard>
  );
};

export default NavigatorLanguage;
