import Axios from "axios";
import { backendServer } from "../helpers";

class User {
  username: string;
  id: number;

  constructor(username: string, id: number) {
    this.username = username;
    this.id = id;
  }
}

async function getUsername(
  id: number,
  getRes: (error: string | null, username: string | null) => void,
) {
  Axios.get(backendServer(`/user/${id}/username`)).then((res) => {
    getRes(null, res.data.username);
  }).catch(function (error: any) {
    getRes(error.response.data.username, null);
  });
}

async function getuserEmail(getRes: (email: string) => void) {
  const res = await Axios.get(backendServer("/user/email"));
  getRes(res.data.email);
}

function userAvatarExists(id: number, getRes: (exists: boolean) => void) {
  Axios.get(backendServer(`/user/${id}/avatar/exists`)).then((res) => {
    getRes(res.data.avatar)
  }).catch((error)  => {
    getRes(false)
  })

}

export { getuserEmail, getUsername, User, userAvatarExists };
