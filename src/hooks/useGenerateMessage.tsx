import { useState } from 'react'
import { IMessageItem, ICondition, ITemplateItem, ConditionOps, ILooseObject } from '../models/models'

export const useGenerateMessage = (initValue: string) => {
	const [message, setMessage] = useState<string>(initValue)


	/**
	 * Generates the message
	 * @param template - message template
	 * @param vars - variables to use in template
	 * @param regexpForVars - reqular expression to replace the variables with their values
	 * @param toGenerateIf - indicates either should get if expression value or message value 
	 * @returns message or value of condition expression
	 */
	const generateMessage = (template: Array<IMessageItem | ICondition>, vars: ILooseObject, regexpForVars: RegExp, toGenerateIf?: boolean): string => {
		let msg = '';

		for (let i = 0; i < template.length; i++) {
			let item: ITemplateItem = template[i];

			if (item.condition) {
				msg += `${generateMessage(item.condition, vars, regexpForVars)}`

			} else if (!(item.op === ConditionOps.if && item.isStartOp) || (item.isStartOp && toGenerateIf)) {
				msg += `${getStringWithValues(item.text, vars, regexpForVars)}`
			} else {
				const thenIndex = template.findIndex(o => o.op === ConditionOps.then && o.isStartOp);
				const elseIndex = template.findIndex(o => o.op === ConditionOps.else && o.isStartOp);

				const ifGroup = template.slice(i, thenIndex);
				const thenGroup = template.slice(thenIndex, elseIndex);
				const elseGroup = template.slice(elseIndex);

				const ifMsg = getExpressionGroupValue(ifGroup, vars, regexpForVars, ConditionOps.if);
				const thenMsg = getExpressionGroupValue(thenGroup, vars, regexpForVars, ConditionOps.then);
				const elseMsg = getExpressionGroupValue(elseGroup, vars, regexpForVars, ConditionOps.else);

				const msgToAdd = ifMsg ? thenMsg : elseMsg;
				msg += msgToAdd;
				break;
			}
		}
		return msg;
	}

	const getExpressionGroupValue = (itemsGroup: Array<IMessageItem | ICondition>, vars: ILooseObject, regexpForVars: RegExp, groupType: string) => {
		return itemsGroup.length === 1
			? `${getStringWithValues(itemsGroup[0].text, vars, regexpForVars)}`
			: generateMessage(itemsGroup, vars, regexpForVars, groupType === ConditionOps.if);
	}

	const generateRegexpForVars = (vars: ILooseObject) => {
		return new RegExp(Object.keys(vars).map(item => `{${item}}`).join("|"), "gi");
	}

	const getStringWithValues = (str: string, vars: ILooseObject, regexpForVars: RegExp): string => {
		return str.replace(regexpForVars, function (matched) {
			return vars[matched.substring(1, matched.length - 1)];
		});
	}

	const generateMessageFromTemplate = (template: Array<IMessageItem | ICondition>, vars: ILooseObject) => {
		const regexpForVars = generateRegexpForVars(vars);
		const generatedMessage = generateMessage(template, vars, regexpForVars)
		return setMessage(generatedMessage)
	}

	return [message, generateMessageFromTemplate] as const
}