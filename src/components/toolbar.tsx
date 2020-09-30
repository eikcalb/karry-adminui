import React, { useState, useContext } from 'react'
import { STYLES } from '../lib/theme'
import { FaCog, FaJoint, FaLayerGroup, FaSignOutAlt, FaUser, FaUserCircle, FaUserPlus, FaUsers } from "react-icons/fa";
import { AiOutlineNotification } from "react-icons/ai";
import { FiLogIn } from "react-icons/fi";
import { APPLICATION_CONTEXT, VIEW_CONTEXT } from '../lib';
import { Link, NavLink } from 'react-router-dom';
import { links } from "../lib/util";
import { link } from 'fs';


const AUTOHIDE_TIMEOUT = 20000
let timer: any
// TODO: build your own toolbar styling.

export default function Toolbar({ hidden = false }) {
    const [state, setState] = useState({ showMenu: false })
    const ctx = useContext(APPLICATION_CONTEXT)
    const vctx = useContext(VIEW_CONTEXT)

    return (
        <nav className={`navbar ${hidden ? 'is-hidden' : ''}`} role='navigation' style={STYLES.toolbar}>
            <div className='navbar-brand'>
                <div className='navbar-items is-flex-centered'>
                    {ctx.name}
                </div>
                <div role="button" className={`navbar-burger burger ${state.showMenu ? 'is-active' : ''}`} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" onClick={() => {
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
                </div>
            </div>
            <div className={`navbar-menu ${state.showMenu ? 'is-active' : ''}`} >
                {ctx.signedIn() && vctx.signedIn ? (
                    <>
                        <div className='navbar-start'>
                            <NavLink className='navbar-item is-tab is-uppercase' exact to={links.dashboard} activeClassName='is-active'>Dashboard</NavLink>
                            <NavLink className='navbar-item is-tab is-uppercase' to={links.posts} activeClassName='is-active'>Posts</NavLink>
                            <NavLink className='navbar-item is-tab is-uppercase' to={links.users} activeClassName='is-active'>Users</NavLink>
                        </div>
                        <div className='navbar-end'>
                            <div className='navbar-item has-dropdown is-hoverable'>
                                <div className='navbar-link is-flex-centered'>
                                    <FaUserCircle />&nbsp; {ctx.user?.firstName}
                                </div>
                                <div className='navbar-dropdown is-right'>
                                    <Link className='navbar-item is-flex-centered' to={links.settings}><FaCog />&nbsp; Settings</Link>
                                    <hr className='navbar-divider' />
                                    <Link className='navbar-item is-flex-centered' to={links.logout}><FaSignOutAlt />&nbsp; Logout</Link>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                        <div className='navbar-end'>
                            <div className='buttons navbar-item has-addons is-uppercase'>
                                <Link to={links.login} className='button is-info is-rounded is-small is-outlined'>
                                    <FiLogIn /> &nbsp; Login
                                </Link>
                                <Link to={links.register} className='button is-success is-rounded is-small'>
                                    <FaUserPlus /> &nbsp; Join
                                </Link>
                            </div>
                        </div>
                    )}
            </div>
        </nav>
    )
}