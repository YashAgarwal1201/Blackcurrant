import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Sidebar } from "primereact/sidebar";
import { useForm } from "react-hook-form";

const FeedbackDialog = ({ showFeedbackDialog, setShowFeedbackDialog }) => {
  const {
    handleSubmit,
    reset,
    watch,
    register,
    formState: { errors, isValid },
    setValue,
  } = useForm({
    defaultValues: { name: "", email: "", message: "" },
    mode: "onChange",
  });

  const onSubmit = (data) => {
    console.log("Form submitted with data:", data);
    // Handle form submission logic here
    reset(); // Reset the form after submission if needed
    setShowFeedbackDialog(false); // Close the dialog
  };

  const onDiscard = () => {
    reset(); // Reset the form
    setShowFeedbackDialog(false); // Close the dialog
  };

  return (
    <Sidebar
      visible={showFeedbackDialog}
      onHide={() => setShowFeedbackDialog(false)}
      position="right"
      header={
        <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl text-color5">
          Have some suggestions?
        </h2>
      }
      className="side-menu w-full md:w-1/3 max-w-[768px] bg-color1 rounded-none md:rounded-l-2xl"
      closeIcon={<span className="pi pi-times text-color5"></span>}
      maskClassName="backdrop-blur"
    >
      <div className="w-full bg-color4 rounded-3xl py-4 px-4">
        <form className="feedback-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-section w-full py-4 px-2 flex flex-col gap-y-2 sm:gap-y-3 rounded-xl">
            <label className="font-subHeading text-lg sm:text-xl">
              <span className="pi pi-id-card mr-4"></span>Name
            </label>
            <InputText
              className="font-content p-4 text-base sm:text-lg text-color5 bg-color2 rounded-3xl"
              {...register("name", { required: "Name is required" })}
            />
          </div>
          <div className="mx-2 my-1 p-0 max-w-full h-[1.5px] bg-color2" />

          <div className="form-section w-full py-4 px-2 flex flex-col gap-y-2 sm:gap-y-3 rounded-xl">
            <label className="font-subHeading text-lg sm:text-xl">
              <span className="pi pi-envelope mr-4"></span>E-mail
            </label>
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
            <label className="font-subHeading text-lg sm:text-xl">
              <span className="pi pi-pencil mr-4"></span>Message
            </label>
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
              // icon="pi pi-send"
              // label="Send"
              onClick={() => onDiscard()}
              className=" flex-1 justify-center items-center py-4 px-2 bg-color4 font-subHeading text-color1 rounded-xl"
            >
              <span className="pi pi-trash mr-4"></span>
              <span>Discard</span>
            </Button>

            <Button
              type="submit"
              // icon="pi pi-send"
              // label="Send"
              disabled={!isValid}
              className=" flex-1 justify-center items-center py-4 px-2 bg-color4 font-subHeading text-color1 rounded-xl"
            >
              <span className="pi pi-send mr-4"></span>
              <span>Send</span>
            </Button>
          </div>
        </form>
      </div>
    </Sidebar>
  );
};

export default FeedbackDialog;
