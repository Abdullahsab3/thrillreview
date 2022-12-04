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

// vreemde bug hier: ik catch de error maar hij wordt door de browser toch gedisplayed (aka niet gecatcht)
function getuserAvatar(
  id: number,
  getRes: (error: string | null, avatar: string | null) => void,
) {
  Axios.get(backendServer(`/user/${id}/avatar`), { responseType: "blob", validateStatus: function(status) {return status < 500} }).then(
    (res) => {
      if(res.status == 404) {
        getRes("No user avatar available", null)
      } else if (res.data) {
        let reader = new window.FileReader();
        reader.readAsDataURL(res.data);
        reader.onload = function () {
          let imageDataUrl = reader.result;
          getRes(null, imageDataUrl as string);
        };
      }
    },
  ).catch((error: AxiosError) => {
    console.log(error.response?.status);
    getRes("An error occured when trying to retrieve the avatar", null);
  });
}

export { getuserAvatar, getuserEmail, getUsername, User };
