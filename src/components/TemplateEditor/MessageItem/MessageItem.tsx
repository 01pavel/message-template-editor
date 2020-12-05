import React from 'react'
import styles from './MessageItem.module.css'

type MessageItemProp = {
	onChangeHandler(event: React.ChangeEvent<HTMLTextAreaElement>, fieldId: number): void
	message: string
	fieldId: number
	onFocusItem(event: React.FocusEvent<HTMLTextAreaElement>, id: number): void
	isInCondition: boolean
}

const MessageItem: React.FC<MessageItemProp> = ({ message, onChangeHandler, fieldId, onFocusItem, isInCondition }) => {

	return (
		<textarea
			className={styles.msgItem}
			cols={60}
			rows={isInCondition ? 2 : 4}
			onChange={(e) => onChangeHandler(e, fieldId)}
			value={message}
			onFocus={(e) => onFocusItem(e, fieldId)}
		/>
	)
}

export default React.memo(MessageItem)