import React, { useContext } from 'react'
import { MdLocationOn } from "react-icons/md";
import { VIEW_CONTEXT, MOCK_DATA } from '../lib';
import { AuthHandler } from '../components/guard';
import { BodyFragment } from '../components/body';
import { FaExclamationCircle } from 'react-icons/fa';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { links } from '../lib/util';

export function Register() {
    // const ctx = useContext(APPLICATION_CONTEXT)
    const viewCTX = useContext(VIEW_CONTEXT)

    return (
        <AuthHandler>
            <BodyFragment>
                <div className='container is-paddingless is-fluid is-flex is-fullheight is-flex-centered has-background-danger-light'>
                    <div className='columns section is-mobile is-multiline is-vcentered is-flex-centered' style={{ flex: 1 }}>
                        <div className='column is-10-tablet is-12-mobile'>
                            <div className='card has-radius'>
                                <div className='card-content section'>
                                    <div className='has-text-weight-bold'>
                                        <FaExclamationCircle className='has-text-danger is-size-1' />
                                        <p className='is-size-4'>UNAUTHORIZED ACTION</p>
                                        <p className='has-text-weight-normal pt-4 is-capitalized'>Contact your admin to create an account for you!</p>
                                        <p className='has-text-weight-normal pb-4 is-capitalized'>If you already have an account, kindly proceed to login</p>
                                        <Link to={links.login} className='button is-info is-rounded'>
                                            <FiLogIn /> &nbsp; Login
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BodyFragment>
        </AuthHandler>
    )
}