import React from 'react'
import styles from './VariableItem.module.css'

interface VariableItemProps {
	index: number
	variable: string
	onAddVariable(variable: string): void
}

const VariableItem: React.FC<VariableItemProps> = ({ index, variable, onAddVariable }) => {
	return (
		<span className={styles.variable}
			key={index}
			onClick={() => onAddVariable(variable)}
		>{`{${variable}}`}</span>
	)
}

export default VariableItem