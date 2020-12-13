import { cpuUsage } from "process";
import React, { useEffect } from "react";

export function Modal({ active = false, children, isCard = false, onDismiss = () => { } }) {
    useEffect(() => {
        const old = window.document.onkeydown
        window.document.onkeydown = (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation()
                onDismiss()
            }
        }

        return () => { window.document.onkeydown = old }
    })

    return (
        <div className={`modal ${active ? 'is-active' : ''}`} >
            <div onClick={onDismiss} className='modal-background'></div>
            <div className='modal-content'>{children}</div>
            {isCard ? null : <button onClick={onDismiss} className='modal-close is-large' aria-label='close'></button>}
        </div>
    )
}

export function ModalCard({ header, children, onDismiss, footer = <></> }) {
    return (
        <div className='modal-card'>
            <div className='modal-card-head'>
                <p className='modal-card-title'>{header}</p>
                <button onClick={onDismiss} className='delete' aria-label='close'></button>
            </div>
            <div className='modal-card-body'>{children}</div>
            <div className='modal-card-foot'>{footer}</div>
        </div>
    )
}