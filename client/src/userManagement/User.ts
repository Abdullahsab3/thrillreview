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
  Axios.post("/get-username", {
    id: id,
  }).then((res) => {
    if (res.data.error) {
      getRes(res.data.username, null);
    } else {
      getRes(null, res.data.username);
    }
  }).catch(function (error: any) {
    getRes(error.response.data, null);
  });
}

// TODO: zorg voor de error handling
async function getuserEmail(getRes: (email: string) => void) {
  const res = await Axios.post(backendServer("/profile"));
  getRes(res.data.email);
}

async function getuserAvatar(
    id: number,
  getRes: (avatar: string) => void,
) {
  const res = await Axios({
    method: "post",
    responseType: "blob",
    url: backendServer("/get-avatar"),
    data: {id: id}
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
