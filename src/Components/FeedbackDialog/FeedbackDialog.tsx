// src/Components/FeedbackDialog/FeedbackDialog.tsx
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Sidebar } from "primereact/sidebar";
import { SubmitHandler, useForm } from "react-hook-form";
import useNavStore from "../../Services/Stores/navStore";
import { Send, Trash } from "lucide-react";
import { useRef, useState } from "react";
import useToastStore from "../../Services/Stores/toastMessageStore";
import { FeedbackFormType } from "../../Services/typesAndInterfaces";
import DOMPurify from "dompurify";

const FeedbackDialog = () => {
  const showToast = useToastStore((state) => state.showToast);
  const { isFeedbackDialogOpen, closeFeedbackDialog } = useNavStore();
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: { name: "", email: "", message: "", website: "", phone: "" },
    mode: "onChange",
  });
  const formLoadTime = useRef(Date.now());
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const openEmailFallback = (name: string, email: string, message: string) => {
    const subject = encodeURIComponent(
      "Feedback Form Submission - Blackcurrant",
    );
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    );
    window.location.href = `mailto:${import.meta.env.VITE_BACKUP_DEV_EMAIL_ADDRESS}?subject=${subject}&body=${body}`;
  };

  const sanitizeData = (data: FeedbackFormType) => ({
    name: DOMPurify.sanitize(data.name.trim(), { ALLOWED_TAGS: [] }),
    email: data.email.trim().toLowerCase(),
    message: DOMPurify.sanitize(data.message.trim(), { ALLOWED_TAGS: [] }),
  });

  const onSubmit: SubmitHandler<FeedbackFormType> = async (data) => {
    const timeElapsed = Date.now() - formLoadTime.current;

    // Silent trap - honeypot filled or form submitted too fast
    if (data.website || data.phone || timeElapsed < 2000) {
      // Fake success - don't reveal detection to bots
      showToast("success", "Success", "Form submitted");
      reset();
      return;
    }

    const sanitized = sanitizeData(data);

    try {
      setLoading(true);

      const response = await fetch(
        import.meta.env.VITE_BASE_API_URL +
          "api-services/blackcurrant/feedback-form-data",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sanitized),
        },
      );

      await response.json();

      if (response.ok) {
        reset();
        setSubmitted(true);
        closeFeedbackDialog();
        showToast("success", "Success", "Form submitted");
      } else {
        showToast(
          "error",
          "Error",
          "Failed to submit. Please check console for more details and meanwhile Opening email app...",
        );
        console.error("Form submission failed:", response.statusText);
        openEmailFallback(sanitized.name, sanitized.email, sanitized.message);
      }
    } catch (error) {
      showToast("error", "Error", "An error occurred. Opening email app...");
      console.error("Form submission error:", error);
      openEmailFallback(sanitized.name, sanitized.email, sanitized.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar
      visible={isFeedbackDialogOpen}
      onHide={() => {
        reset();
        closeFeedbackDialog();
      }}
      position="right"
      header={
        <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl text-color5">
          Have some suggestions?
        </h2>
      }
      className="side-menu w-full! md:w-[768px]! rounded-none md:rounded-l-xl! bg-color1"
      closeIcon={<span className="pi pi-times text-color5"></span>}
      maskClassName="backdrop-blur"
    >
      <div className="w-full bg-base-200 rounded-3xl py-4 px-4">
        <form className="feedback-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-section w-full py-4 px-2 flex flex-col gap-y-2 sm:gap-y-3 rounded-xl">
            <div className="flex justify-between items-center">
              <label
                htmlFor="feedback-name"
                className="text-lg md:text-xl lg:text-2xl font-subHeading text-base-content flex items-center gap-x-3"
              >
                <span
                  aria-hidden="true"
                  className="pi pi-id-card text-primary"
                />
                Name
                <span aria-hidden="true" className="text-error">
                  *
                </span>
              </label>
              {errors.name && (
                <p
                  role="alert"
                  className="text-error text-xs sm:text-base font-content"
                >
                  {errors.name.message}
                </p>
              )}
            </div>
            <InputText
              id="feedback-name"
              disabled={loading}
              aria-describedby={errors.name ? "feedback-name-error" : undefined}
              aria-invalid={!!errors.name}
              placeholder="e.g. Jhone Doe"
              className="disabled:opacity-70 font-content p-4 text-base sm:text-lg  bg-primary text-primary-content placeholder:text-primary-content/50 rounded-3xl"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                maxLength: {
                  value: 70,
                  message: "Name must be less than 70 characters",
                },
                pattern: {
                  value: /^[a-zA-Z\s'\-.]+$/,
                  message:
                    "Name can only contain letters, spaces, hyphens, and apostrophes",
                },
              })}
            />
          </div>
          <hr className="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-base-300" />

          <div className="form-section w-full py-4 px-2 flex flex-col gap-y-2 sm:gap-y-3 rounded-xl">
            <div className="flex justify-between items-center">
              <label
                htmlFor="feedback-email"
                className="text-lg md:text-xl lg:text-2xl font-subHeading text-base-content flex items-center gap-x-3"
              >
                <span
                  aria-hidden="true"
                  className="pi pi-envelope text-primary"
                />
                Email Address
                <span aria-hidden="true" className="text-error">
                  *
                </span>
              </label>
              {errors.email && (
                <p
                  role="alert"
                  className="text-error text-xs sm:text-base font-content"
                >
                  {errors.email.message}
                </p>
              )}
            </div>
            <InputText
              id="feedback-email"
              disabled={loading}
              aria-invalid={!!errors.email}
              type="email"
              placeholder="e.g. johndoe@example.com"
              className={`p-4 bg-primary text-primary-content text-base md:text-lg rounded-3xl font-content placeholder:text-primary-content/50 border-2 ${
                errors.email ? "border-error" : "border-transparent"
              }`}
              {...register("email", {
                required: "Email is required",
                maxLength: {
                  value: 70,
                  message: "Email must be less than 70 characters",
                },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
            />
          </div>
          <hr className="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-base-300" />

          <div className="form-section w-full py-4 px-2 flex flex-col gap-y-2 sm:gap-y-3 rounded-xl">
            <div className="flex justify-between items-center">
              <label
                htmlFor="feedback-message"
                className="text-lg md:text-xl lg:text-2xl font-subHeading text-base-content flex items-center gap-x-3"
              >
                <span
                  aria-hidden="true"
                  className="pi pi-pencil text-primary"
                />
                Message
                <span aria-hidden="true" className="text-error">
                  *
                </span>
              </label>
              {errors.message && (
                <p
                  role="alert"
                  className="text-error text-xs sm:text-base font-content"
                >
                  {errors.message.message}
                </p>
              )}
            </div>

            <InputTextarea
              id="feedback-message"
              disabled={loading}
              aria-invalid={!!errors.message}
              className={`h-[150px] p-4 bg-primary text-primary-content text-base md:text-lg font-content rounded-3xl resize-none placeholder:text-primary-content/50 border-2 ${
                errors.message ? "border-error" : "border-transparent"
              }`}
              placeholder="To die for one’s people is a great sacrifice. To live for one’s people, an even greater sacrifice. I choose to live for my people."
              {...register("message", {
                required: "Message is required",
                minLength: {
                  value: 10,
                  message: "Message must be at least 10 characters",
                },
                maxLength: {
                  value: 500,
                  message: "Message must be less than 500 characters",
                },
              })}
            />
          </div>
          <hr className="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-base-300" />

          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-9999px",
              top: "-9999px",
              width: "1px",
              height: "1px",
              overflow: "hidden",
              opacity: 0,
              pointerEvents: "none",
            }}
          >
            <label htmlFor="feedback-website">Website</label>
            <input
              id="feedback-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("website")}
            />
            <label htmlFor="feedback-phone">Phone</label>
            <input
              id="feedback-phone"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("phone")}
            />
          </div>

          <div className="w-full p-2 flex flex-row-reverse items-center gap-2 sm:gap-3 rounded-xl">
            <Button
              type="submit"
              aria-label="Submit feedback form"
              disabled={loading || !isValid || submitted}
              className="flex-1 justify-center items-center gap-x-2 py-4 px-2 bg-neutral text-neutral-content font-content rounded-xl border-neutral"
            >
              <Send size={16} aria-hidden="true" />
              <span>{loading ? "Sending..." : "Send Message"}</span>
            </Button>
            <Button
              type="button"
              aria-label="Discard and reset form"
              disabled={loading}
              className="flex-1 justify-center items-center gap-x-2 py-4 px-2 bg-transparent text-base-content font-content rounded-xl border border-base-content/30"
              onClick={() => reset()}
            >
              <Trash size={16} aria-hidden="true" />
              <span>Cancel</span>
            </Button>
          </div>
        </form>
      </div>
    </Sidebar>
  );
};

export default FeedbackDialog;
