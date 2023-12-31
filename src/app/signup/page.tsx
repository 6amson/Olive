'use client';

import style from '../styles/signup.module.scss'
import styles from '../styles/page.module.scss'
import Image from 'next/image';
import { useState, useEffect, CSSProperties } from "react";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'
import DotLoader from "react-spinners/DotLoader";

const url = "https://oliveweb3.cyclic.cloud";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "purple",
    position: 'absolute',
    top: 400,
};



export default function Signup() {

    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstname] = useState('');
    const [lastName, setLastname] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handlePasswordChange = (e: any) => {
        setPassword(e.target.value);
    };

    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
    };

    const handleFirstnameChange = (e: any) => {
        setFirstname(e.target.value);
    };

    const handleLastnameChange = (e: any) => {
        setLastname(e.target.value);
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    }

    const datum = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        password: password,
    }

    const dataP = JSON.stringify(datum)

    const handleSignup = async (e: any) => {
        e.preventDefault();

        setLoading(true);
        console.log(loading);

        axios.post(`${url}/user/signup`, dataP, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            setLoading(false);

            if (res.status == 201) {
                // console.log(res);
                router.push('/signin');
            }

        })
            .catch((err) => {
                // console.log(err.response.data);
                setLoading(false);

                if(err.response.data.statusCode == 400){
                    setError('Please fill out the fields appropraitely.')
                }else{
                    setError(err.response.data.message);
                }
                
                setTimeout(() => {
                    setError('');
                }, 3500);

            });

    };


    const handleAuth = async () => {
        const accesstoken = localStorage.getItem('token');
        const refreshtoken = Cookies.get('userAccess_TT');

        if (accesstoken && refreshtoken || accesstoken && !refreshtoken) {
            // console.log(accesstoken);
            axios.get(`${url}/user/verify`, {
                headers: {
                    'Authorization': `Bearer ${accesstoken}`
                }
            }).then((res) => {

                if (res.status == 200) {
                    // console.log(res.data);
                    const expirationTime2 = 60 * 5 * 1000;
                    const expirationTimestamp2 = new Date().getTime() + expirationTime2;
                    const expirationDate2 = new Date(expirationTimestamp2);

                    Cookies.set('userAccess_TT', res.data, { expires: expirationDate2 });
                    router.push('/meetup');
                }

            })
                .catch((err) => {
                    // console.log(err);
                    router.push('/signin');
                });

        } else if (!accesstoken && !refreshtoken) {
            router.push('/signin');
        }
    }


    return (
        <main className={style.Main}>
            <div className={styles.description}>
                <p onClick={handleAuth}>
                    Get started
                </p>
                <div>
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Olive
                        <Image
                            src="/leafcom.svg"
                            alt="Vercel Logo"
                            className={styles.vercelLogo}
                            width={50}
                            height={54}
                            priority
                        />
                    </a>
                </div>
            </div>
            <div>
                <p className={style.anchor}>Sign up with Olive</p>
                <form className={style.formDiv}>
                    <div className={style.error}>{error}</div>
                    <input onChange={handleFirstnameChange} type="text" id="fname" name="name" required placeholder='firstname' />
                    <input onChange={handleLastnameChange} type="text" id="lname" name="name" required placeholder='secondname' />
                    <input onChange={handleEmailChange} required type='email' id='email' name='email' placeholder='email' />
                    <input onChange={handlePasswordChange} required type={showPassword ? "text" : "password"} id="pswrd" name="pswrd" placeholder='password' />
                    <input
                        id='showP'
                        type="checkbox"
                        checked={showPassword}
                        onChange={handleTogglePassword}
                    />
                    <button onClick={handleSignup} disabled={loading} type="submit">Submit</button>
                </form>
                <p className={style.alt}>Have an account? <a href='/signin'>login</a></p>
            </div>

            <DotLoader
                color='#e281e2'
                loading={loading}
                cssOverride={override}
                size={150}
                aria-label="Loading Spinner"
                data-testid="loader"
            />

            <div className={style.center}></div>
        </main>
    )
}