const HamburgerList = ({ activeIndex, setActiveIndex }) => {
  const items = ["About Us", "Let's Discuss"];
  const toggleIndex = activeIndex === 0 ? 1 : 0;

  return (
    <ul className="hamburger-list">
      <li
        className="hamburger-item active"
        onClick={() => setActiveIndex(toggleIndex)}
      >
        {items[toggleIndex]}
      </li>
    </ul>
  );
};
export default HamburgerList;