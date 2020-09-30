import React from 'react';
import { BodyFragment } from '../components/body';
import Map from "../components/map";
import { MOCK_DATA } from '../lib';
import { MdAddCircle } from 'react-icons/md';

export default function ({ }) {
    // const ctx = useContext(APPLICATION_CONTEXT)


    return (
        <BodyFragment>
            <Map routes={MOCK_DATA.route.Ajah} />
        </BodyFragment>
    )
}

export const UserList = () => {
    return (
        <div className='container is-fluid'>
            <div className='columns section is-mobile is-multiline is-centered is-vcentered is-fullheight'>
                <div className='card column is-12-mobile is-5-tablet is-4-desktop'>
                    <div className='card-content has-text-centered'>
                        <p className='title'><MdAddCircle className='has-text-success' /></p>
                        <div className='subtitle is-size-7'>
                            <p>ADD A NEW ROUTE</p>
                        </div>
                    </div>
                </div>
                {[].map(r => ( 
                    <RouteEntry name={r} description={r} />
                ))}
            </div>
        </div>
    )
}

const RouteEntry = ({ name, description }: { name: string, description: string }) => {
    return (
        <div className='card column is-12-mobile is-6-tablet is-4-desktop'>
            <div className='card-content'>
                <div className='has-text-centered'>{name}</div>
                <div className='section'>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    )
}