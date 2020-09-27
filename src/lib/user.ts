export class User {
    firstName
    lastname
    role: 'player' | 'manager' | 'superadmin'
    token?:string

    constructor(data) {
        this.role = data.role
    }

    login(username,password){

    }
}