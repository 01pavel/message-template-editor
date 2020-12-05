import React from 'react'
import { IMessageItem, ICondition } from '../../../models/models'
import MessageItem from '../MessageItem/MessageItem'
import Condition from '../Condition/Condition'
import styles from './MessageTemplate.module.css'

interface MessageTemplateProps {
	template?: Array<IMessageItem | ICondition>
	onChangeHandler(event: React.ChangeEvent<HTMLTextAreaElement>, fieldId: number): void
	onFocusItem(event: React.FocusEvent<HTMLTextAreaElement>, id: number): void
	onDeleteCondition?(id: number): void
	isCondition: boolean
	isInCondition: boolean
}

const MessageTemplate: React.FC<MessageTemplateProps> = ({ template, onChangeHandler, onFocusItem, onDeleteCondition, isCondition, isInCondition }) => {

	return (<div className={isCondition ? styles.conditionContainer : null}>
		{template!.map((item: any) => {
			if (item.condition) {
				return <Condition key={item.id}
					item={item}
					onChangeHandler={onChangeHandler}
					onFocusItem={onFocusItem}
					onDeleteCondition={onDeleteCondition}
				/>
			} else {
				return (
					<div key={item.id}>
						{
							isInCondition && item.isStartOp
								? <span className={styles.opLabel}>{item.op}</span>
								: null
						}
						<MessageItem fieldId={item.id}
							message={item.text!}
							onChangeHandler={onChangeHandler}
							onFocusItem={onFocusItem}
							isInCondition={isInCondition}
						/>
					</div>
				)
			}
		})}
	</div>)
}

export default MessageTemplate