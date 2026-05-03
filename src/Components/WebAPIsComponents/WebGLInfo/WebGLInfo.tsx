import { useMemo } from "react";
import { ApiCard, DataRow, CaveatNote, DetailSection } from "../Shared/ApiCard";

const getWebGLInfo = () => {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return null;
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    return {
      version: canvas.getContext("webgl2") ? "WebGL 2" : "WebGL 1",
      renderer: dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : "Masked",
      vendor: dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : "Masked",
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
              The{" "}
              <code className="text-xs bg-white/10 px-1 rounded">
                WEBGL_debug_renderer_info
              </code>{" "}
              extension exposes the real GPU name. Some browsers (Firefox in
              privacy mode, Tor Browser) return a generic string to prevent
              fingerprinting — that's why you may see "Masked".
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
