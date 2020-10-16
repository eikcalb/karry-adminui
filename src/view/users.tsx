import React, { useCallback, useContext, useEffect, useState } from 'react';
import { BodyFragment } from '../components/body';
import Map from "../components/map";
import { MOCK_DATA, APPLICATION_CONTEXT } from '../lib';
import { MdAddCircle } from 'react-icons/md';
import { Modal } from '../components/modal';
import { FaRegUserCircle, FaUserLock } from 'react-icons/fa';
import { AddAdmin, EmptyComponent } from '../components/misc';
import { Stat } from '../lib/stat';
import { User, USERS_PAGE_LIMIT } from '../lib/user';
import { useToasts } from 'react-toast-notifications';
import { UserDetails } from '../components/users';

const numberFormatter = Intl.NumberFormat()

function Item({ user, onClick }: { user: User, onClick?: any }) {
    return (
        <div onClick={onClick} className='column is-3-widescreen is-4-desktop is-12-mobile is-6-tablet'>
            <div className='card is-hoverable-card'>
                <div className='card-content'>
                    <figure className='image mb-4 is-96x96' style={{ margin: 'auto' }}>
                        <img className='is-rounded' style={{ height: '100%' }} src={user.profileImageURL} />
                    </figure>
                    <div className='block'>
                        <p style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className='is-clipped is-size-6 has-text-weight-bold is-capitalized'>{`${user.firstName} ${user.lastName}`}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function Users() {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [state, setState] = useState<any>({
        loadingMore: false,
        users: new Array<User>(),
        selectedUser: undefined
    })

    const { addToast } = useToasts()

    const onLoadMore = useCallback(async () => {
        try {
            setState({ ...state, loadingMore: true })
            const users = await User.getAllUsers(ctx, Math.max(2, Math.ceil(state.users.length / USERS_PAGE_LIMIT) + 1))
            if (users.length < 1) {
                addToast("No new data to fetch!", {
                    appearance: 'info'
                })
                return setState({ ...state, loadingMore: false })
            }
            setState({ ...state, loadingMore: false, users: [...state.users, ...users] })
        } catch (e) {
            console.log(e)
            setState({ ...state, loadingMore: true })

            addToast("Failed to load new data!", {
                appearance: 'error'
            })
        }
    }, [state])

    useEffect(() => {
        setState({ ...state, loadingMore: true })
        const users = User.getAllUsers(ctx).then((users) => {
            if (users.length < 1) {
                addToast("No new data to fetch!", {
                    appearance: 'info'
                })
                return setState({ ...state, loadingMore: false })
            }
            setState({ ...state, loadingMore: false, users })
        }).catch(e => {
            console.log(e)
            setState({ ...state, loadingMore: true })

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
                        {state.users.map(item => <Item key={item.id} onClick={() => {
                            setState((state) => ({ ...state, selectedUser: item }))
                        }} user={item} />)}
                    </div>
                </div>
                <div onClick={onLoadMore} className={`button is-size-7 px-5 is-uppercase is-rounded is-dark ${state.loadingMore ? 'is-loading' : ''}`}>Load More</div>
            </div>
            {state.selectedUser ? (
                <Modal active={true} onDismiss={() => setState({ ...state, selectedUser: undefined })}>
                    <UserDetails onCancel={() => setState({ ...state, selectedUser: undefined })} user={state.selectedUser} />
                </Modal>
            ) : null}
        </BodyFragment>
    )
}

