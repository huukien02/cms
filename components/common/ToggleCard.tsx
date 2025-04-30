import React, { ReactNode } from "react";
import styled from "styled-components";

const ToggleCard = styled.div`
  background-color: #fff;
  border-radius: 5px;
  padding: 1rem;
  max-width: 0;
  transition: max-width 0.3s ease-in-out;
  position: absolute;
  top: 0;
  height: calc(100vh - 218px);

  &.open {
    max-width: 515px;
  }

  &.closed {
    max-width: 0;
  }
`;

interface CardComponentProps {
  children: ReactNode;
  className?: string;
}

const ToggleCardComponent: React.FC<CardComponentProps> = ({ children, className }) => {
  return <ToggleCard className={className}>{children}</ToggleCard>;
};

export default ToggleCardComponent;
