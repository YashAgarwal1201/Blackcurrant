import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Sidebar } from "primereact/sidebar";
import { useForm } from "react-hook-form";
import useNavStore from "../../Services/Stores/navStore";
import { Send, Trash } from "lucide-react";

const FeedbackDialog = () => {
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

  const onSubmit = (data) => {
    console.log("Form submitted with data:", data);
    // Handle form submission logic here
    reset(); // Reset the form after submission if needed
    closeFeedbackDialog(); // Close the dialog
  };

  const onDiscard = () => {
    reset(); // Reset the form
  };

  return (
    <Sidebar
      visible={isFeedbackDialogOpen}
      onHide={() => closeFeedbackDialog()}
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
                <small className="text-red-500">{errors.name.message}</small>
              )}
            </div>
            <InputText
              className="font-content p-4 text-base sm:text-lg text-color5 bg-color2 rounded-3xl"
              {...register("name", { required: "Name is required" })}
            />
          </div>
          <div className="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-color2" />

          <div className="form-section w-full py-4 px-2 flex flex-col gap-y-2 sm:gap-y-3 rounded-xl">
            <div className="flex justify-between items-center">
              <label className="font-subHeading text-lg sm:text-xl">
                <span className="pi pi-envelope mr-4"></span>E-mail
              </label>
              {errors.email && (
                <small className="text-red-500">{errors.email.message}</small>
              )}
            </div>
            <InputText
              className="font-content p-4 text-base sm:text-lg text-color5 bg-color2 rounded-3xl"
              type="email"
              {...register("email", {
                required: "E-mail is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
          </div>
          <div className="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-color2" />

          <div className="form-section w-full py-4 px-2 flex flex-col gap-y-2 sm:gap-y-3 rounded-xl">
            <div className="flex justify-between items-center">
              <label className="font-subHeading text-lg sm:text-xl">
                <span className="pi pi-pencil mr-4"></span>Message
              </label>
              {errors.message && (
                <small className="text-red-500">{errors.message.message}</small>
              )}
            </div>
            <InputTextarea
              className="h-[150px] p-4 font-content text-base sm:text-lg text-color5 bg-color2 rounded-3xl resize-none"
              maxLength={300}
              {...register("message", { required: "Message is required" })}
            />
          </div>
          <div className="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-color2" />

          <div className="w-full py-0 flex flex-row items-center flex-1 gap-y-2 sm:gap-y-3 rounded-xl">
            <Button
              type="button"
              onClick={() => onDiscard()}
              className=" flex-1 flex justify-center items-center gap-x-2 py-4 px-2 bg-color4 font-subHeading text-color1 rounded-xl"
            >
              <Trash size={16} />
              <span>Discard</span>
            </Button>

            <Button
              type="submit"
              disabled={!isValid}
              className=" flex-1 flex justify-center items-center gap-x-2 py-4 px-2 bg-color4 font-subHeading text-color1 rounded-xl"
            >
              <Send size={16} />
              <span>Send</span>
            </Button>
          </div>
        </form>
      </div>
    </Sidebar>
  );
};

export default FeedbackDialog;
