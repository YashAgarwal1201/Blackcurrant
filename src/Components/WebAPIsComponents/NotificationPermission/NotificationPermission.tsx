import { ApiCard, DataRow, CaveatNote, DetailSection } from "../Shared/ApiCard";
import type { StatusType } from "../Shared/ApiCard";

const permToStatus = (p: NotificationPermission): StatusType =>
  p === "granted" ? "supported" : p === "denied" ? "unsupported" : "partial";

const NotificationPermission = () => {
  const supported = "Notification" in window;
  const permission = supported ? Notification.permission : null;

  return (
    <ApiCard
      title="Notification Permission"
      icon="🔔"
      category="browser-environment"
      purpose="Shows whether the user has granted, denied, or not yet been asked for notification permission. Never request notifications without a clear user trigger."
      status={!supported ? "unsupported" : permToStatus(permission!)}
      statusLabel={!supported ? "Not Supported" : (permission ?? undefined)}
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/Notification/permission_static"
      detailTitle="Notification Permission — Details"
      detailContent={
        <div>
          <DetailSection heading="Permission states">
            <ul className="text-sm text-color5/80 space-y-1 list-disc list-inside leading-relaxed">
              <li>
                <strong>default</strong> — user hasn't been asked yet. You can
                call{" "}
                <code className="text-xs bg-white/10 px-1 rounded">
                  Notification.requestPermission()
                </code>
                .
              </li>
              <li>
                <strong>granted</strong> — you can send notifications.
              </li>
              <li>
                <strong>denied</strong> — the user blocked notifications. You
                cannot prompt again; direct users to browser settings.
              </li>
            </ul>
          </DetailSection>
          <DetailSection heading="Best practice">
            <p className="text-sm text-color5/80 leading-relaxed">
              Only request notification permission in direct response to a user
              action (e.g. a "Subscribe to updates" button), never on page load.
              Unsolicited prompts are almost always denied.
            </p>
          </DetailSection>
        </div>
      }
    >
      {!supported ? (
        <CaveatNote>Notification API not supported in this browser.</CaveatNote>
      ) : (
        <DataRow
          label="Permission State"
          value={permission ?? "unknown"}
          copyable
        />
      )}
    </ApiCard>
  );
};

export default NotificationPermission;
