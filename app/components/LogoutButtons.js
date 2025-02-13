import { FaUserSlash } from "react-icons/fa"

export default function LogoutButtons({ Logout }) {

  return (
    <div className="flex space-x-4">
        <button className="bg-white p-2 rounded-lg flex items-center">
        <FaUserSlash onClick={ Logout } size={24} />‎ Log-Out
        </button>
    </div>
  );
}
