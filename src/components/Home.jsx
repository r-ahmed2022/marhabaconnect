import React, {useState, useEffect} from 'react'
import styled from 'styled-components';
import CategoryComponent from './CategoryComponent.jsx'
import Confetti from 'react-confetti'
import marhaba_logo from './marhaba_logo.png'
import mypic3 from './mypic3.png';
import PageWrapper from './PageWrapper.jsx';
import { motion } from 'framer-motion';
import ContentComingSoon from './ContentComingSoon.jsx';
import TeamCarousel from './ui/TeamCarousel.jsx';
import { toast } from 'react-toastify';

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
  top: 0
  right: 0;
  left: 0;
  bottom: 0;
  min-height: 100vh;
  width: 100%;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 80vh;
  padding: 4rem;
  display: flex;

  
`;

const Left= styled.div`
  width: 60%;
  height: 100%;
  flex: 0.6;  
  display: flex;
  flex-direction: column;
    h1 {
    font-family: 'Cairo', sans-serif;
    font-size: 9rem;
    margin-bottom: 1rem;
    line-height: 1.2;
    color: #fff;
  }

  p {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: rgba(255, 255, 255, 0.85);
  }
 `;

 const Right= styled.div`
  height: 100%;
  flex: 0.4;  
  display: flex;
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

const Navbar = styled.nav`
    width: 100%;
    height: 30vh;
    position: relative;
    padding: .5rem 1rem;
    align-items: flex-start;
    border: black;
    margin-left: -20px;
    padding: 0 ;
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
`;



const Home = () => {
   const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
   const [email, setEmail] = useState('');



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
   const leadFormHandler = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch('https://marhaba-backend.onrender.com/api/interest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const result = await res.json();

    if (res.ok) {
       toast.success('Thanks! You’ll be notified 🎉');

      setEmail('');
    } else {
      console.error(result);
     toast.error('Something went wrong. Please try again.');

    }
  } catch (err) {
    console.error('Fetch error:', err);
    toast.error('Network error—please check your connection.');

  }
};
  
  return (
   <Container className="container">
     
        <PageWrapper>
        <Confetti numberOfPieces={40} />
          <Overlay>
            <Navbar className="nav">
              <img src={marhaba_logo} alt="Marhaba Logo" style={{ width: '250px', height: 'auto' }} />
            </Navbar>
          <Content>
            <Left className="left">
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
        <EmailForm onSubmit={leadFormHandler}> 
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
      <Right className="right">
        <TeamCarousel />
      </Right>
      </Content>
    </Overlay>
      <FooterIcons>
        <a href="#"><i className="fab fa-facebook-f"></i></a>
        <a href="#"><i className="fab fa-instagram"></i></a>
      </FooterIcons>
        </PageWrapper>
   </Container>
  )
}

export default Home