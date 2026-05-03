import { ApiCard, DataRow, DetailSection } from "../Shared/ApiCard";

const CpuConcurrency = () => {
  const cores = navigator.hardwareConcurrency ?? null;

  return (
    <ApiCard
      title="CPU Concurrency"
      icon="⚙️"
      category="device-hardware"
      purpose="Reports the number of logical CPU cores. Use this to decide how many Web Workers to spawn for parallel tasks like image processing or WASM workloads."
      status="info"
      mdnUrl="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/hardwareConcurrency"
      detailTitle="Hardware Concurrency — Details"
      detailContent={
        <div>
          <DetailSection heading="What it is">
            <p className="text-sm text-color5/80 leading-relaxed">
              <code className="text-xs bg-white/10 px-1 rounded">
                navigator.hardwareConcurrency
              </code>{" "}
              returns the number of logical processors — physical cores ×
              hyper-thread count. It's capped in some browsers to limit
              fingerprinting.
            </p>
          </DetailSection>
          <DetailSection heading="Worker pool pattern">
            <pre className="text-xs text-color5/70 font-mono bg-white/5 rounded-lg p-2 leading-relaxed overflow-x-auto">
              {`const workers = Array.from(
  { length: navigator.hardwareConcurrency },
  () => new Worker('./worker.js')
);`}
            </pre>
          </DetailSection>
          <DetailSection heading="Browser support">
            <p className="text-sm text-color5/80 leading-relaxed">
              Universally supported: Chrome 37+, Firefox 48+, Safari 10.1+.
            </p>
          </DetailSection>
        </div>
      }
    >
      <DataRow label="Logical CPU Cores" value={`${cores}`} copyable />
    </ApiCard>
  );
};

export default CpuConcurrency;
