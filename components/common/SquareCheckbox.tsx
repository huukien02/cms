import React from 'react'
import Styled from 'styled-components'

const CheckboxLabel = Styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  position: relative;
  font-size: 15px;
  color: #9e9ea0;
  vertical-align: middle;
`

const CheckboxInputStyle = Styled.input`
  margin-right: 8px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 28px;
  height: 28px;
  border: 2px solid #dadadd;
  outline: none;
  cursor: pointer;
  background-color: #fafafc;

  &:checked {
    background-color: #4a79f7;
    border: 2px solid #fff;
  }

`

interface CheckboxProps {
  onChange: () => void
  checked: boolean
  label?: string
}

const Checkbox: React.FC<CheckboxProps> = ({ onChange, checked, label }) => (
  <CheckboxLabel>
    <CheckboxInputStyle
      type="checkbox"
      className="checkbox checkbox-sm"
      onChange={onChange}
      checked={checked}
    />
  </CheckboxLabel>
)

export default Checkbox
