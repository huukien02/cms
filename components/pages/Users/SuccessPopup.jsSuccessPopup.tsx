import React from 'react';
import Styled from 'styled-components';

const PopupContainer = Styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;

interface SuccessPopupProps {
  onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ onClose }) => {
  return (
    <PopupContainer>
      <h2>Success!</h2>
      <p>Your information has been updated successfully.</p>
      <button onClick={onClose}>Close</button>
    </PopupContainer>
  );
};

export default SuccessPopup;
