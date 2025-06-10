const Card = ({ title, children }) => (
  <div className="bg-white shadow-md rounded p-4 mb-4 dark:bg-gray-800">
    {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
    {children}
  </div>
);
export default Card;
