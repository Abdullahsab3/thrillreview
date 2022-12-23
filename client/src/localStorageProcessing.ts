import {User} from './userManagement/User'

/**
 * get the user from the locat storage
 * 
 * @returns a user if it is found in the local storage
 * otherwise, null is returned
 */

export function fetchUserFromLocalStorage(): User | null {
    const savedUser: string | null = localStorage.getItem("user")
    if (savedUser) {
        const found = JSON.parse(savedUser as string)
        return new User(found.username, found.id);
    } else {
        return null;
    }
}

/**
 * Put a user in the local storage
 * @param user the user which will be saved in the local storage.
 */
export function setUserInLocalstorage(user: User): void {
    localStorage.setItem('user', '{"username": ' + `"${user.username}"` + ', "id": ' + user.id + '}')
}

export function removeUserInLocalstorage(): void {
    localStorage.removeItem('user')
}

export function loggedIn(): Boolean {
    if (fetchUserFromLocalStorage()) {
        return true;
    } else {
        return false;
    };
}