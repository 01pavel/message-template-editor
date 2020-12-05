import React, { ReactNode, useRef, useEffect } from "react";
import { createPortal } from 'react-dom';
import styles from './Modal.module.css'

interface modalProps {
	children?: ReactNode
	togglePreviewModal(): void
}

const modalRoot = document.querySelector('#root') as HTMLElement;

const Modal: React.FC<modalProps> = ({ children, togglePreviewModal }) => {
	const el = useRef(document.createElement('div'));
	const modalRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		modalRoot!.appendChild(el.current);
		modalRef.current.focus()
		return () => void modalRoot!.removeChild(el.current);
	}, [])

	const closeModalOnEsc = (e: React.KeyboardEvent) => {
		if (e.key !== 'Escape') {
			return
		}
		togglePreviewModal()
	}

	return createPortal(<div tabIndex={0}
		className={styles.modal}
		onClick={togglePreviewModal}
		onKeyDown={(e: React.KeyboardEvent) => closeModalOnEsc(e)}
		ref={modalRef}
	>
		<div className={styles.modalContainer}
			onClick={(e: React.MouseEvent) => { e.stopPropagation() }}
		>
			{children}
			<button className={styles.closeBtn}
				onClick={() => togglePreviewModal()}
			>Close</button>
		</div>
	</div>, el.current)
};

export default Modal
