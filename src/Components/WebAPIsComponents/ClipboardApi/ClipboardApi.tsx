import { useState, useEffect } from "react";
import { ApiCard, DataRow, CaveatNote, DetailSection } from "../Shared/ApiCard";

type PermState = "granted" | "denied" | "prompt" | "unknown";

const ClipboardApi = () => {
  const supported = "clipboard" in navigator;
  const [readState, setReadState] = useState<PermState>("unknown");
  const [writeState, setWriteState] = useState<PermState>("unknown");

  useEffect(() => {
    if (!("permissions" in navigator)) return;
    navigator.permissions
      .query({ name: "clipboard-read" as PermissionName })
      .then((r) => setReadState(r.state as PermState))
      .catch(() => setReadState("unknown"));
    navigator.permissions
      .query({ name: "clipboard-write" as PermissionName })
      .then((r) => setWriteState(r.state as PermState))
      .catch(() => setWriteState("unknown"));
  }, []);

  return (
    <ApiCard
      title="Clipboard API"
      icon="📋"
      category="browser-environment"
      purpose="The async Clipboard API lets you read and write the system clipboard programmatically. Requires explicit user permission for read access."
      status={!supported ? "unsupported" : "info"}
      statusLabel={!supported ? "Not Available" : "Available"}
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API"
      detailTitle="Clipboard API — Details"
      detailContent={
        <div>
          <DetailSection heading="Read vs. Write permissions">
            <p className="text-sm text-color5/80 leading-relaxed">
              <strong>Write</strong> (copy) is auto-granted in response to a
              user gesture. <strong>Read</strong> (paste) requires an explicit
              permission prompt in most browsers. Safari grants read only when
              the user invokes the native paste action.
            </p>
          </DetailSection>
          <DetailSection heading="Browser support">
            <p className="text-sm text-color5/80 leading-relaxed">
              Chrome 66+, Edge 79+, Firefox 90+, Safari 13.1+. Must be in a
              secure context (HTTPS or localhost).
            </p>
          </DetailSection>
        </div>
      }
    >
      {!supported ? (
        <CaveatNote>
          Clipboard API not available in this browser or context.
        </CaveatNote>
      ) : (
        <>
          <DataRow label="API Available" value="Yes" />
          <DataRow label="Read Permission" value={readState} />
          <DataRow label="Write Permission" value={writeState} />
        </>
      )}
    </ApiCard>
  );
};

export default ClipboardApi;
