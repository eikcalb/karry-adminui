import { createContext } from "react";
import { User } from "./user";

export class Application {
    ready: Promise<boolean>
    name = "Karry Admin"
    version = "1.0"

    public user?: User

    constructor() {
        this.ready = new Promise(async (res, rej) => {
            try {
                // handle app initialization here
                await this.init()
                setTimeout(() => res(true), 10000)
            } catch (e) {
                console.log(e)
                rej(e)
            }
        })
    }

    protected async init() {

    }

    signedIn() {
        return this.user
    }

}

export const MOCK_DATA = {
    route: {
        Ajah: [
            { longitude: 3.90, latitude: 6.442, name: 'Bus stop 1' },
            { longitude: 3.90, latitude: 6.442, name: 'Bus stop 2' },
            { longitude: 3.90, latitude: 6.442, name: 'Bus stop 3' },
            { longitude: 3.90, latitude: 6.442, name: 'Bus stop 4' },
            { longitude: 3.90, latitude: 6.442, name: 'Bus stop 5' },
            { longitude: 3.90, latitude: 6.442, name: 'Bus stop 6' },
            { longitude: 3.90, latitude: 6.442, name: 'Bus stop 7' }
        ]
    }
}

export const DEFAULT_APPLICATION = new Application()

/**
 * This is the application context used within the web application.
 * 
 * This context provided the application engine and is not tied to any view rendering.
 * 
 * The underlying aplication object exposes the required functions and do not modify the view.
 * This underlying object is made available to all React components via the application context.
 * 
 * All view rendering is managed in React.
 * 
 * **VIEW RENDERING SHOULD NOT DEPEND ON ANY PROPERTY OF THIS CONTEXT**
 */
export const APPLICATION_CONTEXT = createContext<Application>(DEFAULT_APPLICATION)

/**
 * This context is used for managing the views within the web app.
 * Activities such as loading and splashscreen are implemented using this context.
 */
export const VIEW_CONTEXT = createContext<{
    signedIn: null | User,
    setSignedInUser: (user) => any,
    setLoading:(loading:boolean)=>any
}>({
    signedIn: null,
    setSignedInUser: () => { },
    setLoading:()=>{}
})