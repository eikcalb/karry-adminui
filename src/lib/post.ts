import { Application } from "."

export const POSTS_PAGE_LIMIT = 20

export function computeCount(v: number) {
    const suffices = 'KMBT'
    var base = Math.floor(Math.log(Math.abs(v)) / Math.log(1000));
    var suffix = suffices[Math.min(3, base - 1)];
    base = suffices.indexOf(suffix) + 1;
    if (suffix) {
        const precision = Math.pow(10, 2)
        return Math.round((v / Math.pow(1000, base)) * precision) / precision + suffix
    } else {
        return v;
    }
}

export class Post {
    id
    title
    mediaURL
    thumbnailURL
    viewCount = 0
    // 'image' | 'video'
    type
    uploadTime
    owner
    like: number = 0
    dislike: number = 0

    static async getAllPosts(app: Application, page = 1, pageLimit = POSTS_PAGE_LIMIT): Promise<Post[]> {
        try {
            const response = await app.initiateNetworkRequest(`/admin/posts/posts?pageNo=${page}&pageLimit=${pageLimit}`, {
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

    static async updatePost(app: Application, postID: string, title): Promise<Post> {
        try {
            const response = await app.initiateNetworkRequest(`/admin/posts/posts/${postID}`, {
                method: 'PATCH',
                referrerPolicy: "no-referrer",
                headers: {
                    'Accept': 'application/json',
                    'x-access-token': `${app.user?.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title })
            })
            if (!response.ok) {
                throw new Error((await response.json()).error)
            }

            return await response.json()
        } catch (e) {
            throw e
        }
    }

    static async deletePost(app: Application, postID: string) {
        try {
            const response = await app.initiateNetworkRequest(`/admin/posts/posts/${postID}`, {
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