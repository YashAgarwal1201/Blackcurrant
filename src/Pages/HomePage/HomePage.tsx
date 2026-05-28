import Layout from "../../Layout/Layout";
import "./HomePage.scss";
import { Link } from "react-router-dom";
import { NAV_OPTIONS } from "../../Services/Data/Constants";
import { Button } from "primereact/button";
import { Menu } from "lucide-react";
import useNavStore from "../../Services/Stores/navStore";

const HomePage = () => {
  const { toggleSideMenu } = useNavStore();

  return (
    <Layout>
      <div className="custom-scrollbar w-full h-full p-2 md:p-3 lg:p-4 pb-20 md:pb-4 flex flex-col gap-y-4 sm:gap-y-6 md:gap-y-10 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl xs:text-3xl mdl:text-4xl text-base-content font-heading select-none">
            Welcome to Blackcurrant
          </h1>

          <Button
            aria-label="Open side menu"
            onClick={toggleSideMenu}
            text
            className="border-none! flex items-center justify-center p-3 rounded-2xl"
          >
            <Menu size={16} className="text-neutral-content" />
          </Button>
        </div>
        <div className="w-full flex-1 flex justify-center items-center">
          <div className="w-full sm:w-[75%] md:w-[560px] lg:w-[640px] aspect-square grid grid-cols-2 gap-4">
            {NAV_OPTIONS?.map((value, key) => (
              <Link
                key={key}
                to={`${value?.link}`}
                className="bg-primary flex justify-center items-center cursor-pointer rounded-3xl not-italic p-3"
              >
                <span className="font-subHeading text-center text-primary-content text-xl xs:text-2xl mdl:text-3xl">
                  {value?.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
