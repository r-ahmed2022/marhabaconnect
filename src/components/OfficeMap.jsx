import React from "react";
import styled from "styled-components";
import { FaMapMarkerAlt } from "react-icons/fa";

const AddressWrapper = styled.address`
  font-style: normal;
  background-color: transparent;
  padding: 1.5rem 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  max-width: 480px;
  margin: 2rem auto;
  text-align: center;
  line-height: 1.6;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    padding: 1.25rem;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    font-size: 0.9rem;
  }

  @media (max-width: 355px) {
    font-size: 0.85rem;
    padding: 0.85rem;
  }
`;

const Heading = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #FDFDFD;
`;

const Line = styled.div`
  margin-bottom: 0.4rem;
  font-size: 1.2rem;
`;

const MapContainer = styled.div`
  margin-top: 1.5rem;
  position: relative;
  border-radius: 8px;
  background-color: transparent;
  overflow: hidden;
`;

const MapFrame = styled.iframe`
  width: 100%;
  height: 300px;
  border: 0;
  display: block;
`;

const FallbackImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
`;

const OfficeMap = () => {
  const API_KEY = 'AIzaSyCvhhIlmyu--wgwmaU6ZlDR2FxFzNfh5F0'
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=Sharjah+Publishing+City+Free+Zone,UAE&zoom=16`;

  return (
    <AddressWrapper>
      <Heading>Office Location</Heading>
      <FaMapMarkerAlt size={24} color="#007bff" style={{ marginBottom: "0.5rem" }} />
      <Line>Business Centre</Line>
      <Line>Sharjah Publishing City</Line>
      <Line>Sharjah, United Arab Emirates</Line>

      <MapContainer>
        <MapFrame src={mapEmbedUrl} allowFullScreen loading="lazy" />
      </MapContainer>
    </AddressWrapper>
  );
};

export default OfficeMap;