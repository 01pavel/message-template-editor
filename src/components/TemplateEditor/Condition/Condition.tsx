import React from 'react'
import { ICondition } from '../../../models/models'
import MessageTemplate from '../MessageTemplate/MessageTemplate'
import styles from './Condition.module.css'

interface ConditionProps {
	item: ICondition
	onChangeHandler(event: React.ChangeEvent<HTMLTextAreaElement>, fieldId: number): void
	onFocusItem(event: React.FocusEvent<HTMLTextAreaElement>, id: number): void
	onDeleteCondition(id: number): void
}

const Condition: React.FC<ConditionProps> = ({ item, onChangeHandler, onFocusItem, onDeleteCondition }) => {

	return (
		<div className={styles.conditionBlock}>
			<span className={styles.removeBtn}
				onClick={() => onDeleteCondition(item.id)}
				title="Delete"
			>&#x2715;</span>
			<MessageTemplate template={item.condition}
				onChangeHandler={onChangeHandler}
				onFocusItem={onFocusItem}
				onDeleteCondition={onDeleteCondition}
				isCondition
				isInCondition
			/>
		</div>
	)
}

export default Condition