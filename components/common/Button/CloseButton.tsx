import React from 'react';
import Styled from 'styled-components';

const CloseButtonWrapper = Styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  // position: relative;
  width: 30px;
  height: 30px;
  padding: 0;
  float: right;
  margin: 0;
  position: fixed;
  right: 10px;
  top: 10px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    height: 2px;
    background-color: #9e9ea0;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`;

interface CloseButtonProps {
  onClick: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => {
  return (
    <CloseButtonWrapper onClick={onClick}></CloseButtonWrapper>
  );
};

export default CloseButton;
