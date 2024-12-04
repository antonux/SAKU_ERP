import { useNavigate } from 'react-router-dom';
import GoBackButton from "../../components/buttons/Backbutton";

const Request = () => {
  const navigate = useNavigate();
  return (
    <div className="p-10 mt-[6rem] w-full bg-white text-black">
			<div className="w-full">
				<h1 className='text-2xl'>Request</h1>
			</div>
    </div>
  );
};

export default Request;
