import React, { memo } from 'react'

interface VariableInputProps {
	text: string
	variable: string
	onChangeVariableValue(value: string, variable: string): void
}

const VariableInput: React.FC<VariableInputProps> = ({ text, variable, onChangeVariableValue }) => {
	return (
		<label>{variable}
			<input type="text"
				value={text}
				onChange={(e) => onChangeVariableValue(e.target.value, variable)}
			/>
		</label>
	)
}

export default memo(VariableInput)