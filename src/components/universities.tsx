import moment from "moment";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { FaCheck, FaChevronLeft, FaClock, FaCloudUploadAlt, FaEnvelope, FaGlobe, FaPencilAlt, FaPhoneAlt, FaPhoneSquareAlt, FaPlusCircle, FaTrash, FaUniversity, FaUser, FaUserAltSlash, FaUserCircle, FaUserSlash, FaUserTie } from "react-icons/fa";
import { useToasts } from "react-toast-notifications";
import { APPLICATION_CONTEXT } from "../lib";
import { IUniversity, University } from "../lib/university";
import { User } from "../lib/user";
import { EmptyComponent } from "./misc";

export function UniversityDetails({ uni: uniProp, onCancel }: { uni: IUniversity, onCancel: any }) {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [state, setState] = useState({
        university: uniProp,
        ...uniProp,
        loading: false,
        showEdit: false,
        file: undefined as undefined | File
    })

    const { addToast } = useToasts()

    const onNameChange = useCallback((e) => {
        setState({ ...state, name: e.target.value })
    }, [state])

    const onDescriptionChange = useCallback((e) => {
        setState({ ...state, description: e.target.value })
    }, [state])

    const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, file: e.target?.files?.[0] || undefined })
    }, [state])



    const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setState({ ...state, loading: true })
            const { name, description } = state
            if (!state.file && JSON.stringify({ name, description }) === JSON.stringify({ name: state.university.name, description: state.university.description })) {
                throw new Error("No changes to save!")
            }

            const result = await University.updateUniversity(ctx, uniProp.id, {
                name: name.toLowerCase(),
                description
            }, state.file)
            console.log(result)
            setState({ ...state, loading: false, name, description })
            addToast('Successfully updated university!', {
                appearance: 'success',
            })
        } catch (e) {
            setState({ ...state, loading: false })
            addToast(e.message || 'Failed to update university!', {
                appearance: 'error',
            })
        }
    }, [state])
    const onDelete = useCallback(async () => {
        try {
            setState({ ...state, loading: true })

            const confirmDelete = window.confirm('Are you sure you want to delete this university?')

            if (!confirmDelete) {
                setState({ ...state, loading: false })
                return
            }

            await University.deleteUniversity(ctx, uniProp.id)
            setState({ ...state, loading: false })
            addToast('Successfully deleted university!', {
                appearance: 'success',
            })
            onCancel()
        } catch (e) {
            setState({ ...state, loading: false })
            addToast(e.message || 'Failed to delete university!', {
                appearance: 'error',
            })
        }
    }, [state])


    if (!state.university) {
        return <EmptyComponent message='No university selected!' icon={<FaUniversity />} />
    }

    return (
        <div className='card has-radius'>
            <div className='card-content'>
                <figure className='image mb-4 is-128x128' style={{ margin: 'auto' }}>
                    <img className='is-rounded' style={{ height: '100%' }} src={state.profileImageURL} />
                </figure>
                {state.showEdit ? (
                    <form onSubmit={onSubmit}>
                        <div className='my-6'>
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
                                <p className='is-capitalized has-text-weight-bold'>{state.name}</p>
                                <p className='mt-4'>{state.description}</p>
                            </div>

                            <UniversityPlayerDetails item={state.university} />

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

function UniversityPlayerDetails({ item }: { item: IUniversity }) {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [state, setState] = useState({
        requests: [] as any,
        players: [] as any,
        loading: false,
        show: 'players' as 'players' | 'requests',
    })

    const { addToast } = useToasts()

    const onApproveRequest = useCallback(async (player) => {
        try {
            setState({ ...state, loading: true })
            const result = await University.handleRequest(ctx, item.id, { player, approved: true })
            addToast('Successfully approved player request!', {
                appearance: 'success',
            })
        } catch (e) {
            addToast(e.message || 'Failed to approve player request!', {
                appearance: 'error',
            })
        } finally {
            setState({ ...state, loading: false })
        }
    }, [state])

    const onRejectRequest = useCallback(async (player) => {
        try {
            setState({ ...state, loading: true })
            const result = await University.handleRequest(ctx, item.id, { player, approved: false })
            addToast('Successfully rejected player request!', {
                appearance: 'success',
            })
        } catch (e) {
            addToast(e.message || 'Failed to reject player request!', {
                appearance: 'error',
            })
        } finally {
            setState({ ...state, loading: false })
        }
    }, [state])

    const onDeleteRequest = useCallback(async (req, player) => {
        try {
            setState({ ...state, loading: true })
            const result = await University.deleteRequest(ctx, item.id, player)
            addToast('Successfully deleted player request!', {
                appearance: 'success',
            })
        } catch (e) {
            addToast(e.message || 'Failed to delete player request!', {
                appearance: 'error',
            })
        } finally {
            setState({ ...state, loading: false })
        }
    }, [state])

    const onDeletePlayer = useCallback(async (player) => {
        try {
            setState({ ...state, loading: true })

            const confirmDelete = window.confirm('Are you sure you want to remove this player from selected university?')

            if (!confirmDelete) {
                setState({ ...state, loading: false })
                return
            }

            await University.deletePlayer(ctx, item.id, player)
            setState({ ...state, loading: false })
            addToast('Successfully removed player!', {
                appearance: 'success',
            })
        } catch (e) {
            setState({ ...state, loading: false })
            addToast(e.message || 'Failed to remove player!', {
                appearance: 'error',
            })
        }
    }, [state])

    const getRequests = useCallback(async () => {
        try {
            const requests = await University.getRequests(ctx, item.id)
            return requests
        } catch (e) {
            addToast(e.message || 'Failed to fetch requests!', {
                appearance: 'error',
            })
        }
    }, [state])

    const getPlayers = useCallback(async () => {
        try {
            const players = await University.getPlayers(ctx, item.id)
            return players
        } catch (e) {
            addToast(e.message || 'Failed to fetch players!', {
                appearance: 'error',
            })
        }
    }, [state])

    useEffect(() => {
        new Promise(async (res) => {
            setState((state) => ({ ...state, loading: true }))
            const players = await getPlayers()
            const requests = await getRequests()
            setState((state) => ({ ...state, loading: false, requests, players }))
            res()
        }).catch((e) => {
            console.log(e)
            setState((state) => ({ ...state, loading: false }))
        })
    }, [])

    return (
        <div className='section'>
            <div className="tabs is-centered is-toggle is-uppercase">
                <ul>
                    <li onClick={() => setState({ ...state, show: 'players' })} className={state.show === 'players' ? `is-active` : ''}>
                        <a>
                            <span>Players</span>
                        </a>
                    </li>
                    <li onClick={() => setState({ ...state, show: 'requests' })} className={state.show === 'requests' ? `is-active` : ''}>
                        <a>
                            <span>Requests</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div>
                {state[state.show === 'players' ? 'players' : 'requests'].map((i) => {
                    console.log(i)
                    return <div>
                    </div>
                })}
            </div>
        </div >

    )
}