import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Message Editor button', () => {
	render(<App />);
	const linkElement = screen.getByText(/Message\sEditor/i);
	expect(linkElement).toBeInTheDocument();
});
