import React from 'react'
import { motion, useInView } from "framer-motion";

const AboutUs = () => {
    const itemStyle = {
    marginBottom: '0.5rem',
    marginLeft: '2.6rem',
    fontSize: '1.2rem',
    textAlign: 'justify'
   };
 const listContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.25
    }
  }
};

const listItem = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};


  return (
    <div  className='aboutus'>
    <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: '#FF9900' }}>About Marhaba Connect</h2>
    <p className="aboutusInfo" >
    We help brands scale smarter by streamlining operations and reducing overhead. From IT to recruitment, bookkeeping to ecommerce—our service suite adapts to your ambition, whether you’re starting out or expanding globally
    </p>
        <h2 style={{color: '#FF9900', fontSize: '1.5rem', marginBottom: '1rem'}}>🤝 Why Partner With Us?</h2>

<motion.ul
  className="whyus"
  style={{
    listStyle: 'none',
    paddingLeft: '0',
    lineHeight: '1.8',
    color: '#fff',
    borderBottom: '2px solid #b58b4b'
  }}
  variants={listContainer}
  initial="hidden"
  animate="show"
>
  <motion.li variants={listItem} style={itemStyle}>
    ✅ Experienced professionals across verticals
  </motion.li>
  <motion.li variants={listItem} style={itemStyle}>
    ✅ Scalable solutions tailored to your business model
  </motion.li>
  <motion.li variants={listItem} style={itemStyle}>
    ✅ Transparent processes and modern infrastructure
  </motion.li>
</motion.ul>


  </div>
  )
}
export default AboutUs;
