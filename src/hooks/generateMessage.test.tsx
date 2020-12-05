import { renderHook, act } from '@testing-library/react-hooks'
import { useGenerateMessage } from './useGenerateMessage';

test('generates message correctly when no variables are set', () => {
	const template = [
		{
			"id": 0,
			"text": "Hello {firstname}!\n\nI just went through your profile and I would love to join your network!\n"
		},
		{
			"id": 11,
			"condition": [
				{ "id": 12, "text": "{company}", "op": "if", "isStartOp": true },
				{ "id": 13, "text": "I know you work at {company}", "op": "then", "isStartOp": true },
				{
					"id": 16, "condition": [
						{ "id": 17, "text": "{position}", "op": "if", "isStartOp": true },
						{ "id": 18, "text": " as {position}", "op": "then", "isStartOp": true },
						{ "id": 19, "text": ", but what is your role?", "op": "else", "isStartOp": true }
					]
				},
				{ "id": 20, "text": ";)", "op": "then" },
				{ "id": 14, "text": "", "op": "else", "isStartOp": true }
			]
		},
		{ "id": 15, "text": "\n\nJake\nSoftware Developer\njakelennard911@gmail.com" }
	];
	const variables = {
		firstname: '',
		lastname: '',
		company: '',
		position: '',
	}

	const { result } = renderHook(() => useGenerateMessage(''))
	const [, generateMessageFromTemplate] = result.current;
	act(() => generateMessageFromTemplate(template, variables))

	expect(result.current[0]).toEqual(
		`Hello !

I just went through your profile and I would love to join your network!


Jake
Software Developer
jakelennard911@gmail.com`
	)
})

test('generates message correctly when any variables are filled', () => {
	const template = [
		{ "id": 0, "text": "Hi" },
		{
			"id": 26, "condition": [
				{ "id": 27, "text": "{firstname}", "op": "if", "isStartOp": true },
				{ "id": 28, "text": " {firstname}", "op": "then", "isStartOp": true },
				{
					"id": 36, "condition":
						[
							{ "id": 37, "text": "{lastname}", "op": "if", "isStartOp": true },
							{ "id": 38, "text": " {lastname}", "op": "then", "isStartOp": true },
							{ "id": 39, "text": "", "op": "else", "isStartOp": true }
						]
				},
				{ "id": 40, "text": "!", "op": "then" },
				{ "id": 29, "text": " ", "op": "else", "isStartOp": true },
				{
					"id": 31, "condition":
						[
							{ "id": 32, "text": "{lastname}", "op": "if", "isStartOp": true },
							{ "id": 33, "text": " {lastname}!", "op": "then", "isStartOp": true },
							{ "id": 34, "text": "  \nWhat is your name?", "op": "else", "isStartOp": true }
						]
				},
				{ "id": 35, "text": "", "op": "else" }
			]
		},
		{ "id": 30, "text": "\nWhat position at" },
		{
			"id": 41, "condition":
				[
					{ "id": 42, "text": "{company}", "op": "if", "isStartOp": true },
					{ "id": 43, "text": " the {company}", "op": "then", "isStartOp": true },
					{ "id": 44, "text": " our company", "op": "else", "isStartOp": true }
				]
		},
		{ "id": 45, "text": " do you want to take?" },
		{
			"id": 46, "condition":
				[
					{ "id": 47, "text": "{position}", "op": "if", "isStartOp": true },
					{ "id": 48, "text": " Or maybe you can be a {position}.", "op": "then", "isStartOp": true },
					{ "id": 49, "text": "OK", "op": "else", "isStartOp": true }
				]
		},
		{ "id": 50, "text": " Good Bye!" }
	];
	const variables = {
		firstname: 'David',
		lastname: 'Copperfield',
		company: 'Yandex',
		position: 'Web developer',
	}

	const { result } = renderHook(() => useGenerateMessage(''))
	const [, generateMessageFromTemplate] = result.current;
	act(() => generateMessageFromTemplate(template, variables))

	expect(result.current[0]).toEqual(
		`Hi David Copperfield!
What position at the Yandex do you want to take? Or maybe you can be a Web developer. Good Bye!`
	)
})
