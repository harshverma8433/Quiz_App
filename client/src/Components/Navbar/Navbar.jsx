import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
        <span className="self-center flex text-2xl gap-x-6 font-semibold whitespace-nowrap dark:text-white">
          KODEX
        </span>
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          {user ? (
            <h1 className="text-white text-xl dark:text-white">
              {user.isAdmin ? "Admin " : "User "} : {user.name}
            </h1>
          ) : (
            <Link to="/login" className="text-xl text-white dark:text-white hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
