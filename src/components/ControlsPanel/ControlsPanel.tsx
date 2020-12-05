import React, { useState } from 'react'
import styles from './ControlsPanel.module.css';
import Modal from '../Modal/Modal'
import MessagePreview from '../MessagePreview/MessagePreview'
import { arrVarNames } from '../../constants';
import { IMessageItem, ICondition } from '../../models/models'

interface TemplateEditorProps {
	callbackSave(currentTemplate: Array<IMessageItem | ICondition>): Promise<boolean | string>
	template?: Array<IMessageItem | ICondition>
	setIsEditorOpened(open: boolean): void
}

const ControlsPanel: React.FC<TemplateEditorProps> = ({ callbackSave, template, setIsEditorOpened }) => {
	const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [showIsSaved, setShowIsSaved] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	const togglePreviewModal = (): void => {
		setIsPreviewOpen((prevState: boolean): boolean => {
			return !prevState
		})
	}

	const saveTemplate = async (): Promise<boolean | string> => {
		setIsSaving(true)
		try {
			const response = await callbackSave(template)
			setIsSaving(false)
			setShowIsSaved(true)
			setTimeout(() => {
				setShowIsSaved(false)
			}, 1500);
			return response
		} catch (error) {
			if (error) {
				return error
				setError(error)
			}
			setIsSaving(false)
		}
	}

	return (
		<>
			<div className={styles.controlBtnsContainer}>
				<button onClick={togglePreviewModal}>Preview</button>
				<button onClick={saveTemplate}>Save</button>
				<button onClick={() => setIsEditorOpened(false)}>Close</button>
				<div className={styles.statusContainer}>
					{isSaving && <span>saving...</span>}
					{showIsSaved && <span>successfully saved!</span>}
					{error && <span>{error}</span>}
				</div>
			</div>
			{isPreviewOpen && <Modal togglePreviewModal={togglePreviewModal}>
				<MessagePreview arrVarNames={arrVarNames} template={template} />
			</Modal>}
		</>
	)
}

export default ControlsPanel