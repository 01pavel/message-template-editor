export const arrVarNames: string[] = localStorage.arrVarNames ?
	JSON.parse(localStorage.arrVarNames) :
	['firstname', 'lastname', 'company', 'position']

export const template = localStorage.template ? JSON.parse(localStorage.template) : null
