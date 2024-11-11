const InputField = ({ label, name, value, onChange, required, placeholder }) => (
    <div>
        <label className="block text-gray-600 mb-1">
            {label}{required && <span className="text-red-500">*</span>}
        </label>
        <input
            type="text"
            name={name}  // Added name attribute
            value={value}  // Added value attribute
            onChange={onChange}  // Added onChange event handler
            placeholder={placeholder}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
        />
    </div>
);

export default InputField;
