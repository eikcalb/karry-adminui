import { Application } from "."

export const UNINVERSITY_PAGE_LIMIT = 20

export interface IUniversity {
    id: string
    name: string
    description: string
    profileImageURL: string
    creator
}
export class University {
    static async getAllUniversities(app: Application, page = 1, pageLimit = UNINVERSITY_PAGE_LIMIT): Promise<IUniversity[]> {
        try {
            const response = await app.initiateNetworkRequest(`/admin/universities?pageNo=${page}&pageLimit=${pageLimit}`, {
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

    static async createUniversity(app: Application, { name, description }, file: File): Promise<IUniversity> {
        try {
            if (!name || !description) {
                throw new Error('Provide a useful anme and description for this university!')
            }

            if (!file || file.size > 10 * (1024 * (1024))) {
                throw new Error('Provide a file less than 10MB!')
            }

            const body = new FormData()
            body.append('data', file)
            body.append('name', name)
            body.append('description', description)

            const response = await app.initiateNetworkRequest(`/admin/universities`, {
                method: 'POST',
                referrerPolicy: "no-referrer",
                headers: {
                    'Accept': 'application/json',
                    'x-access-token': `${app.user?.token}`,
                    // "Content-Type": 'multipart/form-data',
                },
                body
            })
            if (!response.ok) {
                throw new Error((await response.json()).error)
            }

            return await response.json()
        } catch (e) {
            throw e
        }
    }

    static async updateUniversity(app: Application, id: string, data, file?: File): Promise<IUniversity> {
        try {
            if (!data.name || !data.description) {
                throw new Error('Provide a useful anme and description for this university!')
            }
            const headers = {
                'Accept': 'application/json',
                'x-access-token': `${app.user?.token}`,
            }
            let body
            if (file) {
                if (file.size > 10 * (1024 * (1024))) {
                    throw new Error('Provide a file less than 10MB!')
                }

                body = new FormData()
                body.append('data', file)
                body.append('name', data.name)
                body.append('description', data.description)

            } else {
                headers['Content-Type'] = 'application/json'
                body = JSON.stringify(data)
            }
            const response = await app.initiateNetworkRequest(`/admin/universities/${id}`, {
                method: 'PATCH',
                referrerPolicy: "no-referrer",
                headers,
                body
            })
            if (!response.ok) {
                throw new Error((await response.json()).error)
            }

            return await response.json()
        } catch (e) {
            throw e
        }
    }

    static async deleteUniversity(app: Application, id: string) {
        try {
            const response = await app.initiateNetworkRequest(`/admin/universities/${id}`, {
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

            return true
        } catch (e) {
            throw e
        }
    }

    static async handleRequest(app: Application, id: string, { player, approved }) {
        try {
            if (!player || (!approved && approved !== false)) {
                throw new Error("Kindly provide player and specify action!")
            }
            const response = await app.initiateNetworkRequest(`/admin/universities/${id}/request`, {
                method: 'POST',
                referrerPolicy: "no-referrer",
                headers: {
                    'Accept': 'application/json',
                    'x-access-token': `${app.user?.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ player, approved })
            })
            if (!response.ok) {
                throw new Error((await response.json()).error)
            }

            return true
        } catch (e) {
            throw e
        }
    }

    static async getRequests(app: Application, id: string) {
        try {
            const response = await app.initiateNetworkRequest(`/admin/universities/${id}/request`, {
                method: 'GET',
                referrerPolicy: "no-referrer",
                headers: {
                    'Accept': 'application/json',
                    'x-access-token': `${app.user?.token}`,
                },
            })
            if (!response.ok) {
                throw new Error((await response.json()).error)
            }

            return response.json()
        } catch (e) {
            throw e
        }
    }

    static async deleteRequest(app: Application, id: string, player) {
        try {
            const response = await app.initiateNetworkRequest(`/admin/universities/${id}/request/${player}`, {
                method: 'DELETE',
                referrerPolicy: "no-referrer",
                headers: {
                    'Accept': 'application/json',
                    'x-access-token': `${app.user?.token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                throw new Error((await response.json()).error)
            }

            return true
        } catch (e) {
            throw e
        }
    }
    
    static async getPlayers(app: Application, id: string) {
        try {
            const response = await app.initiateNetworkRequest(`/admin/universities/${id}/player`, {
                method: 'GET',
                referrerPolicy: "no-referrer",
                headers: {
                    'Accept': 'application/json',
                    'x-access-token': `${app.user?.token}`,
                },
            })
            if (!response.ok) {
                throw new Error((await response.json()).error)
            }

            return response.json()
        } catch (e) {
            throw e
        }
    }

    static async deletePlayer(app: Application, id: string,player) {
        try {
            const response = await app.initiateNetworkRequest(`/admin/universities/${id}/${player}`, {
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

            return true
        } catch (e) {
            throw e
        }
    }

}