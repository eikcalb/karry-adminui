export class User {
    firstName
    lastName
    role: 'player' | 'manager' | 'superadmin'
    email: string
    token?: string

    constructor(data) {
        this.role = data.role
        this.firstName = data.firstName
        this.lastName = data.lastName
        this.email = data.email
        this.token = data.token
    }

    login(username, password) {

    }
}