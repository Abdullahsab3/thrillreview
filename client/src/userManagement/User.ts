import Axios from "axios";
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

async function getuserAvatar(
    id: number,
  getRes: (avatar: string) => void,
) {
  const res = await Axios({
    method: "get",
    responseType: "blob",
    url: backendServer(`/user/${id}/avatar`)
  });
  let reader = new window.FileReader();
  reader.readAsDataURL(res.data);
  reader.onload = function () {
    let imageDataUrl = reader.result;
    //console.log(imageDataUrl);
    getRes(imageDataUrl as string);
  };
}

export {getUsername, getuserAvatar, getuserEmail, User };
