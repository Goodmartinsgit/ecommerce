const Input = ({ type, value, labelFor, placehold, name, onChange }) => {
  return (
    <div className="flexCol gap-3 w-full">
      <p className="text-black w-full font-semibold flex justify-start items-start">
        {labelFor}
      </p>
      <input
        className="w-full p-3 rounded-md outline-none border border-gray-400 bg-white text-gray-700 focus:ring-2 focus:ring-black"
        type={type}
        value={value}
        name={name}
        id={name}
        placeholder={placehold}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;