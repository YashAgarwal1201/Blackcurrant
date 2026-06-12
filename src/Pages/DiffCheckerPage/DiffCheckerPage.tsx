import ImageDiff from "@/Components/DiffChecker/ImageDiff";
import TextDiff from "@/Components/DiffChecker/TextDiff";
import GoBackBtn from "@/Layout/GoBackBtn";
import Layout from "@/Layout/Layout";
import useDiffCheckerStore from "@/Services/Stores/diffCheckerStore";

// import "./DiffChecker.scss";

const MODES = [
  { key: "text", label: "Text" },
  { key: "image", label: "Image" },
] as const;

const DiffCheckerPage = () => {
  const { activeMode, setActiveMode } = useDiffCheckerStore();

  return (
    <Layout>
      <div className="w-full h-full flex flex-col bg-base-100">
        {/* Header */}
        <div className="shrink-0 px-3 pt-3 pb-2 md:px-4 md:pt-4 flex items-center gap-x-1">
          <GoBackBtn />
          <h1 className="text-2xl xs:text-3xl mdl:text-4xl text-primary font-heading select-none truncate">
            Diff Checker
          </h1>
        </div>

        {/* Mode toggle */}
        <div className="shrink-0 px-3 md:px-4 pb-3">
          <div className="flex items-center gap-1 bg-base-200 rounded-xl p-1 w-fit">
            {MODES.map((mode) => (
              <button
                key={mode.key}
                type="button"
                onClick={() => setActiveMode(mode.key)}
                className={`h-9 px-5 rounded-lg text-sm font-semibold font-subHeading transition-colors duration-150
                  ${
                    activeMode === mode.key
                      ? "bg-base-100 text-base-content shadow-sm"
                      : "text-neutral-content hover:text-base-content"
                  }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0">
          {activeMode === "text" ? <TextDiff /> : <ImageDiff />}
        </div>
      </div>
    </Layout>
  );
};

export default DiffCheckerPage;
