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
import { IReport, Post } from '../lib/post';
import { useParams } from 'react-router-dom';

const numberFormatter = Intl.NumberFormat()

function Item({ report }: { report: IReport }) {
    return (
        <div className='column is-10 is-offset-1 is-12-mobile mx-6'>
            <div className='card'>
                <div className='card-content'>
                    <div className='px-2 py-2 columns is-vcentered'>
                        <div className='column is-narrow is-12-mobile'>
                            <div className='columns is-vcentered is-mobile'>
                                <div className='column is-narrow'>
                                    <figure className='image is-32x32' style={{ margin: 'auto' }}>
                                        <img className='is-rounded' style={{ height: '100%' }} src={report.person.profileImageURL} />
                                    </figure>
                                </div>
                                <div className='column pl-0'>
                                    <p style={{ textOverflow: 'ellipsis' }} className='is-clipped has-text-left has-text-centered-mobile is-capitalized'>{`${report.person.firstName} ${report.person.lastName}`}</p>
                                </div>
                            </div>
                        </div>
                        <div className='column is-expanded is-12-mobile'>
                            <p className='is-clipped is-size-6 has-text-weight-bold'>{report.content}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function Reports() {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [state, setState] = useState({
        loadingMore: false,
        reports: new Array<IReport>(),
    })
    const { addToast } = useToasts()
    const { id } = useParams<{ id: string }>()

    const onLoadMore = useCallback(async () => {
        try {
            setState({ ...state, loadingMore: true })
            const reports = await Post.getReports(ctx, id, Math.max(2, Math.ceil(state.reports.length / USERS_PAGE_LIMIT) + 1))
            if (reports.length < 1) {
                addToast("No new data to fetch!", {
                    appearance: 'info'
                })
                return setState({ ...state, loadingMore: false })
            }
            setState({ ...state, loadingMore: false, reports: [...state.reports, ...reports] })
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

        Post.getReports(ctx, id).then((reports) => {
            if (reports.length < 1) {
                addToast("No new data to fetch!", {
                    appearance: 'info'
                })
                return setState({ ...state, loadingMore: false })
            }
            setState({ ...state, loadingMore: false, reports })
        }).catch(e => {
            console.log(e)
            setState({ ...state, loadingMore: true })

            addToast("Failed to load new data!", {
                appearance: 'error'
            })
        })
    }, [])

    if (!id) {
        return (
            <BodyFragment loading={false}>
                <div className='container is-fluid is-fullheight is-flex-centered'>
                    <EmptyComponent message="Post not found" shadow={false} />
                </div>
            </BodyFragment>
        )
    }



    return (
        <BodyFragment>
            <div className='container is-fluid mb-6'>
                <div className='section my-4'>
                    <div className='columns is-multiline is-vcentered is-flex-centered'>
                        {state.reports.map(item => <Item key={item.id} report={item} />)}
                    </div>
                </div>
                <div onClick={onLoadMore} className={`button is-size-7 px-5 is-uppercase is-rounded is-dark ${state.loadingMore ? 'is-loading' : ''}`}>Load More</div>
            </div>
        </BodyFragment>
    )
}

