import styled from 'styled-components';
import bgImage from './uae-4.avif';



const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: url(${bgImage}) no-repeat center center fixed;
  background-size: cover;
  position: relative;
  font-family: 'Cairo', sans-serif;
  color: #FfF;
  display: flex;
  align-items: center;
  justify-content: center;
`;


export default PageWrapper;