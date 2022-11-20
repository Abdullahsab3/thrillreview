import {User} from './userManagement/User'

export function fetchUserFromLocalStorage(): User | null {
    const savedUser: string | null = localStorage.getItem("user")
    if (savedUser) {
        const found = JSON.parse(savedUser as string)
        return new User(found.username, found.id);
    } else {
        return null;
    }
}

export function setUserInLocalstorage(user: User): void {
    localStorage.setItem('user', '{"username": ' + `"${user.username}"` + ', "id": ' + user.id + '}')

}