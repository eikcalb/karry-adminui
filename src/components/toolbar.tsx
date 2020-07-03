import React, { useState, useContext } from 'react'
import { STYLES } from '../lib/theme'
import { FaJoint, FaUser } from "react-icons/fa";
import { APPLICATION_CONTEXT, VIEW_CONTEXT } from '../lib';


const AUTOHIDE_TIMEOUT = 5000
let timer: any
// TODO: build your own toolbar styling.

export default function Toolbar() {
    const [state, setState] = useState({ showMenu: false })
    const ctx = useContext(APPLICATION_CONTEXT)
    const vctx = useContext(VIEW_CONTEXT)

    return (
        <nav className='navbar' role='navigation' style={STYLES.toolbar}>
            <div className='navbar-brand'>
                <a className='navbar-item' href='#'>
                    OWA
                </a>
                <a role="button" className={`navbar-burger burger ${state.showMenu ? 'is-active' : ''}`} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" onClick={() => {
                    // Clear the existing timer for closing menu and then hide/show the menu
                    clearTimeout(timer)
                    if (state.showMenu) {
                        setState({ ...state, showMenu: false })
                    } else {
                        setState({ ...state, showMenu: true })
                        timer = setTimeout(() => {
                            setState({ ...state, showMenu: false })
                        }, AUTOHIDE_TIMEOUT)
                    }
                }}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>
            <div className={`navbar-menu ${state.showMenu ? 'is-active' : ''}`} >
                <div className='navbar-start'>
                    <div className='field has-addons is-uppercase'>
                        <p className='control'>
                            <button className='button'>
                                <FaUser /> Login
                            </button>
                        </p>
                        <p className='control'>
                            <button className='button'>
                                <FaUser /> Join
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </nav>
    )
}