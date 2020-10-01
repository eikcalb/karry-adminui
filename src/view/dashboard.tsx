import React, { useContext, useState } from 'react';
import { BodyFragment } from '../components/body';
import Map from "../components/map";
import { MOCK_DATA, APPLICATION_CONTEXT } from '../lib';
import { MdAddCircle } from 'react-icons/md';
import { Modal } from '../components/modal';
import { FaRegUserCircle, FaUserLock } from 'react-icons/fa';
import { AddAdmin } from '../components/form';

const numberFormatter = Intl.NumberFormat()

function ItemCount({ name, value, loading=false }) {
    return (
        <div className='level-item has-text-centered'>
            <div>
                <p className='heading'>{name}</p>
                {loading ? (<button className='button is-white is-loading'></button>) : <p className='title'>{numberFormatter.format(value)}</p>}
            </div>
        </div>
    )
}

export function Dashboard() {
    const ctx = useContext(APPLICATION_CONTEXT)
    const [state, setState] = useState({ showAdminModal: false })

    return (
        <BodyFragment>
            <div className='container is-fluid is-fullheight'>
                <div className='section my-4'>
                    <div className='level'>
                        <ItemCount name='Users Count' value={300} />
                        <ItemCount name='Total Teams' value={3000} />
                        <ItemCount name='Total Ads' value={1200} />
                        <ItemCount name='Posts Count' value={3889000} />
                    </div>

                    <div className='mt-6 columns is-multiline is-vcentered is-flex-centered'>
                        <div className='column is-4-desktop is-6-tablet'>
                            <div className='card'>
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
                    </div>
                </div>
            </div>
            <Modal active={state.showAdminModal} onDismiss={() => setState({ ...state, showAdminModal: false })}>
                <AddAdmin />
            </Modal>
        </BodyFragment>
    )
}

