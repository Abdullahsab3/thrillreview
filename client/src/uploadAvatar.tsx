import React, { SetStateAction, useState } from 'react';
import Axios from 'axios'
import { User } from './User'
import { fetchUserFromLocalStorage, setUserInLocalstorage } from './localStorageProcessing'
import CardWithImageUpload from './cardWithImageUpload';
import { Link, useNavigate } from 'react-router-dom';
import { backendServer } from './helpers'
import { usePromiseTracker, trackPromise } from "react-promise-tracker";


export default function ChangeAvatar() {
    const navigate = useNavigate()

    const { promiseInProgress } = usePromiseTracker()
    const savedUser: User | null = fetchUserFromLocalStorage();
    const [validated, setValidated] = useState(false)


    function checkForErrors(data: any, setFileError: React.Dispatch<SetStateAction<string>>): boolean {
        if (data.error) {
            const avatarError: string = data.error.avatar
            if (avatarError) {
                setFileError(avatarError);
            } else {
                setFileError(data.error)
            }
            return true;

        } else {
            return false
        }
    }

    function sendAvatar(uploadedFile: File | null, setFileError: React.Dispatch<SetStateAction<string>>): React.FormEventHandler<HTMLFormElement> {
        const sendAvatar: React.FormEventHandler<HTMLFormElement> =
            (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                if (uploadedFile) {
                    const formData = new FormData();
                    formData.append('avatar', uploadedFile)
                    trackPromise(
                        Axios.post(backendServer("/change-avatar"), formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }).then((res) => {
                            if (checkForErrors(res.data, setFileError)) {
                                setValidated(false)
                            } else {
                                setValidated(true);
                                navigate("/profile")
                            }
                        })
                    )
                }
            }
        return sendAvatar;
    }


    if (savedUser) {

        return (
            <div className='col d-flex justify-content-center'>
                <CardWithImageUpload
                    title="Change your avatar"
                    description="Drag and drop your avatar image here or choose a file to upload"
                    onSubmit={sendAvatar}
                    
                    serverValidated={validated}
                    imageMaxSize={8 * 1024 * 1024}
                    imageWidth={360}
                    imageHeight={360}
                    promiseInProgress={promiseInProgress} />
            </div>
        );
    } else {
        return (
            <div className='changeAvatar'>
                In order to change your avatar, you have to <Link to="/Login">Log in first</Link>
            </div>
        )
    }
}