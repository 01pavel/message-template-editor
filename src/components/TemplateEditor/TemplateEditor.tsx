import React, { useRef, useState, useCallback, useEffect } from 'react'
import VariablesContainer from './VariablesContainer/VariablesContainer'
import MessageTemplate from './MessageTemplate/MessageTemplate'
import styles from './TemplateEditor.module.css';
import { IMessageItem, ICondition, MessageItemModel, ConditionItemModel } from '../../models/models'
import ControlsPanel from '../ControlsPanel/ControlsPanel'

interface TemplateEditorProps {
	arrVarNames: string[]
	template?: Array<IMessageItem | ICondition>
	callbackSave(currentTemplate: Array<IMessageItem | ICondition>): Promise<boolean | string>
	setIsEditorOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ arrVarNames, template, callbackSave, setIsEditorOpened }) => {
	const [currentTemplate, setCurrentTemplate] = useState<Array<IMessageItem | ICondition>>(template || [new MessageItemModel()]);
	const [focusedItemId, setFocusedItem] = useState<number | any>(null);
	let focusedMessageRef = useRef<HTMLTextAreaElement | null>(null);
	useEffect(() => {
		MessageItemModel.setIdCounter(getMaxId(0, currentTemplate))
	}, [])

	/**
	 * Finds the biggest of items id to generate the new ones
	 * @param from - what number is max
	 * @param templ - template
	 * @returns the biggest of the created message items id
	 */
	const getMaxId = (from: number = 0, templ: Array<IMessageItem | ICondition>): number => {
		let maxId = from;
		for (let i = 0; i < templ.length; i++) {
			let curItem: any = templ[i];
			if (curItem.id > maxId) {
				maxId = curItem.id
			}
			if (curItem.condition) {
				maxId = getMaxId(maxId, curItem.condition)
			}
		}
		return maxId
	}

	/**
	 * Finds the message item in the currentTemplate structure
	 * @param itemId
	 * @parem fields - the reference to the message items array where we're finding
	 * @returns the reference to the message items array in currentTemplate and index of the found item.
	 * so that later we can update either the message item object or the array in the structure (add or remove condition block)
	 */
	const findItem = useCallback((itemId: number, fields: Array<IMessageItem | ICondition>): [any[], number] => {
		let foundSource, index;

		for (let i = 0; i < fields.length; i++) {
			const currentField: any = fields[i];

			if (currentField.id === itemId) {
				foundSource = fields
				index = i
			} else if (currentField.condition) {
				[foundSource, index] = findItem(itemId, currentField.condition)
			}

			if (foundSource) break
		}

		return [foundSource, index]
	}, [])

	/**
	 * Adds variable to the message item field
	 * @param variable - variable name
	 */
	const addVariable = (variable: string) => {
		let itemToUpdate
		if (focusedItemId) {
			let [sourceForUpdate, index] = findItem(focusedItemId, currentTemplate);
			itemToUpdate = sourceForUpdate[index];
		} else {
			itemToUpdate = currentTemplate[0];
		}
		let cursorPosition = focusedMessageRef.current?.selectionStart || 0;
		const firstPart = `${itemToUpdate?.text.substr(0, cursorPosition)}{${variable}}`

		updateMessageItem(itemToUpdate, {
			id: focusedItemId || itemToUpdate.id,
			text: `${firstPart}${itemToUpdate.text.substr(cursorPosition)}`
		})

		if (focusedMessageRef.current) {
			focusedMessageRef.current.focus()

			// to set the caret to the position right after the added variable 
			setTimeout(() => {
				focusedMessageRef.current.selectionStart = focusedMessageRef.current.selectionEnd = firstPart.length
			});
		}
	}

	const addConditionBlock = () => {
		if (!focusedMessageRef.current) return
		let cursorPosition = focusedMessageRef.current!.selectionStart;
		let [sourceForUpdate, index] = findItem(focusedItemId, currentTemplate);
		const itemForUpdate = sourceForUpdate[index];

		sourceForUpdate.splice(
			index + 1, 0,
			new ConditionItemModel(),
			new MessageItemModel(itemForUpdate.text.substr(cursorPosition), itemForUpdate.op)
		)
		itemForUpdate.text = itemForUpdate.text.substr(0, cursorPosition)
		setCurrentTemplate(currentTemplate.slice())
		focusedMessageRef.current?.focus()
	}

	const updateMessageItem = useCallback((foundItem: IMessageItem, updateObj: IMessageItem): void => {
		if (foundItem) {
			Object.assign(foundItem, updateObj)
			setCurrentTemplate(currentTemplate.slice())
		}
	}, [currentTemplate])

	const changeHandler = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>, fieldId: number) => {
		const [sourceForUpdate, index] = findItem(fieldId, currentTemplate);

		updateMessageItem(sourceForUpdate[index], { id: fieldId, text: event.target.value })
	}, [focusedItemId])

	const setFocusedItemHandler = useCallback((event: React.FocusEvent<HTMLTextAreaElement>, id: number) => {
		focusedMessageRef.current = event.target;
		setFocusedItem(id)
	}, [])

	const deleteCondition = useCallback((id: number): void => {
		const [sourceForUpdate, index] = findItem(id, currentTemplate);
		const messageBeforeCondition = sourceForUpdate[index - 1];
		const { text } = sourceForUpdate[index + 1];
		messageBeforeCondition.text += text;
		sourceForUpdate.splice(index, 2);
		setCurrentTemplate(currentTemplate.slice())
		focusedMessageRef.current?.focus()
	}, [currentTemplate])

	return (
		<div className={styles.editorContainer}>
			<h3 className={styles.editorHeader}>Message Template Editor</h3>
			<div className={styles.addContainer}>
				<VariablesContainer arrVarNames={arrVarNames}
					onAddVariable={addVariable}
				/>
				<button className={styles.addConditionBtn}
					onClick={addConditionBlock}
				>[IF-THEN-ELSE]</button>
			</div>
			<div className={styles.templateContent}>
				<MessageTemplate template={currentTemplate}
					onChangeHandler={changeHandler}
					onFocusItem={setFocusedItemHandler}
					onDeleteCondition={deleteCondition}
					isCondition={false}
					isInCondition={false}
				/>
			</div>
			<ControlsPanel callbackSave={callbackSave}
				template={currentTemplate}
				setIsEditorOpened={setIsEditorOpened}
			/>
		</div >
	)
}

export default TemplateEditor