// src/Components/WebAPIsComponents/WebGLInfo/WebGLInfo.tsx

import { useMemo } from "react";
import { ApiCard, DataRow, CaveatNote, DetailSection } from "../Shared/ApiCard";

const getWebGLInfo = () => {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return null;

    const version = canvas.getContext("webgl2") ? "WebGL 2" : "WebGL 1";

    let renderer = gl.getParameter(gl.RENDERER) as string;
    let vendor = gl.getParameter(gl.VENDOR) as string;

    // Only attempt the deprecated extension on Chromium — Firefox logs a
    // deprecation warning for it and will remove it in a future release.
    const isChromium = !!(window as any).chrome;

    if (isChromium) {
      const isGeneric = (s: string) =>
        !s || s === "WebKit" || s === "Brian Paul" || s === "Mesa";

      if (isGeneric(renderer) || isGeneric(vendor)) {
        const dbg = gl.getExtension("WEBGL_debug_renderer_info");
        if (dbg) {
          renderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) ?? renderer;
          vendor = gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) ?? vendor;
        }
      }
    }

    return {
      version,
      renderer: renderer || "Masked",
      vendor: vendor || "Masked",
    };
  } catch {
    return null;
  }
};

const WebGLInfo = () => {
  const info = useMemo(getWebGLInfo, []);

  return (
    <ApiCard
      title="WebGL Info"
      icon="🎮"
      category="display"
      purpose="Reveals the GPU renderer and vendor string. Use this to detect software rendering (SwiftShader / llvmpipe) and warn users that WebGL-heavy content may perform poorly."
      status={info ? "supported" : "unsupported"}
      statusLabel={info ? info.version : "Not Available"}
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API"
      detailTitle="WebGL Info — Details"
      detailContent={
        <div>
          <DetailSection heading="Masked vs. unmasked renderer">
            <p className="text-sm text-color5/80 leading-relaxed">
              Browsers expose GPU info via{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                gl.RENDERER
              </code>{" "}
              and{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                gl.VENDOR
              </code>
              . Privacy-hardened browsers (Firefox in strict mode, Tor Browser)
              return a generic string — that's why you may see "Masked". The
              deprecated{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                WEBGL_debug_renderer_info
              </code>{" "}
              extension is used as a fallback for Chromium-based browsers only.
            </p>
          </DetailSection>
          <DetailSection heading="Software rendering detection">
            <p className="text-sm text-color5/80 leading-relaxed">
              If the renderer string contains <em>SwiftShader</em>,{" "}
              <em>llvmpipe</em>, or <em>Microsoft Basic Render</em>, WebGL is
              running on the CPU — expect severely degraded performance for 3D
              or canvas-heavy apps.
            </p>
          </DetailSection>
        </div>
      }
    >
      {!info ? (
        <CaveatNote>
          WebGL is not available in this browser or context.
        </CaveatNote>
      ) : (
        <>
          <DataRow label="Version" value={info.version} />
          <DataRow label="Renderer" value={info.renderer} copyable />
          <DataRow label="Vendor" value={info.vendor} copyable />
        </>
      )}
    </ApiCard>
  );
};

export default WebGLInfo;
