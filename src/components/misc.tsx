import React, { useState, useCallback, useContext, useRef } from "react";
import { FaRegUserCircle, FaUserLock, FaKey, FaEyeSlash, FaEye, FaUserTie, FaAd, FaPlusCircle, FaExclamationTriangle, FaUniversity, FaCloudUploadAlt } from "react-icons/fa";
import { useToasts } from "react-toast-notifications";
import { APPLICATION_CONTEXT } from "../lib";
import { University } from "../lib/university";

export function AddAdmin() {
    const ctx = useContext(APPLICATION_CONTEXT)

    const [state, setState] = useState({
        loading: false,
        password: '',
        passwordVerify: '',
        username: '',
        firstName: '',
        lastName: '',
        creatorPassword: '',
        showPassword: false,
        showVerifyPassword: false,
        showCreatorPassword: false
    })

    const { addToast } = useToasts()

    const onFirstNameChange = useCallback((e) => {
        setState({ ...state, firstName: e.target.value })
    }, [state])

    const onLastNameChange = useCallback((e) => {
        setState({ ...state, lastName: e.target.value })
    }, [state])

    const onUsernameChange = useCallback((e) => {
        setState({ ...state, username: e.target.value })
    }, [state])

    const onPasswordChange = useCallback((e) => {
        setState({ ...state, password: e.target.value })
    }, [state])

    const onVerifyPasswordChange = useCallback((e) => {
        setState({ ...state, passwordVerify: e.target.value })
    }, [state])

    const onCreatorPasswordChange = useCallback((e) => {
        setState({ ...state, creatorPassword: e.target.value })
    }, [state])


    const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setState({ ...state, loading: true })
            const { username, password, passwordVerify, firstName, lastName, creatorPassword } = state
            const user = await ctx.addAdmin({
                email: username,
                firstName,
                lastName,
                password,
                passwordVerify,
                creatorPassword
            })
            console.log(user, ':admin created')
            setState({ ...state, loading: false })
            addToast('Successfully created admin!', {
                appearance: 'success',
            })
        } catch (e) {
            setState({ ...state, loading: false })
            addToast(e.message || 'Failed to create admin!', {
                appearance: 'error',
            })
        }
    }, [state])

    const toggleShowPassword = useCallback(() => {
        setState((state) => ({ ...state, showPassword: !state.showPassword }))
    }, [state])
    const toggleShowVerifyPassword = useCallback(() => {
        setState((state) => ({ ...state, showVerifyPassword: !state.showVerifyPassword }))
    }, [state])
    const toggleShowCreatorPassword = useCallback(() => {
        setState((state) => ({ ...state, showCreatorPassword: !state.showCreatorPassword }))
    }, [state])

    return (
        <form className='card has-radius' onSubmit={onSubmit}>
            <div className='card-content'>
                <FaRegUserCircle className='is-size-1 mb-4' />
                <p className='help mb-2 is-uppercase has-text-weight-bold'>Enter New Admin Details</p>

                <div className='field is-horizontal'>
                    <div className='field-body'>
                        <div className='field'>
                            <div className='control has-icons-left'>
                                <input disabled={state.loading} required className='input' onChange={onFirstNameChange} value={state.firstName} type='text' placeholder='enter firstname...' />
                                <span className='icon is-small is-left'>
                                    <FaUserTie />
                                </span>
                            </div>
                        </div>
                        <div className='field'>
                            <div className='control has-icons-left'>
                                <input disabled={state.loading} required className='input' onChange={onLastNameChange} value={state.lastName} type='text' placeholder='enter lastname...' />
                                <span className='icon is-small is-left'>
                                    <FaUserTie />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='field'>
                    <div className='control has-icons-left'>
                        <input disabled={state.loading} required className='input' onChange={onUsernameChange} value={state.username} type='text' placeholder='enter username...' />
                        <span className='icon is-small is-left'>
                            <FaUserLock />
                        </span>
                    </div>
                </div>

                <div className='field is-horizontal'>
                    <div className='field-body'>
                        <div className='field has-addons'>
                            <div className='control has-icons-left is-expanded'>
                                <input disabled={state.loading} onChange={onPasswordChange} required value={state.password} placeholder='enter admin password' className='input' type={state.showPassword ? 'text' : 'password'} />
                                <span className='icon is-left is-small'><FaKey /></span>
                            </div>
                            <div className='control'>
                                <button className='button' type='button' onClick={toggleShowPassword}>{state.showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className='field has-addons'>
                            <div className='control has-icons-left is-expanded'>
                                <input disabled={state.loading} onChange={onVerifyPasswordChange} required value={state.passwordVerify} placeholder='verify password' className='input' type={state.showVerifyPassword ? 'text' : 'password'} />
                                <span className='icon is-left is-small'><FaKey /></span>
                            </div>
                            <div className='control'>
                                <button className='button' type='button' onClick={toggleShowVerifyPassword}>{state.showVerifyPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <p className='help is-danger is-uppercase mt-6 has-text-weight-bold'>Enter your admin password to confirm</p>
                <div className='field has-addons'>
                    <div className='control has-icons-left is-expanded'>
                        <input disabled={state.loading} onChange={onCreatorPasswordChange} required value={state.creatorPassword} placeholder='confirm admin password' className='input' type={state.showCreatorPassword ? 'text' : 'password'} />
                        <span className='icon is-left is-small'><FaKey /></span>
                    </div>
                    <div className='control'>
                        <button className='button' type='button' onClick={toggleShowCreatorPassword}>{state.showCreatorPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <button disabled={state.loading} type='submit' className={`button mt-4 is-info is-rounded ${state.loading ? 'is-loading' : ''}`}>
                    <FaPlusCircle /> &nbsp; Add Admin Account
                </button>
            </div>
        </form>

    )
}

export function AddUniversity() {
    const ctx = useContext(APPLICATION_CONTEXT)

    const [state, setState] = useState({
        loading: false,
        name: '',
        description: '',
        file: null as null | File
    })

    const { addToast } = useToasts()


    const onNameChange = useCallback((e) => {
        setState({ ...state, name: e.target.value })
    }, [state])

    const onDescriptionChange = useCallback((e) => {
        setState({ ...state, description: e.target.value })
    }, [state])

    const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, file: e.target?.files?.[0] || null })
    }, [state])

    const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setState({ ...state, loading: true })
            const { name, description } = state
            await University.createUniversity(ctx, {
                name: name.toLowerCase(),
                description,
            }, state!.file!)
            setState({ ...state, loading: false })
            addToast('Successfully created university!', {
                appearance: 'success',
            })
        } catch (e) {
            setState({ ...state, loading: false })
            addToast(e.message || 'Failed to create university!', {
                appearance: 'error',
            })
        }
    }, [state])

    return (
        <form className='card has-radius' onSubmit={onSubmit}>
            <div className='card-content'>
                <FaUniversity className='is-size-1 mb-2' />
                <p className='help mb-4 is-uppercase has-text-weight-bold'>Enter University Details</p>

                <div className='field'>
                    <div className='control has-icons-left'>
                        <input disabled={state.loading} required className='input' onChange={onNameChange} value={state.name} type='text' placeholder='University name' />
                        <span className='icon is-small is-left'>
                            <FaUserTie />
                        </span>
                    </div>
                </div>
                <div className='field'>
                    <div className='control'>
                        <textarea className='textarea' required disabled={state.loading} onChange={onDescriptionChange} value={state.description} placeholder='University description' />
                    </div>
                </div>

                <div className='field'>
                    <div className="file has-name is-fullwidth">
                        <label className="file-label">
                            <input disabled={state.loading} className="file-input" type="file" accept='image/*' name="resume" onChange={onFileChange} />
                            <span className="file-cta">
                                <span className="file-icon"><FaCloudUploadAlt /></span>
                                <span className="file-label">Choose Image</span>
                            </span>
                            <span className="file-name">
                                {state.file ? state.file.name : <i>no file selected</i>}
                            </span>
                        </label>
                    </div>
                </div>


                <button disabled={state.loading} type='submit' className={`button mt-4 is-info is-rounded ${state.loading ? 'is-loading' : ''}`}>
                    <FaPlusCircle /> &nbsp; Create University
                </button>
            </div>
        </form>

    )
}

export function EmptyComponent({ icon = <FaExclamationTriangle />, message = "No data available!", shadow = true }) {
    return (
        <div className={`card has-radius ${shadow ? '' : 'is-shadowless'}`}>
            <div className='card-content'>
                <span className='is-size-1 has-text-danger block'>{icon}</span>
                <p className='is-uppercase has-text-weight-bold is-size-7'>{message}</p>
            </div>
        </div>
    )
}