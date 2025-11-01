import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Sidebar } from "primereact/sidebar";
import { SubmitHandler, useForm } from "react-hook-form";
import useNavStore from "../../Services/Stores/navStore";
import { Send, Trash } from "lucide-react";
import { useState } from "react";
import useToastStore from "../../Services/Stores/toastMessageStore";
import { FeedbackFormType } from "../../Services/typesAndInterfaces";

const FeedbackDialog = () => {
  const showToast = useToastStore((state) => state.showToast);
  const { isFeedbackDialogOpen, closeFeedbackDialog } = useNavStore();
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: { name: "", email: "", message: "" },
    mode: "onChange",
  });

  const [loader, setLoader] = useState(false);

  const sanitizeInput = (input: string) => {
    const sanitized = input.replace(/[<>"'`;&]/g, "");
    return sanitized.trim();
  };

  const onSubmit: SubmitHandler<FeedbackFormType> = async (data) => {
    try {
      setLoader(true);
      const sanitizedData = {
        name: sanitizeInput(data.name),
        email: sanitizeInput(data.email),
        message: sanitizeInput(data.message),
      };

      const response = await fetch(
        import.meta.env.VITE_BASE_API_URL +
          "api-services/blackcurrant/feedback-form-data",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sanitizedData),
        }
      );

      await response.json();

      if (response.ok) {
        showToast("success", "Success", "Data submitted successfully");
        setLoader(false);
        reset();
        closeFeedbackDialog();
      } else {
        showToast(
          "error",
          "Error",
          "Error submitting form. Please check console for more details."
        );
        setLoader(false);
        console.error(response);
      }
    } catch (error) {
      setLoader(false);
      showToast(
        "error",
        "Error",
        "Unexpected error occurred. Please check console for more details."
      );
      console.error("Error:", error);
    }
  };

  const onDiscard = () => {
    reset();
    closeFeedbackDialog();
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
      className="side-menu !w-full md:!w-[768px] rounded-none md:!rounded-l-xl bg-color1"
      closeIcon={<span className="pi pi-times text-color5"></span>}
      maskClassName="backdrop-blur"
    >
      <div className="w-full bg-color4 rounded-3xl py-4 px-4">
        <form className="feedback-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-section w-full py-4 px-2 flex flex-col gap-y-2 sm:gap-y-3 rounded-xl">
            <div className="flex justify-between items-center">
              <label className="font-subHeading text-lg sm:text-xl">
                <span className="pi pi-id-card mr-4"></span>Name
              </label>
              {errors.name && (
                <small className="text-red-900 font-content">
                  {errors.name.message}
                </small>
              )}
            </div>
            <InputText
              disabled={loader}
              className="disabled:opacity-70 font-content p-4 text-base sm:text-lg text-color5 bg-color2 rounded-3xl"
              {...register("name", { required: "Name is required" })}
              maxLength={100}
              placeholder="Jhone Doe"
            />
          </div>
          <div className="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-color2" />

          <div className="form-section w-full py-4 px-2 flex flex-col gap-y-2 sm:gap-y-3 rounded-xl">
            <div className="flex justify-between items-center">
              <label className="font-subHeading text-lg sm:text-xl">
                <span className="pi pi-envelope mr-4"></span>E-mail
              </label>
              {errors.email && (
                <small className="text-red-900 font-content">
                  {errors.email.message}
                </small>
              )}
            </div>
            <InputText
              disabled={loader}
              className="disabled:opacity-70 font-content p-4 text-base sm:text-lg text-color5 bg-color2 rounded-3xl"
              type="email"
              {...register("email", {
                required: "E-mail is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              placeholder="test@example.com"
              maxLength={75}
            />
          </div>
          <div className="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-color2" />

          <div className="form-section w-full py-4 px-2 flex flex-col gap-y-2 sm:gap-y-3 rounded-xl">
            <div className="flex justify-between items-center">
              <label className="font-subHeading text-lg sm:text-xl">
                <span className="pi pi-pencil mr-4"></span>Message
              </label>
              {errors.message && (
                <small className="text-red-900 font-content">
                  {errors.message.message}
                </small>
              )}
            </div>
            <InputTextarea
              disabled={loader}
              className="disabled:opacity-70 h-40 p-4 font-content text-base sm:text-lg text-color5 bg-color2 rounded-3xl resize-none"
              maxLength={1000}
              {...register("message", { required: "Message is required" })}
              placeholder="To die for one’s people is a great sacrifice. To live for one’s people, an even greater sacrifice. I choose to live for my people."
            />
          </div>
          <div className="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-color2" />

          <div className="w-full py-0 flex flex-row items-center flex-1 gap-y-2 sm:gap-y-3 rounded-xl">
            <Button
              disabled={loader}
              type="button"
              title="Discard message"
              onClick={() => onDiscard()}
              className="disabled:opacity-70 flex-1 flex justify-center items-center gap-x-2 py-4 px-2 bg-color4 font-subHeading text-color1 rounded-xl"
            >
              <Trash size={16} />
              <span>Discard</span>
            </Button>

            <Button
              loading={loader}
              type="submit"
              title="Submit your message"
              disabled={!isValid || loader}
              className="disabled:opacity-70 flex-1 flex justify-center items-center gap-x-2 py-4 px-2 bg-color4 font-subHeading text-color1 rounded-xl"
            >
              <Send size={16} />
              <span>{loader ? "Sending..." : "Send"}</span>
            </Button>
          </div>
        </form>
      </div>
    </Sidebar>
  );
};

export default FeedbackDialog;
