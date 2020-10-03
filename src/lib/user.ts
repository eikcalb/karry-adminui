import { Application } from "."

export const USERS_PAGE_LIMIT = 20

export class User {
    id
    firstName
    lastName
    role: 'player' | 'manager' | 'superadmin'
    email: string
    profileImageURL?: string
    token?: string
    phone
    country
    createdAt

    constructor(data) {
        this.id = data.id
        this.role = data.role
        this.firstName = data.firstName
        this.lastName = data.lastName
        this.email = data.email
        this.token = data.token
    }

    static async getAllUsers(app: Application, page = 1, pageLimit = USERS_PAGE_LIMIT): Promise<User[]> {
        try {
            const response = await app.initiateNetworkRequest(`/admin/persons/persons?pageNo=${page}&pageLimit=${pageLimit}`, {
                method: 'GET',
                referrerPolicy: "no-referrer",
                headers: {
                    'Accept': 'application/json',
                    'x-access-token': `${app.user?.token}`
                },
            })
            if (!response.ok) {
                throw new Error((await response.json()).error)
            }

            return await response.json()
        } catch (e) {
            throw e
        }
    }

    static async updateUser(app: Application, userID: string, data): Promise<User> {
        try {
            const response = await app.initiateNetworkRequest(`/admin/persons/persons/${userID}`, {
                method: 'PATCH',
                referrerPolicy: "no-referrer",
                headers: {
                    'Accept': 'application/json',
                    'x-access-token': `${app.user?.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                throw new Error((await response.json()).error)
            }

            return await response.json()
        } catch (e) {
            throw e
        }
    }

    static async deleteUser(app: Application, userID: string) {
        try {
            const response = await app.initiateNetworkRequest(`/admin/persons/persons/${userID}`, {
                method: 'DELETE',
                referrerPolicy: "no-referrer",
                headers: {
                    'Accept': 'application/json',
                    'x-access-token': `${app.user?.token}`,
                },
            })
            if (!response.ok) {
                throw new Error((await response.json()).error)
            }

            return await response.json()
        } catch (e) {
            throw e
        }
    }
}