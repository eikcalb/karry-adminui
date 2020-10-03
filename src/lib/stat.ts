import { Application } from ".";
import { User } from "./user";

export class Stat {
    static async getCount(app: Application) {
        try {
            const response = await app.initiateNetworkRequest('/admin/persons/count', {
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
}