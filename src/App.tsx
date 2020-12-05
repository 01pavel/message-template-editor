import React, { useState } from 'react'
import styles from './App.module.css'
import TemplateEditor from './components/TemplateEditor/TemplateEditor'
import { arrVarNames, template } from './constants'
import { IMessageItem, ICondition } from './models/models'

const App: React.FC = () => {
	const [isEditorOpened, setIsEditorOpened] = useState<boolean>(false);

	// async function to save template to the localStorage
	const callbackSave = async (currentTemplate: Array<IMessageItem | ICondition>): Promise<boolean | string> => {
		return new Promise<boolean | string>((resolve, reject) => {
			setTimeout(() => {
				localStorage.setItem('template', JSON.stringify(currentTemplate));
				return resolve(true)
			}, 1000)
		})
	}

	return (
		<div className={styles.App}>
			{isEditorOpened ? <TemplateEditor arrVarNames={arrVarNames}
				template={template}
				callbackSave={callbackSave}
				setIsEditorOpened={setIsEditorOpened}
			/> : <button className={styles.editorBtn}
				onClick={() => setIsEditorOpened(true)}
			>Message Editor</button>}
		</div>
	)
}

export default App
