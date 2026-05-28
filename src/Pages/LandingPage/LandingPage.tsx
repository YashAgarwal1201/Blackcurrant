import { startTransition, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.scss";

const LandingPage = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  // Function to navigate to the home page
  const goToHomePage = () => {
    // Set animation state
    setAnimateOut(true);

    // Wait for animation to finish before navigating
    setTimeout(() => {
      startTransition(() => {
        navigate("/home");
      });
    }, 1000); // This duration should match the CSS animation duration
  };

  // Attach event listeners when the component mounts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!animateOut && (event.key === "Enter" || event.type === "click")) {
        // Trigger navigation only on click or Enter key
        goToHomePage();
      }
    };

    // Adding event listeners
    window.addEventListener("click", handleKeyPress);
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener("click", handleKeyPress);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [navigate, animateOut]);

  useEffect(() => {
    setShowContent(true);
  }, []);

  return (
    <div
      className={`landing-page backdrop-blur-md w-dvw h-dvh flex flex-col justify-center items-center text-base-content bg-base-content transition-all duration-1000 transform ${
        // showContent && !animateOut
        //   ? "translate-y-0 opacity-100"
        //   : "-translate-y-full opacity-0"
        showContent && !animateOut
          ? "translate-y-0 opacity-100"
          : animateOut
            ? "slide-down"
            : "-translate-y-full opacity-0"
      } text-center`}
    >
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading">Welcome</h1>
      <p className="text-lg md:text-xl lg:text-2xl font-content">
        Click anywhere or press any key to continue...
      </p>
    </div>
  );
};

export default LandingPage;
