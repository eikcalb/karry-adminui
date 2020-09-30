import React, { useContext, useState, useCallback } from 'react';
import { FaExclamationCircle, FaUserCircle, FaUser, FaKey, FaEyeSlash, FaEye } from 'react-icons/fa';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { BodyFragment } from '../components/body';
import { AuthHandler } from '../components/guard';
import { VIEW_CONTEXT, APPLICATION_CONTEXT } from '../lib';
import { links } from '../lib/util';
import { useToasts } from 'react-toast-notifications';

export function Login() {
    const ctx = useContext(APPLICATION_CONTEXT)
    const viewCTX = useContext(VIEW_CONTEXT)
    const [state, setState] = useState({
        showPassword: false,
        username: '',
        password: '',
        loading: false
    })
    const { addToast } = useToasts()

    const onUsernameChange = useCallback((e) => {
        setState({ ...state, username: e.target.value })
    }, [state])

    const onPasswordChange = useCallback((e) => {
        setState({ ...state, password: e.target.value })
    }, [state])

    const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setState({ ...state, loading: true })
            const user = await ctx.login(state.username, state.password)
            
            viewCTX.setSignedInUser(user)
            setState({ ...state, loading: false })
            addToast('Login successful!', {
                appearance: 'success',
            })
        } catch (e) {
            setState({ ...state, loading: false })
            addToast(e.message || 'Failed to login!', {
                appearance: 'error',
            })
        }
    }, [state])

    const toggleShowPassword = useCallback(() => {
        setState((state) => ({ ...state, showPassword: !state.showPassword }))
    }, [state])

    return (
        <AuthHandler>
            <BodyFragment>
                <div className='container is-paddingless is-fluid is-flex is-fullheight is-flex-centered has-background-info-light'>
                    <div className='columns section is-mobile is-multiline is-vcentered is-flex-centered' style={{ flex: 1 }}>
                        <div className='column is-10-tablet is-12-mobile'>
                            <div className='card has-radius'>
                                <div className='card-content section'>
                                    <div className='has-text-weight-bold'>
                                        <FaUserCircle className='is-size-1' />
                                        <form className='px-6 pt-4' onSubmit={onSubmit}>
                                            <div className='field'>
                                                <p className='help is-uppercase mb-2'>Enter your admin credentials</p>
                                                <div className='control has-icons-left'>
                                                    <input disabled={state.loading} required value={state.username} onChange={onUsernameChange} placeholder='enter your username...' className='input' type='text' />
                                                    <span className='icon is-left is-small'><FaUser /></span>
                                                </div>
                                            </div>
                                            <div className='field has-addons'>
                                                <div className='control has-icons-left is-expanded'>
                                                    <input disabled={state.loading} required value={state.password} onChange={onPasswordChange} placeholder='enter your password...' className='input' type={state.showPassword ? 'text' : 'password'} />
                                                    <span className='icon is-left is-small'><FaKey /></span>
                                                </div>
                                                <div className='control'>
                                                    <button className='button' type='button' onClick={toggleShowPassword}>{state.showPassword ? <FaEyeSlash /> : <FaEye />}
                                                    </button>
                                                </div>
                                            </div>
                                            <button disabled={state.loading} type='submit' className={`button is-info is-rounded ${state.loading ? 'is-loading' : ''}`}>
                                                <FiLogIn /> &nbsp; Login
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BodyFragment>
        </AuthHandler>
    )
}