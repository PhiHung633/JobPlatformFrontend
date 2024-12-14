import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const DropdownItem = (props) => {
  const handleClick = (e) => {
    if (props.onClick) {
      e.preventDefault();
      props.onClick();
    }
  };

  return (
    <li
      className="dropdownItem flex items-center p-2 my-2 bg-gray-100 rounded transition duration-300 ease-in-out cursor-pointer hover:bg-green-50"
      onClick={handleClick}
    >
      {props.to ? (
        <Link to={props.to} className="flex w-full items-center">
          <FontAwesomeIcon
            className="icon text-green-500 w-5 mr-2 opacity-50 transition-all duration-500 ease"
            icon={props.icon}
          />
          <span
            className={`flex-1 text-left text-gray-800 font-semibold transition-colors duration-500 ease
                       hover:text-green-600 ${props.isActive ? "text-green-600" : "text-gray-800"}`}
          >
            {props.text}
          </span>
        </Link>
      ) : (
        <>
          <FontAwesomeIcon
            className="icon text-green-500 w-5 mr-2 opacity-50 transition-all duration-500 ease"
            icon={props.icon}
          />
          <span
            className={`flex-1 text-left text-gray-800 font-semibold transition-colors duration-500 ease
                       hover:text-green-600 ${props.isActive ? "text-green-600" : "text-gray-800"}`}
          >
            {props.text}
          </span>
        </>
      )}
    </li>
  );
};

export default DropdownItem;
