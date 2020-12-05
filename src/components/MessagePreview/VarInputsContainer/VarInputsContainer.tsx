import React from 'react'
import VariableInput from './VariableInput/VariableInput'
import { ILooseObject } from '../../../models/models'
import styles from './VarInputsContainer.module.css'

interface VarInputsContainerProps {
	variables: ILooseObject
	onChangeVariableValue(value: string, variable: string): void
}


const VarInputsContainer: React.FC<VarInputsContainerProps> = ({ variables, onChangeVariableValue }) => {

	return (
		<div className={styles.varsContainer}>
			{Object.keys(variables).map((variable, index) => (
				<VariableInput key={index}
					text={variables[variable]}
					variable={variable}
					onChangeVariableValue={onChangeVariableValue}
				/>
			))}
		</div>
	)
}

export default VarInputsContainer;