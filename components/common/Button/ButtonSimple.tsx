import React, { ReactNode, ButtonHTMLAttributes } from "react";
import styled from "styled-components";

const Bubbon = styled.button`
  color: #4e4e52;
  width: 100%;
  height: 30px;
  border-radius: 8px;
  background-color: #fff;
  border: 0;
  border: solid 1px #a1a1a2;
  width: auto;
  padding: 0 20px;
  &:hover {
    color: #fff;
    background-color: #4a79f7;
  }
`;

interface CommonSubmitButtonSimpleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const CommonSubmitButtonSimple: React.FC<CommonSubmitButtonSimpleProps> = ({ children, ...props }) => {
  return <Bubbon {...props}>{children}</Bubbon>;
};

export default CommonSubmitButtonSimple;
