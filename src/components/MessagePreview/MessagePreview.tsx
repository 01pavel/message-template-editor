import React, { useEffect, useState, useCallback } from "react";
import { IMessageItem, ICondition, ILooseObject } from '../../models/models'
import styles from './MessagePreview.module.css'
import VarInputsContainer from './VarInputsContainer/VarInputsContainer';
import { useGenerateMessage } from '../../hooks/useGenerateMessage'

interface MessagePreviewProps {
	arrVarNames: string[]
	template: Array<IMessageItem | ICondition>
}

export interface IVariableObj {
	name: string
	value: string
}

/**
 * Converts variables to the format {'name': 'value'}
 * @param vars 
 * @returns object of the format {'name': 'value'}
 */
const mapVars = (vars: string[]) => vars.reduce((resObj: ILooseObject, item: string) => {
	resObj[item] = ''
	return resObj
}, {})

const MessagePreview: React.FC<MessagePreviewProps> = ({ arrVarNames, template }) => {
	// using custom hook to generate the final message
	const [message, generateMessage] = useGenerateMessage('');
	const [variables, setVariables] = useState<ILooseObject>(() => mapVars(arrVarNames))

	const changeVariableValue = useCallback(
		(value: string, variable: string): void => {
			setVariables(prev => ({
				...prev,
				[variable]: value
			}))
		},
		[],
	)

	useEffect(() => {
		generateMessage(template, variables)
	}, [variables])

	return (
		<div className={styles.previewContainer}>
			<h3 className={styles.previewHeader}>Message Preview</h3>
			<pre className={styles.messagePreview}>{message}</pre>
			<VarInputsContainer variables={variables}
				onChangeVariableValue={changeVariableValue}
			/>
		</div>
	)
}

export default MessagePreview