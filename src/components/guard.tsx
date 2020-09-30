import React, { useContext } from "react"
import { APPLICATION_CONTEXT, VIEW_CONTEXT } from "../lib"
import { Redirect, Route, useLocation, useHistory, RouteProps } from "react-router-dom"
import { links } from "../lib/util"

export function AuthGuard({ children, ...rest }: RouteProps) {
    const ctx = useContext(APPLICATION_CONTEXT)
    const viewCTX = useContext(VIEW_CONTEXT)
    const location = useLocation()

    return (
        <Route {...rest}>
            {ctx.signedIn() && viewCTX.signedIn ? (
                children
            ) : (
                    <Redirect to={{
                        pathname: links.login,
                        state: {
                            from: location
                        }
                    }} />
                )
            }
        </Route>
    )
}

export function AuthHandler({ children }) {
    const ctx = useContext(APPLICATION_CONTEXT)
    const viewCTX = useContext(VIEW_CONTEXT)
    const location = useLocation(),
        history = useHistory()



    if (ctx.signedIn() && viewCTX.signedIn) {
        const { from } = (location.state as any) || { from: { pathname: '/' } }
        return <Redirect to={from} />
    } else {
        return children
    }
}