const Badge = ({ text, color = 'bg-blue-500' }) => (
  <span className={`text-white px-2 py-1 rounded text-sm ${color}`}>
    {text}
  </span>
);
export default Badge;
