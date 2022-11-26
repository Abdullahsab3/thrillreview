import Axios, { AxiosError } from "axios";
import { SetStateAction } from "react";
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
  Axios.get(`/user/${id}/username`).then((res) => {
    getRes(null, res.data.username);
  }).catch(function (error: any) {
    getRes(error.response.data.username, null);
  });
}

// TODO: zorg voor de error handling
async function getuserEmail(getRes: (email: string) => void) {
  const res = await Axios.get(backendServer("/user/email"));
  getRes(res.data.email);
}

function getuserAvatar(
  id: number,
  getRes: (avatar: string | null) => void,
) {
  Axios.get(backendServer(`/user/${id}/avatar`), { responseType: "blob" }).then(
    (res) => {
      let reader = new window.FileReader();
      reader.readAsDataURL(res.data);
      reader.onload = function () {
        let imageDataUrl = reader.result;
        getRes(imageDataUrl as string);
      };
    },
  ).catch((error: AxiosError) => {
    console.log(error)
    getRes(null)
  });
}

export { getuserAvatar, getuserEmail, getUsername, User };
