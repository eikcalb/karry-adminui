import React, { useContext } from 'react'
import { MdLocationOn } from "react-icons/md";
import { VIEW_CONTEXT } from '../lib';

export default function ({ routes }: { routes: any[] }) {
    // const ctx = useContext(APPLICATION_CONTEXT)
    const viewCTX = useContext(VIEW_CONTEXT)

    return (
        <div className='container'>
            <div className='columns section is-mobile is-multiline is-centered is-vcentered'>
                {routes.map(r => (
                    <div className='column is-4-tablet is-12-mobile'>
                        <div className='card'>
                            <div className='card-content'>
                                <div className=''>{r.name}</div>
                            </div>
                            <div className='card-footer'>
                                <span onClick={() => {
                                    viewCTX.setLoading(true)
                                    setTimeout(()=>viewCTX.setLoading(false), 1000)
                                }} className='card-footer-item button is-inverted is-dark' title='Set pickup location'>
                                    <MdLocationOn className='has-text-danger' /> &nbsp;PICK ME UP HERE
                        </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}