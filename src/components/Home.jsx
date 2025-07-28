import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components';
import CategoryComponent from './CategoryComponent.jsx'
import Confetti from 'react-confetti'
import marhaba_logo from './marhaba_logo.png'
import mypic3 from './mypic3.png';
import PageWrapper from './PageWrapper.jsx';
import { motion } from 'framer-motion';
import ContentComingSoon from './ContentComingSoon.jsx';
import { toast } from 'react-toastify';
import ServicesCarousel from './ui/ServicesCarousel.jsx';
import MoreInfo from './MoreInfo.jsx';
import HamburgerMenu from './HamburgerMenu.jsx';
import './index.scss';
import { directors } from '../Team.js';
import TeamCarousel from './ui/TeamCarousel1.jsx';
import HamburgerList from './HamburgerList.jsx';
const Container = styled.section`
   width: 100%;
   height: 100vh;
   display: flex;
   justify-content: center;
   align-items: center;
   ${'' /* margin:
  0 auto; */}
   position: relative;
  
`;


const Overlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  height: 100vh;
  width: 100%;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  overflowY: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding-top: 6rem;
`;

const Navbar = styled.nav`
  max-height: 30vh;
  display: flex;
  align-items: center;
  justify-content: flex-end; 
  padding: 1rem 2rem;
  position: absolute;
  top: -2rem;
  right: 0;
  box-sizing: border-box;
   @media (max-width: 768px) {
  }
`;

 const AboutUs = styled.div`
  position: absolute;
  top: 50%;
  right: 4rem;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  z-index: 2;
`;
const Content = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 90vh;
  padding: 0 4rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    padding: 0 2rem;
    margin-top: -6rem;
  }

`;

const Left= styled.div`
  height: 100%;
  flex: 0.6;  
  display: flex;
  flex-direction: column;
    h1 {
    font-family: 'Cairo', sans-serif;
    font-size: 9rem;
    margin-bottom: 1rem;
    margin-top: -5rem;
    line-height: 1;
    color: #fff;
    @media (max-width: 768px) {
      font-size: 5rem;
      text-align: center;
      margin-top: -1rem;

    }
     @media (max-width: 415px) {
      font-size: 3.5rem;
      text-align: center;
      margin-top: -1rem;

    }
  }
    img {
    height: auto;   
    width: 250px;
    margin-left: -60px;
    @media (max-width: 768px) {
      width: 250px;
      margin: 0 auto;
      margin-bottom: -4rem;

    } 
     @media (max-width: 415px) {
      width: 180px;
      height: auto;
      margin: 0 auto;
      margin-bottom: -2rem;

    }     
  }
  p {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: rgba(255, 255, 255, 0.85);
    @media (max-width: 768px) {
      font-size: 1.5rem;
      text-align: center;
    } 
  }
  
 `;

 const Right= styled.div`
  height: 100%;
  flex: 0.4;  
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -4rem;
  @media (max-width: 768px) {
    margin-top: 0;
    width: 100%;
    overflow: hidden;
  }
 `;

const Countdown = styled.div`
  background: #ff9900;
  color: #fff;
  border-radius: 50%;
  padding: 2rem 3rem;
  text-align: center;
  min-width: 250px;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 1.2rem;
  z-index: 2;

  h3 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  .time {
    font-size: 2rem;
    display: flex;
    justify-content: space-around;
    gap: 0.5rem;
  }

  .label {
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    margin-top: 2rem;
  }
`;

const EmailForm = styled.form`
  display: flex;
  gap: 1rem;
   font-size: 1.6rem;
  input {
    padding: 1.8rem 2.5rem;
    letter-spacing: 0.2rem;
    border: none;
    border-radius: 5px;
    width: 60%;
    @media (max-width: 415px) {
      padding: 1rem;
    }
  }

  button {
    padding: 0.75rem 1.5rem;
    background-color: #ff9900;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    color: #fff;
    letter-spacing: 0.2rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    font-size: 1.7rem;
    input, button {
      width: 100%;
      height: auto;
    }
  }
`;



const FooterIcons = styled.div`
  display: flex;
  gap: 1rem;
  position: absolute;
  bottom: 2rem;
  left: 4rem;

  a {
    color: #fff;
    font-size: 4rem;
    transition: color 0.3s;
    display: block;
    border-radius: 50%;
    margin-right: 2rem;

        &:hover {
      color: #ffcc00;
    }
      &.facebook {
      color: #1877F2;
       }
   
  }

  @media (max-width: 768px) {
    position: static;
    justify-content: center;
    margin-top: 2rem;
  }
   @media (max-width: 415px) {
     a {
    color: #fff;
    font-size: 2.5rem;
    transition: color 0.3s;
    display: block;
    border-radius: 50%;
    margin-right: 2rem;

        &:hover {
      color: #ffcc00;
    }
      &.facebook {
      color: #1877F2;
       }
  }
   }
`;



const Home = () => {
   const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
   const [email, setEmail] = useState('');
   const [showHamburgerContainer, setShowHamburgerContainer] = useState(false);
   const [activeSection, setActiveSection] = useState(null); 
   const [showserviceCaroursel, setShowServiceCarousel] = useState(true);
   const [activeIndex, setActiveIndex] = useState(0);

   const hamburgerRef = useRef();

const handleAboutClick = () => {
  setShowAbout(prev => !prev);
  setShowMoreInfo(false);
};




  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 72); // +72 days

    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
  if (showHamburgerContainer) {
    setActiveSection('about');
  }
}, [showHamburgerContainer]);
   const leadFormHandler = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch('https://marhaba-backend.onrender.com/api/interest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const result = await res.json();
    console.log(result);

    if (res.ok) {
       toast.success('Thanks! You’ll be notified 🎉');

      setEmail('');
    } else {
      console.error(result);
     toast.error(result.message || 'Error saving email');

    }
  } catch (err) {
    console.error('Fetch error:', err);
    toast.error('Network error—please check your connection.');

  }
};

 const handleHamburgerToggle = () => {
  setShowServiceCarousel(prev => !prev);
  setShowHamburgerContainer(prev => !prev);
};
  
  return (
   <Container className="container">
      <Confetti numberOfPieces={60} />
        <PageWrapper>
  <style>
    {`
      @media screen and (max-width: 768px) {
        .hamburger-container {
          width: 100% !important;
        }
      }
    `}
  </style>

    ...
          <Overlay>
            

            <Navbar className="nav">
              <HamburgerMenu 
                 isOpen={showHamburgerContainer}
                setShowHamburgerContainer={setShowHamburgerContainer}
                onToggle={handleHamburgerToggle} 
              
                />
            </Navbar>

            
            <motion.div
  className='hamburger-container'
  ref={hamburgerRef}
  initial={{ x: '100%' }}
  animate={{ x: showHamburgerContainer ? '0%' : '100%' }}

  transition={{ duration: 0.4 }}
  style={{
    position: 'absolute',
    top: '.5rem',
    right: 0,
    height: '100vh',
    width: '50%',
    background: 'rgba(1, 1, 1, 0.3)',
    color: '#fff',
    overflowY: 'hidden',
    overflowX: 'hidden',
    padding: '3rem 0rem 1rem 1rem',  
    zIndex: 10,
    boxShadow: '-2px 0 6px rgba(0,0,0,0.8)',
    boxSizing: 'border-box',
    display: 'flex',
  }}
  
>
  <HamburgerList setActiveIndex={setActiveIndex} activeIndex={activeIndex}/>

  {activeIndex === 0 &&  showHamburgerContainer && (
  <motion.div
  className='about-container'
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
  style={{
     width: '90%',
     margin: '2rem auto',
    padding: '2rem',
    width: '70%',
    maxWidth: '700px',
    minHeight: '90vh', 
    borderRadius: '12px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    marginBottom: '2rem',
    overflowY: 'auto',
    overflowX: 'hidden'
  }}
>
  <div style={{ marginBottom: '2rem' }}>
    <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: '#fff' }}>About Marhaba Connect</h2>
    <p className="aboutusInfo" >
    We help brands scale smarter by streamlining operations and reducing overhead. From IT to recruitment, bookkeeping to ecommerce—our service suite adapts to your ambition, whether you’re starting out or expanding globally
    </p>
        <h2 style={{color: '#FF9900', fontSize: '1.5rem', marginBottom: '1rem'}}>🤝 Why Partner With Us?</h2>
<ul className="whyus" style={{listStyle: 'none', paddingLeft: '0', lineHeight: '1.8', color: '#fff', borderBottom: '2px solid #b58b4b'}}>
  <li style={{marginBottom: '0.5rem', marginLeft: '2.6rem', fontSize: '1.2rem'}}>✅ Experienced professionals across verticals</li>
  <li style={{marginBottom: '0.5rem', marginLeft: '2.6rem', fontSize: '1.2rem'}}>✅ Scalable solutions tailored to your business model</li>
  <li style={{marginBottom: '0.5rem', marginLeft: '2.6rem', fontSize: '1.2rem'}}>✅ Transparent processes and modern infrastructure</li>
</ul>
  </div>

 <TeamCarousel />

</motion.div>
  )}

  {activeIndex === 1 &&  showHamburgerContainer && (
    <motion.div
      className='form-container'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h1>Something in Mind, Leave a Message </h1>
      <form 
         style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        margin: '2rem auto',
        padding: '2rem',
        maxWidth: '500px',
        width: '100%',
        boxSizing: 'border-box',
      background: 'rgba(1, 1, 1, 0.5)',
        borderRadius: '8px',

  }}

      
      >
                                    <div className="form__group">
                                    <input type="text" 
                                      className="form__input" 
                                      placeholder="Full name" id="name" 
                                      required
                                       style={{
                                        padding: '1rem',
                                        fontSize: '1.2rem',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        background: 'transparent',
                                        color: '#fff',

    }}

                                       />
                                    <label for="name" className="form__label">Full name</label>
                                  </div>

                                <div className="form__group">
                                    <input type="email" 
                                        className="form__input" 
                                        placeholder="Email address"
                                        id="email"
                                        required 
                                        style={{
                                        padding: '1rem',
                                        fontSize: '1.2rem',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        background: 'transparent',
                                        color: '#fff',

    }}
                                        />
                                    <label for="email" className="form__label">Email address</label>
                                </div>
          <textarea
          placeholder="What would you like to know?"
          rows="3"
          required
          style={{
            padding: '1rem',
            fontSize: '1.2rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            resize: 'vertical',
            background:  'transparent',
            color: '#fff',

          }}
        />
        <button type="submit"   
          style={{
          padding: '1rem',
          background: '#ff9900',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 'bold',
          borderRadius: '4px',
          fontSize: '1.1rem'
    }}
      >
          Submit
        </button>
      </form>
    </motion.div>
  )}
</motion.div>


          <Content>
          {  showserviceCaroursel && <Left className="left">
            <img src={marhaba_logo} alt="Marhaba Logo"  />
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Opening Soon
         <br />
         in Emirates.
        </motion.h1>
        <small> </small>
        <motion.p
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Sign up to be notified!
        </motion.p>
        <EmailForm className="notify-form" onSubmit={leadFormHandler}> 
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit">Notify Me</button>
        </EmailForm>
      </Left>
          }
      <Right className="right">
        <ServicesCarousel 
        showserviceCaroursel={showserviceCaroursel} 
        setShowServiceCarousel={setShowServiceCarousel}
        />
      </Right>
        <FooterIcons>
        <a href="#"><i className="fab fa-facebook-f"></i></a>
        <a href="#"><i className="fab fa-instagram"></i></a>
      </FooterIcons>
      </Content> 
    </Overlay>
    
        </PageWrapper>
   </Container>
  )
}

export default Home