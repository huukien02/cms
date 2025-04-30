import React, { ReactNode } from "react";
import styled from "styled-components";

const Card = styled.div`
  background-color: #fff;
  border-radius: 5px;
  padding: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

interface CardComponentProps {
  children: ReactNode;
}

const CardWithShadowComponent: React.FC<CardComponentProps> = ({ children }) => {
  return <Card>{children}</Card>;
};

export default CardWithShadowComponent;
