import React from 'react'
import Styled from 'styled-components'

const CheckboxLabel = Styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  position: relative;
  padding-left: 30px;
  font-size: 15px;
  color: #9e9ea0;
`

const CheckboxInputStyle = Styled.input`
  margin-right: 8px;
  position: absolute;
  top: 2px;
  left: 3px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #dadadd;
  outline: none;
  cursor: pointer;
  background-color: #fafafc;

  &:checked {
    background-color: #4a79f7;
    border: 2px solid #fff;
  }
  &::before {
    content: "";
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24'%3E %3Cpath d='M15.88 8.29L10 14.17l-1.88-1.88a.996.996 0 1 0-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7a.996.996 0 0 0 0-1.41c-.39-.39-1.03-.39-1.42 0z' fill='%23fff'/%3E %3C/svg%3E");
    position: absolute;
    height: 18px;
    width: 18px;
    top: 0px;
    right: -4px;
  }
`

interface CheckboxProps {
  onChange: () => void
  checked: boolean
  label: string
}

const Checkbox: React.FC<CheckboxProps> = ({ onChange, checked, label }) => (
  <CheckboxLabel>
    <CheckboxInputStyle
      className="checkbox checkbox-sm"
      type="checkbox"
      onChange={onChange}
      checked={checked}
    />
    {label}
  </CheckboxLabel>
)

export default Checkbox
