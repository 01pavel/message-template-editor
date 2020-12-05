import React from 'react'
import VariableItem from './VariableItem/VariableItem'
import styles from './VariablesContainer.module.css'

interface VariablesContainerProps {
	arrVarNames: string[]
	onAddVariable(variable: string): void
}

const VariablesContainer: React.FC<VariablesContainerProps> = ({ arrVarNames, onAddVariable }) => {
	return (
		<div className={styles.varsContainer}>
			{arrVarNames.map((variable, index) => (
				<VariableItem variable={variable}
					index={index}
					key={index}
					onAddVariable={onAddVariable}
				/>
			))}
		</div>
	)
}

export default VariablesContainer