// enum that is used to mark message items as the condition operators inside the [IF-THEN-ELSE] block
export enum ConditionOps {
	if = 'if',
	then = 'then',
	else = 'else'
}

interface IBasicTemplateItem {
	id: number
}

export interface IMessageItem extends IBasicTemplateItem {
	text?: string
	op?: ConditionOps
	isStartOp?: boolean
	condition?: never
}

export interface ICondition extends IBasicTemplateItem {
	condition: ITemplateItem[],
	text?: never
	op?: never
	isStartOp?: never
}

export type ITemplateItem = IMessageItem | ICondition;

// used to add the unique id to the message items
let idCounter: number = 0;

// the smallest part of the meassage template
export class MessageItemModel implements IMessageItem {
	readonly id: number
	text: string = ''
	op?: ConditionOps
	isStartOp: boolean

	constructor(text?: string | null, op?: ConditionOps, isStartOp?: boolean) {
		this.id = ++idCounter
		if (text) {
			this.text = text
		}
		if (op) {
			this.op = op
		}
		if (isStartOp) {
			this.isStartOp = isStartOp
		}
	}

	public static setIdCounter(id: number) {
		idCounter = id
	}
}

// represents the conditional block [IF-THEN-ELSE]
export class ConditionItemModel implements ICondition {
	readonly id: number
	condition: Array<IMessageItem | ICondition>

	constructor() {
		this.id = ++idCounter
		this.condition = [
			new MessageItemModel(null, ConditionOps.if, true),
			new MessageItemModel(null, ConditionOps.then, true),
			new MessageItemModel(null, ConditionOps.else, true)]
	}
}

export interface ILooseObject {
	[key: string]: any
}