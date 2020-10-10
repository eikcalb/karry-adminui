import { createContext } from "react";
import { User } from "./user";
import { IConfig, DEFAULT_CONFIG } from "./config";
import validator from "validator";
import * as localforage from "localforage";
import { storageKeys } from "./util";

export class Application {
    ready: Promise<boolean>
    name = "Karry Admin"
    version = "1.0"

    protected config: IConfig
    public user?: User

    logoutListener

    constructor(config) {
        this.config = config
        this.ready = new Promise(async (res, rej) => {
            try {
                // handle app initialization here
                await this.init()

                // check for existing user session
                try {
                    await this.inflateUser()
                } catch (e) {
                    console.log(e)
                }
                res(true)
            } catch (e) {
                console.log(e)
                rej(e)
            }
        })
    }

    protected async init() {
        // initialize storage
        localforage.config({
            driver: [
                localforage.INDEXEDDB,
                localforage.LOCALSTORAGE,
                localforage.WEBSQL
            ],
            name: `${this.name} v${this.version}`,
            version: 1,
            storeName: 'adminstore',
            description: ''
        })
        await localforage.ready()
    }

    async initiateNetworkRequest(path: string, request?: RequestInit): Promise<Response> {
        const resp = await fetch(`${this.config.hostname}${path}`, request)
        if (resp.status === 401) {
            if (!this.user) {
                throw new Error("Unauthenticated access not allowed!")
            }
            // Authorization failed. This usually means the token has expired and refresh token could not be used to regenerate token
            //
            // Try to reauthenticate the user
            try {
                const { token } = await this.reauthenticate()
                this.user.token = token
                // since token is generated already, retry the request
                if (request && request.headers && request.headers['x-access-token']) {
                    request.headers['x-access-token'] = token
                }
                return await this.initiateNetworkRequest(path, request)
            } catch (e) {
                await this.logout()
                throw e || new Error("App session expired. Login to continue!")
            }
        }
        return resp
    }

    protected async reauthenticate(): Promise<{ token: string }> {
        try {
            const refToken = await localforage.getItem(storageKeys.REFRESH_TOKEN)
            if (!refToken) {
                throw new Error("Cannot refresh session. You must login to continue!")
            }
            const response = await this.initiateNetworkRequest('/admin/persons/refresh', {
                method: 'POST',
                referrerPolicy: "no-referrer",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ token: refToken })
            })

            if (!response.ok) {
                throw new Error((await response.json()).error)
            }

            const jsonResponse = await response.json()
            await localforage.setItem(storageKeys.REFRESH_TOKEN, jsonResponse.refreshToken)
            delete jsonResponse.refreshToken
            return jsonResponse
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    protected async inflateUser() {
        // inflate user session
        let session: User | null = await localforage.getItem(storageKeys.USER_SESSION)
        if (!session) throw new Error("No session available for user!")

        this.user = new User(session)
        return this.user
    }

    protected async persistUser() {
        if (!this.user) {
            throw new Error('No user created!')
        }

        await localforage.setItem(storageKeys.USER_SESSION, this.user)
    }

    signedIn() {
        return this.user
    }

    async login(username, password) {
        try {
            await this.validateLogin(username, password)

            const response = await this.initiateNetworkRequest('/admin/persons/login', {
                method: 'POST',
                referrerPolicy: "no-referrer",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email: username, password })
            })
            if (!response.ok) {
                throw new Error((await response.json()).error)
            }

            const jsonResponse = await response.json()
            await localforage.setItem(storageKeys.REFRESH_TOKEN, jsonResponse.refreshToken)
            delete jsonResponse.refreshToken
            this.user = new User(jsonResponse)
            await this.persistUser()

            return this.user

        } catch (e) {
            throw e
        }
    }

    protected async validateLogin(username: string, password: string) {
        if (!username || !password) {
            throw new Error("Credentials not provided!")
        }
        username = username.trim()

        if (!username || !validator.isEmail(username)) {
            throw new Error("Invalid username provided!")
        }
        if (!validator.matches(password, /[a-zA-z0-9]{6,}/i)) {
            throw new Error("Invalid password provided (Password must be alphanumeric and more than 6 characters)!")
        }
    }


    async addAdmin(data) {
        try {
            await this.validateRegister(data)

            const response = await this.initiateNetworkRequest('/admin/persons/new', {
                method: 'POST',
                referrerPolicy: "no-referrer",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-access-token': `${this.user?.token}`
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                throw new Error((await response.json()).error)
            }

            const jsonResponse = await response.json()
            const user = new User(jsonResponse)

            return user

        } catch (e) {
            throw e
        }
    }

    protected async validateRegister(data) {
        let { email, password, firstName, lastName, passwordVerify } = data
        if (!email || !password) {
            throw new Error("Credentials not provided!")
        }
        if (password !== passwordVerify) {
            throw new Error('Passwords do not match!')
        }
        email = email.trim()
        firstName = firstName.trim()
        lastName = lastName.trim()
        if (!firstName || !lastName) {
            throw new Error('Firstname and lastname must be provided!')
        }
        if (!email || !validator.isEmail(email)) {
            throw new Error("Invalid username provided!")
        }
        if (!validator.matches(password, /[a-zA-z0-9]{6,}/i)) {
            throw new Error("Invalid password provided (Password must be alphanumeric and more than 6 characters)!")
        }
    }

    async logout() {
        this.user = undefined
        localforage.removeItem(storageKeys.USER_SESSION)
        localforage.removeItem(storageKeys.REFRESH_TOKEN)
        if (this.logoutListener) {
            this.logoutListener()
        }
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

export const DEFAULT_APPLICATION = new Application(DEFAULT_CONFIG)

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
    signedIn: undefined | User,
    setSignedInUser: (user) => any,
    setLoading: (loading: boolean) => any
}>({
    signedIn: undefined,
    setSignedInUser: () => { },
    setLoading: () => { }
})