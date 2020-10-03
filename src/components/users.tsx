import moment from "moment";
import React, { useCallback, useContext, useState } from "react";
import { FaCheck, FaChevronLeft, FaClock, FaEnvelope, FaGlobe, FaPencilAlt, FaPhoneAlt, FaPhoneSquareAlt, FaPlusCircle, FaTrash, FaUser, FaUserAltSlash, FaUserCircle, FaUserSlash } from "react-icons/fa";
import { useToasts } from "react-toast-notifications";
import { APPLICATION_CONTEXT } from "../lib";
import { User } from "../lib/user";
import { EmptyComponent } from "./misc";

export function UserDetails({ user: userProp, onCancel }: { user: User, onCancel: any }) {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [state, setState] = useState({
        user: userProp,
        ...userProp,
        loading: false,
        showEdit: false,
    })

    const { addToast } = useToasts()

    const onFirstNameChange = useCallback((e) => {
        setState({ ...state, firstName: e.target.value })
    }, [state])

    const onLastNameChange = useCallback((e) => {
        setState({ ...state, lastName: e.target.value })
    }, [state])

    const onEmailChange = useCallback((e) => {
        setState({ ...state, email: e.target.value })
    }, [state])

    const onCountryChange = useCallback((e) => {
        setState({ ...state, country: e.target.value })
    }, [state])

    const onPhoneChange = useCallback((e) => {
        setState({ ...state, phone: e.target.value })
    }, [state])


    const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setState({ ...state, loading: true })

            const { firstName, lastName, email, phone, country } = state.user
            const update = {
                firstName: state.firstName,
                lastName: state.lastName,
                email: state.email,
                phone: state.phone,
                country: state.country,
            }
            if (JSON.stringify({ firstName, lastName, email, phone, country }) === JSON.stringify(update)) {
                throw new Error("No change made!")
            }

            const user = await User.updateUser(ctx, userProp.id, update)
            setState({ ...state, user: { ...state.user, ...update }, showEdit: false, loading: false })
            addToast('Successfully created user!', {
                appearance: 'success',
            })
        } catch (e) {
            setState({ ...state, loading: false })
            addToast(e.message || 'Failed to update user!', {
                appearance: 'error',
            })
        }
    }, [state])
    const onDelete = useCallback(async () => {
        try {
            setState({ ...state, loading: true })

            const confirmDelete = window.confirm('Are you sure you want to delete this user?')

            if (!confirmDelete) {
                setState({ ...state, loading: false })
                return
            }

            const user = await User.deleteUser(ctx, userProp.id)
            setState({ ...state, loading: false })
            addToast('Successfully deleted user!', {
                appearance: 'success',
            })
            onCancel()
        } catch (e) {
            setState({ ...state, loading: false })
            addToast(e.message || 'Failed to delete user!', {
                appearance: 'error',
            })
        }
    }, [state])


    const user = state.user

    if (!user) {
        return <EmptyComponent message='No user selected!' icon={<FaUserAltSlash />} />
    }

    const createdAt = moment(user.createdAt)

    return (
        <div className='card has-radius'>
            <div className='card-content'>
                <figure className='image mb-4 is-128x128' style={{ margin: 'auto' }}>
                    <img className='is-rounded' style={{ height: '100%' }} src={user.profileImageURL} />
                </figure>
                {state.showEdit ? (
                    <form onSubmit={onSubmit}>
                        <div className='my-6'>
                            <div className='field is-horizontal'>
                                <div className='field-body'>
                                    <div className='field'>
                                        <div className='control has-icons-left'>
                                            <input disabled={state.loading} required className='input' onChange={onFirstNameChange} value={state.firstName} type='text' placeholder='enter firstname...' />
                                            <span className='icon is-small is-left'>
                                                <FaUser />
                                            </span>
                                        </div>
                                    </div>
                                    <div className='field'>
                                        <div className='control has-icons-left'>
                                            <input disabled={state.loading} required className='input' onChange={onLastNameChange} value={state.lastName} type='text' placeholder='enter lastname...' />
                                            <span className='icon is-small is-left'>
                                                <FaUser />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='field is-horizontal'>
                                <div className='field-body'>
                                    <div className='field'>
                                        <div className='control has-icons-left'>
                                            <input disabled={state.loading} required className='input' onChange={onEmailChange} value={state.email} type='mail' placeholder='enter email...' />
                                            <span className='icon is-small is-left'>
                                                <FaEnvelope />
                                            </span>
                                        </div>
                                    </div>

                                    <div className='field'>
                                        <div className='control has-icons-left'>
                                            <input disabled={state.loading} required className='input' onChange={onPhoneChange} value={state.phone} type='tel' placeholder='enter phone number...' />
                                            <span className='icon is-small is-left'>
                                                <FaPhoneAlt />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='field'>
                                <div className='control has-icons-left'>
                                    <input disabled={state.loading} required className='input' onChange={onCountryChange} value={state.country} type='mail' placeholder='enter email...' />
                                    <span className='icon is-small is-left'>
                                        <FaEnvelope />
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className='field is-grouped is-grouped-centered'>
                            <div className='control'>
                                <button onClick={() => setState({ ...state, showEdit: false })} disabled={state.loading} type='reset' className={`button mt-4 is-dark is-outlined is-rounded is-uppercase`}><FaChevronLeft />&nbsp; Cancel</button>
                            </div>
                            <div className='control'>
                                <button disabled={state.loading} type='submit' className={`button mt-4 is-success is-rounded is-uppercase ${state.loading ? 'is-loading' : ''}`}><FaCheck />&nbsp; Save Changes</button>
                            </div>
                        </div>
                    </form>
                ) : (
                        <>
                            <div className='mb-6 block'>
                            <p className='is-capitalized has-text-grey-light has-text-centered'><FaClock />&nbsp; Created {createdAt.fromNow()}</p>
                                <div className='columns mt-4 is-multiline'>
                                    <p className='is-capitalized column is-6'><FaUserCircle />&nbsp; {`${user.firstName} ${user.lastName}`}</p>
                                    <p className='is-lowercase column is-6'><FaEnvelope />&nbsp; {user.email}</p>

                                    <p className='is-capitalized column is-6'><FaPhoneAlt />&nbsp; {user.phone}</p>
                                    <p className='is-capitalized column is-6'><FaGlobe />&nbsp; {user.country}</p>
                                </div>
                            </div>
                            <div className='field is-grouped is-grouped-centered'>
                                <div className='control'>
                                    <button onClick={onCancel} disabled={state.loading} type='button' className={`button mt-4 is-dark is-outlined is-rounded is-uppercase`}><FaChevronLeft />&nbsp; Back</button>
                                </div>
                                <div className='control'>
                                    <button onClick={onDelete} disabled={state.loading} type='button' className={`button mt-4 is-danger is-rounded is-uppercase ${state.loading ? 'is-loading' : ''}`}><FaTrash />&nbsp; Delete</button>
                                </div>
                                <div className='control'>
                                    <button onClick={() => setState({ ...state, showEdit: true })} disabled={state.loading} type='button' className={`button mt-4 is-success is-rounded is-uppercase`}><FaPencilAlt />&nbsp; Edit</button>
                                </div>
                            </div>
                        </>
                    )}
            </div>
        </div >

    )
}