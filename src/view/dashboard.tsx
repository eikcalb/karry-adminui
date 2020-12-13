import React, { useContext, useEffect, useState } from 'react';
import { BodyFragment } from '../components/body';
import Map from "../components/map";
import { MOCK_DATA, APPLICATION_CONTEXT } from '../lib';
import { MdAddCircle } from 'react-icons/md';
import { Modal } from '../components/modal';
import { FaRegUserCircle, FaUserLock } from 'react-icons/fa';
import { AddAdmin, AddUniversity } from '../components/misc';
import { Stat } from '../lib/stat';

const numberFormatter = Intl.NumberFormat()

function ItemCount({ name, value, prefix = <></> as React.ReactNode, loading = false }) {
    return (
        <div className='level-item has-text-centered'>
            <div>
                <p className='heading'>{name}</p>
                {loading ? (<button className='button is-white is-loading'></button>) : <p className='title'>{prefix} {numberFormatter.format(value)}</p>}
            </div>
        </div>
    )
}

export function Dashboard() {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [state, setState] = useState({
        showAdminModal: false, loadingStat: true, showUniversityModal: false,
        players: 0, managers: 0, teams: 0, tournaments: 0, tranactions: 0, inactiveUsers: 0, subscribedPlayers: 0, universities: 0, paymentsReceived: 0, ads: 0, posts: 0
    })

    useEffect(() => {
        Stat.getCount(ctx).then(async ({ players, managers, teams, tournaments, transactions, subscribedPlayers, universities, paymentsReceived, ads, posts }) => {
            setState({ ...state, loadingStat: false, players, managers, teams, tournaments, tranactions: transactions, subscribedPlayers, universities, paymentsReceived, ads, posts })
        }).catch(e => {
            console.log(e)
            setState({ ...state, loadingStat: false })
        })
    }, [])

    return (
        <BodyFragment>
            <div className='container is-fluid is-fullheight'>
                <div className='section my-4'>
                    <div className='level'>
                        <ItemCount name='Total Players' value={state.players} loading={state.loadingStat} />
                        <ItemCount name='Total Users' value={state.managers} loading={state.loadingStat} />
                        <ItemCount name='Total Teams' value={state.teams} loading={state.loadingStat} />
                        <ItemCount name='Total Universities' value={state.universities} loading={state.loadingStat} />
                        <ItemCount name='Total Tournaments' value={state.tournaments} loading={state.loadingStat} />
                    </div>

                    <div className='level mt-6'>
                        <ItemCount name='Total Transactions' value={state.tranactions} loading={state.loadingStat} />
                        <ItemCount name='Total Premium Users' value={state.subscribedPlayers} loading={state.loadingStat} />
                        <ItemCount name='Total Inward' prefix={'$'} value={state.paymentsReceived} loading={state.loadingStat} />
                        <ItemCount name='Total Posts' value={state.posts} loading={state.loadingStat} />
                        <ItemCount name='Total Ads' value={state.ads} loading={state.loadingStat} />
                    </div>

                    <div className='mt-6 columns is-multiline is-vcentered is-flex-centered'>
                        <div className='column is-4-desktop is-6-tablet'>
                            <div className='card is-hoverable-card'>
                                <div className='card-content'>
                                    <div className='block has-text-weight-bold is-size-7 is-uppercase'>
                                        <p>Add a new admin to manage {ctx.name}</p>
                                    </div>
                                    <div onClick={() => setState({ ...state, showAdminModal: true })} className='control'>
                                        <button className='button is-size-7 is-dark is-fullwidth is-rounded is-uppercase'>Create a new admin</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='column is-4-desktop is-6-tablet'>
                            <div className='card is-hoverable-card'>
                                <div className='card-content'>
                                    <div className='block has-text-weight-bold is-size-7 is-uppercase'>
                                        <p>Add a university to {ctx.name}</p>
                                    </div>
                                    <div onClick={() => setState({ ...state, showUniversityModal: true })} className='control'>
                                        <button className='button is-size-7 is-info is-fullwidth is-rounded is-uppercase'>Create a university</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal active={state.showAdminModal} onDismiss={() => setState({ ...state, showAdminModal: false })}>
                <AddAdmin />
            </Modal>

            <Modal active={state.showUniversityModal} onDismiss={() => setState({ ...state, showUniversityModal: false })}>
                <AddUniversity />
            </Modal>
        </BodyFragment>
    )
}

