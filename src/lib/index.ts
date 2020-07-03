import { createContext } from "react";
import { Application } from '@eikcalb/owa_core'

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
 * This is the application context used within OWA web application.
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
 * This context is used for managing the views within OWA web app.
 * Activities such as loading and splashscreen are implemented using this context.
 */
export const VIEW_CONTEXT = createContext<any>({})