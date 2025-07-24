import React, {useState, useEffect} from 'react'
import styled from 'styled-components';
import { Portfolio} from '../data.js'
import { directors } from '../Team.js';
import Clock from './Clock'
import CategoryComponent from './CategoryComponent'
import Confetti from 'react-confetti'
import marhaba_logo from './marhaba_logo.png'

const Container = styled.section`
   width: 100%;
   height: 100vh;
   display: flex;
   justify-content: center;
   align-items: center;
   margin: 0 auto;
  `
const Left = styled.div`
   height: 100%;
   flex: 0.4;
   display: flex;
   flex-direction: column;
   justify-content: start;
   align-items: start;
   position: relative;
   background-color: #F9F6F1;
`
const Navbar = styled.nav`
    width: 100%;
    height: auto;
    display: flex;
    background-color: #ccc;
    justify-content: space-between;
    padding: .5rem 1rem;
    align-items: start;
`

const About = styled.div`
    width: 100%;
    height: calc(100vh - 20px);
    display: flex;
    flex-direction: column;
    justify-content: center;
     align-items: center;
`

const Image = styled.img.attrs((props) => ({
  src: props.src,
}))`
  position: absolute;
  width: ${(props) => props.$width || '100%'};
  height: ${(props) => props.$height || 'auto'};
  object-fit: ${(props) => props.$fit || 'contain'};
  border-radius: 50%;
`;

const Right = styled.div`
   height: 100%;
   flex: 0.6;
   position: relative;
   perspective: 1000px;
   overflow: auto;
   &:hover .front {
    transform: rotateY(-90deg);
  }
  &:hover .back {
    transform: rotateY(0deg);
  }
  display: flex;
  justify-content: start;
  align-items: end;
  overflow: hidden;
  .back {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    h1 {
        font-size: 1.5rem;
        color: #F5C967;
    }
  }
`

const PartnerDiv = styled.div`
 position: absolute;
 top: 1rem;
 left: 2rem;
 width: 20%;
 height: 20%;
 background-color:  #90a955;
 display: flex;
 flex-direction: column;
 justify-content:center;
 align-items: center;
 border-radius: 50%;
`

const XADDiv = styled.div`
 position: absolute;
 top: 1rem;
 right: 2rem;
 width: 20%;
 height: 20%;
 background-color:  #90a955;
 display: flex;
 flex-direction: column;
 justify-content:center;
 align-items: center;
 border-radius: 50%;
`

const PartnerDivHeading = styled.h1`
 color: #132a13;
 font-size: 2rem;
 text-align: center;
`
const XadDivHeading = styled.h1`
 color: #132a13;
 font-size: 2rem;
text-align: center;
`

const SpanMessage = styled.span`
 color: #343131;
 font-size: 1.2rem;
 font-weight: 500;
 font-style: italic;
`
const Backside = styled.div` 
   position: absolute;
   top: 0;
   bottom: 0;
   right: 0;
   width: 100%; 
   right: 0;
   transform: rotateY(180deg);
   background-color: #fffbfb;
   transform-origin: right center;
   transition: transform 3s cubic-bezier(0.4, 0, 0.2, 1);
   cursor: pointer;
   color: #132a13;
   `;
   const Frontside = styled.div` 
   position: absolute;
   top: 0;
   bottom: 0;
   width: 100%; 
   height: 100%;
   overflow: hidden;
   background-color: #F9F6F1;
   transform-origin: left center;
   transition: transform 3s cubic-bezier(0.4, 0, 0.2, 1);
   cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    @media(max-width: 768px) {
    }
      `;
    const Arrow = styled.a`
    color: #90a955;
    display: block;
    font-size: 4rem;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: end;
    animation: grow 2s ease-in-out infinite;
    @keyframes grow {
        100% {
            transform: scale(.8);
        }
    }
       `
const Home = () => {
   const [productsToShow, setProductsToShow] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
          setProductsToShow((prevCount) => {
            if (prevCount < Portfolio.length - 1) {
              return prevCount + 1;
            } else {
              clearInterval(interval); 
              return prevCount;
            }
          });
        }, 2000); 
      }, []);;

  return (
   <Container className="container">
    <Confetti numberOfPieces={40} />
    <Left className="left">
      <Navbar className="nav">
       <span style={{ 'font-family': 'Roboto', fontSize: '1.3rem', fontWeight: '700' }}>
          <i className="fa-solid fa-mobile-retro mail-icon" alt="Mobile#" />
          +91-9149510000
        </span>
        <span style={{ 'font-family': 'Roboto', fontSize: '1.3rem', fontWeight: '700' }}>
          <i
            className="fa-solid fa-envelope mail-icon"
            alt="Mail#"
            onClick={() => window.location = 'mailto:meesamriyaz@gmail.com'}
            style={{ cursor: 'pointer' }}
          />
          enquiry@marhabaconnect.ae
        </span>
      
      </Navbar>
      <About>
         <Clock />
      </About>
      
       

    </Left>
    <Right className="right">
         
       <Backside className="back">
       <div className="ownerinfo">
          <a href="#" >About Us</a>
        </div>
       <h1  style={{color: '#132a13'}}>Beyond Boundaries: Complete Business Solutions Provider</h1>
        <CategoryComponent />
       </Backside>
       <Frontside className="front">
       
  
       <Image  src={marhaba_logo}  
               $width="70%"
               $height="auto"
               $fit="contain"
        />
      
       </Frontside>
      
          
    </Right>
   
   </Container>
  )
}

export default Home