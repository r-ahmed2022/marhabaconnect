import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Portfolio } from '../data';
import './CategoryStyling.css'


const CategoryComponent = () => {
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);

  return (
    <div className="category-wrapper">
      {Portfolio.map((category) => (
        <div
          key={category.id}
          className="category-item"
          onMouseEnter={() => setHoveredCategoryId(category.id)}
          onMouseLeave={() => setHoveredCategoryId(null)}
        >
          <div className="category-box">{category.name}</div>

          <AnimatePresence>
            {hoveredCategoryId === category.id && (
              <motion.div
                className="child-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <ul className="activity-list">
                  {category.activities.map((activity, index) => (
                    <li key={index} className="activity-item">
                      {activity}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default CategoryComponent;
