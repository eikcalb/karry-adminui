import { Application } from "."

export const AD_PAGE_LIMIT = 20
export const Status = {
    ACTIVE: 1,
    INACTIVE: 0
}

export interface IAd {
    id
    mediaURL
    thumbnailURL?: string
    link: string
    type: string
    title: string
    viewCount: number
    clickCount: number
    creator
    status: number
    credit?: number
    endTime?: number
    createdAt
    updatedAt
}

export class Ad {
    static async getAds(app: Application, page = 1, pageLimit = AD_PAGE_LIMIT): Promise<IAd[]> {
        try {
            const response = await app.initiateNetworkRequest(`/admin/ads?pageNo=${page}&pageLimit=${pageLimit}`, {
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

    static async handleRequest(app: Application, id: string, approved) {
        try {
            if (!approved && approved !== false) {
                throw new Error("Kindly specify action!")
            }
            const response = await app.initiateNetworkRequest(`/admin/ads/${id}/handle`, {
                method: 'POST',
                referrerPolicy: "no-referrer",
                headers: {
                    'Accept': 'application/json',
                    'x-access-token': `${app.user?.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ approved })
            })
            if (!response.ok) {
                throw new Error((await response.json()).error)
            }

            return true
        } catch (e) {
            throw e
        }
    }

    static async deleteAd(app: Application, id: string) {
        try {
            const response = await app.initiateNetworkRequest(`/admin/ads/${id}`, {
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