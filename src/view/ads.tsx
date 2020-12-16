import { unix } from 'moment';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FaBan, FaCheck, FaCoins, FaEye, FaTrashAlt } from 'react-icons/fa';
import { HiCursorClick } from 'react-icons/hi';
import { MdAssessment } from 'react-icons/md';
import { useToasts } from 'react-toast-notifications';
import { BodyFragment } from '../components/body';
import { EmptyComponent } from '../components/misc';
import { Modal } from '../components/modal';
import { UniversityDetails } from '../components/universities';
import { APPLICATION_CONTEXT } from '../lib';
import { Ad, AD_PAGE_LIMIT, IAd, Status } from '../lib/ads';
import { computeCount } from '../lib/post';
import { IUniversity, University } from '../lib/university';

const numberFormatter = Intl.NumberFormat()

function Item({ ad: adProp, onUpdate, onDelete }: { ad: IAd, onUpdate: (ad: IAd) => void, onDelete: (ad: IAd) => void }) {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [ad, setAd] = useState(adProp)
    const [loading, setLoading] = useState(false)
    const { addToast } = useToasts()

    let endTime
    if (ad.endTime) {
        endTime = unix(ad.endTime)
    }

    return (
        <div className='column is-3-widescreen is-3-desktop is-12-mobile is-4-tablet'>
            <div className='card is-hoverable-card'>
                <div className='card-content is-paddingless'>
                    <figure className='image is-4by3' style={{ margin: 'auto' }}>
                        {ad.type === 'image' ? (
                            <img style={{ height: '100%' }} src={ad.mediaURL} />
                        ) : (
                                <video autoPlay={false} controls src={ad.mediaURL} />
                            )}
                    </figure>
                    <div className='px-2 py-2'>
                        {ad.status === Status.INACTIVE ? (
                            <span style={{ position: 'absolute', top: 0, right: 0 }} className='tag is-danger'>INACTIVE</span>
                        ) : (
                                <span style={{ position: 'absolute', top: 0, right: 0 }} className='tag is-success'>ACTIVE</span>
                            )}
                        <p style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className='block mb-0 is-clipped is-size-5 has-text-centered has-text-weight-bold is-capitalized'>{ad.title}</p>
                        {endTime ? <p className='block is-size-7 mt-0 is-uppercase has-text-centered has-text-grey'>Expires: {endTime?.calendar()}</p> : null}
                        <div className='columns is-vcentered is-mobile'>
                            <div className='column'>
                                <p className='is-capitalized'><FaCoins /> {numberFormatter.format(ad.credit as number)}</p>
                            </div>
                            <div className='column'>
                                <p className='is-capitalized'><HiCursorClick /> {computeCount(ad.clickCount)}</p>
                            </div>
                            <div className='column'>
                                <p className='is-capitalized'><FaEye /> {computeCount(ad.viewCount)}</p>
                            </div>
                        </div>
                        <div className='columns is-vcentered is-mobile'>
                            <div className='column is-narrow'>
                                <figure className='image is-32x32' style={{ margin: 'auto' }}>
                                    <img className='is-rounded' style={{ height: '100%' }} src={ad.creator.profileImageURL} />
                                </figure>
                            </div>
                            <div className='column pl-0'>
                                <p style={{ textOverflow: 'ellipsis' }} className='is-clipped is-size-6 has-text-left is-capitalized'>{`${ad.creator.firstName} ${ad.creator.lastName}`}</p>
                            </div>
                        </div>
                        <div className='field is-grouped is-grouped-centered'>
                            {ad.status === Status.INACTIVE ? (
                                <div className='control'>
                                    <button onClick={async () => {
                                        try {
                                            setLoading(true)
                                            await Ad.handleRequest(ctx, ad.id, true)
                                            ad.status = Status.ACTIVE
                                            setAd(ad)
                                            addToast('Successfully activated Ad!', {
                                                appearance: 'success'
                                            })
                                            onUpdate(ad)
                                        } catch (e) {
                                            addToast(e.message || 'Failed to activate ad!', {
                                                appearance: 'error'
                                            })
                                        } finally {
                                            setLoading(false)
                                        }
                                    }} disabled={loading} type='button' className={`button mt-4 is-success is-outlined is-rounded is-uppercase ${loading ? 'is-loading' : ''}`}><FaCheck /></button>
                                </div>
                            ) : (
                                    <div className='control'>
                                        <button onClick={async () => {
                                            try {
                                                setLoading(true)
                                                await Ad.handleRequest(ctx, ad.id, false)
                                                ad.status = Status.INACTIVE
                                                setAd(ad)
                                                addToast('Successfully deactivated Ad!', {
                                                    appearance: 'success'
                                                })
                                                onUpdate(ad)
                                            } catch (e) {
                                                addToast(e.message || 'Failed to deactivate ad!', {
                                                    appearance: 'error'
                                                })
                                            } finally {
                                                setLoading(false)
                                            }
                                        }} disabled={loading} type='button' className={`button mt-4 is-danger is-outlined  is-rounded is-uppercase ${loading ? 'is-loading' : ''}`}><FaBan /></button>
                                    </div>
                                )}
                            <div className='control'>
                                <button onClick={async () => {
                                    try {
                                        setLoading(true)
                                        await Ad.deleteAd(ctx, ad.id)
                                        addToast('Successfully deleted Ad!', {
                                            appearance: 'success'
                                        })
                                        onDelete(ad)
                                    } catch (e) {
                                        addToast(e.message || 'Failed to delete ad!', {
                                            appearance: 'error'
                                        })
                                    } finally {
                                        setLoading(false)
                                    }
                                }} disabled={loading} type='button' className={`button mt-4 is-danger is-rounded is-uppercase ${loading ? 'is-loading' : ''}`}><FaTrashAlt />&nbsp;</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export function Ads() {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [state, setState] = useState<any>({
        loadingMore: false,
        items: new Array<IUniversity>(),
        selected: undefined
    })

    const { addToast } = useToasts()

    const onLoadMore = useCallback(async () => {
        try {
            setState({ ...state, loadingMore: true })
            const items = await Ad.getAds(ctx, Math.max(2, Math.ceil(state.items.length / AD_PAGE_LIMIT) + 1))
            if (items.length < 1) {
                addToast("No new data to fetch!", {
                    appearance: 'info'
                })
                return setState({ ...state, loadingMore: false })
            }
            setState({ ...state, loadingMore: false, items: [...state.items, ...items] })
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
        Ad.getAds(ctx).then((items) => {
            if (items.length < 1) {
                addToast("No new data to fetch!", {
                    appearance: 'info'
                })
                return setState({ ...state, loadingMore: false })
            }
            setState({ ...state, loadingMore: false, items })
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
                        {state.items.length < 1 ?
                            <EmptyComponent message='No Ad available yet!' shadow={false} icon={<MdAssessment />} /> :
                            state.items.map(item => <Item onUpdate={ad => {
                                setState({
                                    ...state, items: state.items.map(v => {
                                        if (v.id === ad.id) {
                                            return ad
                                        }
                                        return v
                                    })
                                })
                            }} onDelete={(ad) => setState({ ...state, items: state.items.filter(v => v.id !== ad.id) })} key={item.id} ad={item} />)
                        }
                    </div>
                </div>
                <div onClick={onLoadMore} className={`button is-size-7 px-5 is-uppercase is-rounded is-dark ${state.loadingMore ? 'is-loading' : ''}`}>Load More</div>
            </div>
        </BodyFragment>
    )
}

