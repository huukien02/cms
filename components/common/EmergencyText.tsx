import React, { ReactNode, CSSProperties } from "react";
import styled from "styled-components";

const EmergencyP = styled.p`
  background-color: #fdf0f0;
  padding: 16px 24px;
  color: #f74a4a;
  font-size: 13px;
  margin-bottom: 20px;
  text-align: left;
`;

interface EmergencyTextProps {
  children: ReactNode;
  style?: CSSProperties;
}

const EmergencyText: React.FC<EmergencyTextProps> = ({
  children,
  style,
}) => {
  return <EmergencyP style={style}>{children}</EmergencyP>;
};

export default EmergencyText;
