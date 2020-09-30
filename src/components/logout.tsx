import React, { useContext, useState, useCallback, useEffect } from 'react';
import { FaExclamationCircle, FaUserCircle, FaUser, FaKey, FaEyeSlash, FaEye } from 'react-icons/fa';
import { FiLogIn } from 'react-icons/fi';
import { Link, Redirect } from 'react-router-dom';
import { BodyFragment } from '../components/body';
import { AuthHandler } from '../components/guard';
import { VIEW_CONTEXT, APPLICATION_CONTEXT } from '../lib';
import { links } from '../lib/util';
import { useToasts } from 'react-toast-notifications';

export function Logout() {
    const ctx = useContext(APPLICATION_CONTEXT)
    const viewCTX = useContext(VIEW_CONTEXT)
    const [logoutSuccess, setSuccess] = useState(false)

    useEffect(() => {
        ctx.logout().then(async () => {
            viewCTX.setSignedInUser(false)
            setSuccess(true)
            return
        })
    }, [])

    return (
        !logoutSuccess ? <BodyFragment loading /> : <Redirect to={{ pathname: '/' }} />
    )
}