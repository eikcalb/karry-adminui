import { strictEqual } from "assert";
import moment from "moment";
import React, { useCallback, useContext, useState } from "react";
import { FaCheck, FaChevronLeft, FaClock, FaEdit, FaEnvelope, FaExclamationCircle, FaExclamationTriangle, FaEye, FaFlag, FaFontAwesomeFlag, FaGlobe, FaPencilAlt, FaPhoneAlt, FaPhoneSquareAlt, FaPlusCircle, FaSadCry, FaSadTear, FaThumbsDown, FaThumbsUp, FaTrash, FaUser, FaUserAltSlash, FaUserCircle, FaUserSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { APPLICATION_CONTEXT } from "../lib";
import { Post, computeCount } from "../lib/post";
import { User } from "../lib/user";
import { links } from "../lib/util";
import { EmptyComponent } from "./misc";

export function PostDetails({ post: postProp, onCancel }: { post: Post, onCancel: any }) {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [state, setState] = useState({
        post: postProp,
        title: postProp.title,
        loading: false,
        showEdit: false,
    })
    const [warning, setWarning] = useState({ show: false })

    const { addToast } = useToasts()

    const onTitleChange = useCallback((e) => {
        setState({ ...state, title: e.target.value })
    }, [state])

    const onSubmitUpdate = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            setState({ ...state, loading: true })

            if (state.title === state.post.title) {
                throw new Error("No change made!")
            }

            const updated = await Post.updatePost(ctx, postProp.id, state.title)
            setState({ ...state, post: { ...state.post, title: updated.title }, showEdit: false, loading: false })
            addToast('Successfully updated post!', {
                appearance: 'success',
            })
        } catch (e) {
            setState({ ...state, loading: false })
            addToast(e.message || 'Failed to update post!', {
                appearance: 'error',
            })
        }
    }, [state])

    const onDelete = useCallback(async () => {
        try {
            setState({ ...state, loading: true })

            const confirmDelete = window.confirm('Are you sure you want to delete this post?')

            if (!confirmDelete) {
                setState({ ...state, loading: false })
                return
            }

            await Post.deletePost(ctx, postProp.id)
            setState({ ...state, loading: false })
            addToast('Successfully deleted post!', {
                appearance: 'success',
            })
            onCancel()
        } catch (e) {
            setState({ ...state, loading: false })
            addToast(e.message || 'Failed to delete post!', {
                appearance: 'error',
            })
        }
    }, [state])

    const onWarnUser = useCallback(async (message) => {
        try {
            setState({ ...state, loading: true })

            if (message.length < 24) {
                throw new Error('Provide a meaningful message more than 24 characters!')
            }

            const confirm = window.confirm('Send a warning to this user about the content of this reported post?')

            if (!confirm) {
                setState({ ...state, loading: false })
                return
            }

            await User.warnUser(ctx, postProp.owner.id, message, postProp.id)
            setState({ ...state, loading: false })
            setWarning({ show: false })
            addToast('Successfully sent warning to user!', {
                appearance: 'success',
            })
        } catch (e) {
            setState({ ...state, loading: false })
            addToast(e.message || 'Failed to warn user!', {
                appearance: 'error',
            })
        }
    }, [state])


    const post: Post = state.post

    if (!post) {
        return <EmptyComponent message='No Post Selected!' icon={<FaSadTear />} />
    }

    const createdAt = moment.unix(post.uploadTime / 1000)

    return (
        <div className='card has-radius'>
            {!warning.show ? (
                <div className='card-content'>
                    <figure className='image' style={{ margin: 'auto' }}>
                        {post.type === 'image' ? (
                            <img style={{ height: '100%' }} src={post.mediaURL} />
                        ) : (
                                <video controls src={post.mediaURL} />
                            )}
                    </figure>
                    {state.showEdit ? (
                        <form onSubmit={onSubmitUpdate}>
                            <div className='field'>
                                <p className='help block has-text-weight-bold is-size-6 is-uppercase'>Edit Post Title</p>
                                <div className='control has-icons-left'>
                                    <input disabled={state.loading} required className='input' onChange={onTitleChange} value={state.title} type='text' placeholder='enter title...' />
                                    <span className='icon is-small is-left'>
                                        <FaEdit />
                                    </span>
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
                            <div>
                                <p style={{ textOverflow: 'ellipsis' }} className='block is-clipped is-size-5 has-text-centered has-text-weight-bold is-capitalized'>{post.title}</p>
                                <p style={{ justifyContent: 'space-between' }} className='is-capitalized is-flex block has-text-grey-light has-text-centered'>
                                    <span>
                                        <FaClock />&nbsp; Created {createdAt.fromNow()}
                                    </span>
                                    <span>
                                        <FaFontAwesomeFlag />&nbsp; {computeCount(post.reportsCount)} {post.reportsCount > 1 ? 'reports' : 'report'}
                                    </span>
                                </p>
                                <div className='is-flex-centered'>
                                    <div className='field has-addons has-addons-centered'>
                                        <div className='control'>
                                            <Link to={`${links._reports}${postProp.id}`} target='_blank' type='button' className={`button is-small is-rounded is-uppercase`}>View Flags</Link>
                                        </div>
                                        <div className='control'>
                                            <button onClick={() => setWarning({ ...state, show: true })} disabled={state.loading} type='button' className={`button is-small is-warning is-inverted is-rounded is-uppercase`}>Warn Account</button>
                                        </div>
                                    </div>
                                </div>
                                <div className='columns is-vcentered is-mobile'>
                                    <div className='column is-narrow'>
                                        <figure className='image is-48x48' style={{ margin: 'auto' }}>
                                            <img className='is-rounded' style={{ height: '100%' }} src={post.owner.profileImageURL} />
                                        </figure>
                                    </div>
                                    <div className='column pl-0'>
                                        <p style={{ textOverflow: 'ellipsis' }} className='is-clipped is-size-6 has-text-left is-capitalized'>{`${post.owner.firstName} ${post.owner.lastName}`}</p>
                                    </div>
                                    <div className='column is-narrow field has-addons has-addons-right'>
                                        <p className='is-capitalized mx-2'><FaThumbsUp /> {computeCount(post.like)}</p>
                                        <p className='is-capitalized mx-2'><FaThumbsDown /> {computeCount(post.dislike)}</p>
                                        {post.type === 'video' ? <p className='is-capitalized mx-2'><FaEye /> {computeCount(post.viewCount)}</p> : null}
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
                            </div>
                        )}
                </div>
            ) : (
                    <div className='card-content'>
                        <Warning onBack={() => setWarning({ ...warning, show: false })} onSubmit={onWarnUser} loading={state.loading} />
                    </div>
                )}
        </div >

    )
}

const Warning = ({ onSubmit, onBack, loading }) => {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [message, setMessage] = useState(`This post violates the community guidelines of Karry!`)

    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()

            onSubmit(message.trim())
        }}>
            <FaExclamationCircle className='is-size-1 has-text-danger' />

            <div className='field'>
                <p className='help block has-text-weight-bold is-size-6 is-uppercase'>Send warning message</p>
                <div className='control has-icons-left'>
                    <textarea disabled={loading} required minLength={24} rows={4} className='textarea' onChange={(e) => setMessage(e.target.value)} value={message} placeholder='Set message to display to user about this warning...' />
                </div>
            </div>


            <div className='field is-grouped is-grouped-centered'>
                <div className='control'>
                    <button onClick={onBack} disabled={loading} type='reset' className={`button mt-4 is-dark is-outlined is-rounded is-uppercase`}><FaChevronLeft />&nbsp; Cancel</button>
                </div>
                <div className='control'>
                    <button disabled={loading} type='submit' className={`button mt-4 is-success is-rounded is-uppercase ${loading ? 'is-loading' : ''}`}><FaCheck />&nbsp; Send Warning</button>
                </div>
            </div>
        </form>
    )
}

const Reports = ({ post }: { post: Post }) => {
    return (
        <></>
    )
}