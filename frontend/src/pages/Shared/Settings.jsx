import { useNavigate } from 'react-router-dom';
import GoBackButton from "../../components/buttons/Backbutton";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="absolute mt-[7rem] ml-[17.5rem] h-[85%] w-[84.5%] bg-[#ffffff] overflow-y-auto scrollbar-thin">
        {/* <div className="fixed translate-y-[-2.5rem]">
          <GoBackButton />
        </div> */}

        {/* Content that might overflow */}
        <div className="mt-12">
          {/* Add your content here */}
          <div style={{ height: '2000px' }}> {/* Just a placeholder to demonstrate scrolling */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
