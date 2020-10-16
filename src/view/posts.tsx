import React, { useCallback, useContext, useEffect, useState } from 'react';
import { BodyFragment } from '../components/body';
import Map from "../components/map";
import { MOCK_DATA, APPLICATION_CONTEXT } from '../lib';
import { MdAddCircle } from 'react-icons/md';
import { Modal } from '../components/modal';
import { FaEye, FaRegUserCircle, FaThumbsUp, FaUserLock } from 'react-icons/fa';
import { AddAdmin, EmptyComponent } from '../components/misc';
import { Stat } from '../lib/stat';
import { User, USERS_PAGE_LIMIT } from '../lib/user';
import { useToasts } from 'react-toast-notifications';
import { UserDetails } from '../components/users';
import { Post, POSTS_PAGE_LIMIT, computeCount } from '../lib/post';
import { PostDetails } from '../components/post';

const numberFormatter = Intl.NumberFormat()

function Item({ post, onClick }: { post: Post, onClick?: any }) {
    const user = post.owner

    return (
        <div onClick={onClick} className='column is-3-widescreen is-4-desktop is-12-mobile is-6-tablet'>
            <div className='card is-hoverable-card'>
                <div className='card-content is-paddingless'>
                    <figure className='image is-4by3' style={{ margin: 'auto' }}>
                        <img src={post.thumbnailURL} />
                    </figure>
                    <div className='px-2 py-2'>
                        <p style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className='block is-clipped is-size-5 has-text-centered has-text-weight-bold is-capitalized'>{post.title}</p>
                        <div className='columns is-vcentered is-mobile'>
                            <div className='column is-narrow'>
                                <figure className='image is-32x32' style={{ margin: 'auto' }}>
                                    <img className='is-rounded' style={{ height: '100%' }} src={user.profileImageURL} />
                                </figure>
                            </div>
                            <div className='column pl-0'>
                                <p style={{ textOverflow: 'ellipsis' }} className='is-clipped is-size-6 has-text-left is-capitalized'>{`${user.firstName} ${user.lastName}`}</p>
                            </div>
                            <div className='column pl-0 is-narrow'>
                                {post.type === 'image' ? (
                                    <p className='is-capitalized'><FaThumbsUp /> {computeCount(post.like)}</p>
                                ) : (
                                        <p className='is-capitalized'><FaEye /> {computeCount(post.viewCount)}</p>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function Posts() {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [state, setState] = useState<any>({
        loadingMore: false,
        posts: new Array<User>(),
        selectedPost: undefined
    })

    const { addToast } = useToasts()

    const onLoadMore = useCallback(async () => {
        try {
            setState({ ...state, loadingMore: true })
            const posts = await Post.getAllPosts(ctx, Math.max(2, Math.ceil(state.posts.length / POSTS_PAGE_LIMIT) + 1))
            if (posts.length < 1) {
                addToast("No new data to fetch!", {
                    appearance: 'info'
                })
                return setState({ ...state, loadingMore: false })
            }
            setState({ ...state, loadingMore: false, posts: [...state.posts, ...posts] })
        } catch (e) {
            console.log(e)
            setState({ ...state, loadingMore: false })
            addToast("Failed to load new data!", {
                appearance: 'error'
            })
        }
    }, [state])

    useEffect(() => {
        setState({ ...state, loadingMore: true })
        const users = Post.getAllPosts(ctx).then((posts) => {
            if (posts.length < 1) {
                addToast("No new data to fetch!", {
                    appearance: 'info'
                })
                return setState({ ...state, loadingMore: false })
            }
            setState({ ...state, loadingMore: false, posts })
        }).catch(e => {
            console.log(e)
            setState({ ...state, loadingMore: false })
            addToast("Failed to load new data!", {
                appearance: 'error'
            })
        })
    }, [])

    return (
        <BodyFragment>
            <div className='container is-fluid mb-6'>
                <div className='section my-4'>
                    <div className='columns is-multiline is-vcentered is-flex-centered'>
                        {state.posts.map(item => <Item key={item.id} onClick={() => {
                            setState((state) => ({ ...state, selectedPost: item }))
                        }} post={item} />)}
                    </div>
                </div>
                <div onClick={onLoadMore} className={`button is-size-7 px-5 is-uppercase is-rounded is-dark ${state.loadingMore ? 'is-loading' : ''}`}>Load More</div>
            </div>
            {state.selectedPost ? (
                <Modal active={true} onDismiss={() => setState({ ...state, selectedPost: undefined })}>
                    <PostDetails onCancel={() => setState({ ...state, selectedPost: undefined })} post={state.selectedPost} />
                </Modal>
            ) : null}
        </BodyFragment>
    )
}

