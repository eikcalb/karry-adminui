import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import RouteView, { RouteList } from '../view/route'
import LoadingIcon from "../loading_icon.gif";
import { APPLICATION_CONTEXT, VIEW_CONTEXT } from "../lib";
import { links } from "../lib/util";
import { Logout } from './logout'
import { Login } from "../view/login";
import { Register } from "../view/register";
import { AuthGuard } from "./guard";
import { Dashboard } from "../view/dashboard";
import { Users } from "../view/users";
import { Posts } from "../view/posts";
import { EmptyComponent } from "./misc";
import { Reports } from "../view/reports";
import { Universities } from "../view/universities";


const Loading = () => {
    return (
        <div className='is-flex-centered' style={{ height: '100%', filter: 'grayscale(1)' }}>
            <figure className='image is-128x128'>
                <img src={LoadingIcon} />
            </figure>
        </div>
    )
}

export const BodyFragment = ({ loading, children }: { loading?: boolean, children?: any }) => {
    return (
        <div className='App-Body'>
            {loading ? <Loading /> : <>{children}</>}
        </div>
    )
}

export const Body = ({ showLoading }: { showLoading?: boolean }) => {
    const ctx = useContext(APPLICATION_CONTEXT)
    const viewCTX = useContext(VIEW_CONTEXT)
    // showLoading = showLoading
    if (showLoading) { return <BodyFragment loading /> }
    else {
        return (
            <Switch>
                <Route path={links.login} exact>
                    <Login />
                </Route>
                <Route path={links.register} exact>
                    <Register />
                </Route>

                <Route path={links.logout} exact>
                    <Logout />
                </Route>

                <AuthGuard path={links.dashboard}>
                    <Dashboard />
                </AuthGuard>
                <AuthGuard path={links.users} exact>
                    <Users />
                </AuthGuard>
                <AuthGuard path={links.universities} exact>
                    <Universities />
                </AuthGuard>
                <AuthGuard path={links.posts} exact>
                    <Posts />
                </AuthGuard>
                <AuthGuard path={links.reports}>
                    <Reports />
                </AuthGuard>

                <Route path={links.root} exact>
                    {viewCTX.signedIn ?
                        (
                            <Redirect to={links.dashboard} />
                        ) :
                        (
                            <Redirect to={links.login} />
                        )}
                </Route>


                <AuthGuard >
                    <BodyFragment loading={showLoading}>
                        <div className='container is-fluid is-fullheight is-flex-centered'>
                            <EmptyComponent message="Page not found" shadow={false} />
                        </div>
                    </BodyFragment>
                </AuthGuard>
            </Switch>
        )
    }
}


