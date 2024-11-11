const Step = ({ step, label, active, isLast }) => {
    return (
      <div className="relative flex items-start gap-3 z-10">
  
        <div
          className={`flex justify-center items-center w-8 h-8 rounded-full border-2 transition-all duration-300 mb-5 
              ${active ? "bg-green-600 border-green-600" : "bg-gray-300 border-gray-300"}
            `}
          style={{ paddingTop: "10px", paddingBottom: "10px" }}
        >
          <span className={`font-bold ${active ? "text-green-800" : "text-gray-800"}`}>
            {step}
          </span>
          {!isLast && (
            <div className="absolute left-4 top-9 h-8 w-[2px] bg-gray-300"></div>
          )}
        </div>
        <div className="flex flex-col">
          <span
            className={`font-semibold transition-all ${active ? "text-green-400" : "text-white"}`}
          >
            {label}
          </span>
        </div>
      </div>
    );
  };
  
  export default Step;
  