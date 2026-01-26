"use client";

import "./login.css";
import React, {useState} from "react";
import InputCus from "@/components/input/InputCus";
import Button from "@/components/ButtonCus";
import Toast, {ToastType} from "@/components/Toast";

import {useRouter} from "next/navigation";
import axiosClient from "@/libs/axios/axios.client";
import {AxiosError} from "axios";

export default function Login() {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState<string>("")
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [toastType, setToastType] = useState<ToastType>("error")
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent)=> {
        e.preventDefault();
        if (!username || !password || !email) {
            setToastMsg("Username and password are required");
            return;
        }

        if (mode === "register" && password !== passwordConfirm) {
            setToastMsg("Passwords do not match");
            return;
        }

        try {
            setLoading(true)
            const res = await axiosClient.post("/register", {
                username: username,
                email: email,
                password: password
            });
            console.log(res)
            setToastType("success");
            setToastMsg(res.data.message);
        } catch (err) {
            setToastType("error");

            if (err instanceof AxiosError) {
                setToastMsg(
                    err.response?.data?.message
                    ?? "Something went wrong"
                );
            } else {
                setToastMsg("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setToastMsg("Username and password are required");
            return;
        }

        try {
            setLoading(true);
            const res = await axiosClient.post("/auth", {
                username: username,
                password: password
            });

            setToastType("success");
            setToastMsg(res.data.message);

            const token = res.data.data;
            sessionStorage.setItem("access_token", token);
            setToastMsg("Login success")
            setToastType("success");

            //TODO goi api 'me' va lay thong tin user de phan quyen, chuyen trang
            const response = await axiosClient.get("/me");
            const role = response.data.data.roles[0];
            switch (role) {
                case "ADMIN":
                    router.push("/admin");
                    break; //chuyen trang admin

                case "USER":
                    router.push("/");
                    break;
            }
        } catch (err) {
            setToastType("error");

            if (err instanceof AxiosError) {
                setToastMsg(
                    err.response?.data?.message
                    ?? "Something went wrong"
                );
            } else {
                setToastMsg("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="login-page d-flex justify-content-center align-items-center vh-100">
            <div className="login-box rounded">
                {/* LEFT */}
                <div className="login-image d-flex flex-column justify-content-end p-5">
                    <span className={"h3 text-white"}>Start a Life of Convenience</span>
                    <p className={"text-white mt-2"}>Join thousands of
                        Vietnamese families in upgrading their homes
                        with reliable appliances from <span className={"fw-semibold"}>An Nguyen Home</span>
                    </p>
                    <a href={"/"} className={"text-info text-end text-decoration-none"}>Go Back</a>
                </div>

                {/* RIGHT */}
                <div className="d-flex flex-column px-5 py-4">
                    <span className={"h3 fw-bolder"}>Welcome Back</span>
                    <p className={`text-muted`}>Enter details to {mode} your account.</p>
                    <div className={"d-flex justify-content-around login-tabs"}>
                        <span
                            className={`${mode === "login" && "active"}`}
                            onClick={() => setMode("login")}
                        >Login</span>
                        <span
                            className={`${mode === "register" && "active"}`}
                            onClick={() => setMode("register")}
                        >Register</span>
                    </div>
                    <hr className={`mt-0`}/>
                    <form onSubmit={mode === "register" ? handleRegister : handleLogin}>
                        <div className={"mb-3"}>
                            <label className="form-label">Username</label>
                            <InputCus
                                className={'form-control-sm'}
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        {mode === "register" &&
                            <div className={"mb-3"}>
                                <label className="form-label">Email</label>
                                <InputCus
                                    type={"email"}
                                    className={'form-control-sm'}
                                    placeholder="Enter username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        }
                        <div className={"mb-3"}>
                            <label className="form-label">Password</label>
                            <InputCus
                                className={'form-control-sm'}
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {mode === "register" && (
                            <div className={"mb-3"}>
                                <label className="form-label">Confirm password</label>
                                <InputCus
                                    className={'form-control-sm'}
                                    type="password"
                                    placeholder="Enter confirm password"
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                />
                            </div>
                        )}

                        <Button
                            type={"submit"}
                            loading={loading}
                            variant={"btn-dark"}
                            customClass={"w-100 mt-2 p-2"}
                        >{mode === "login" ? "Login" : "Register"}</Button>
                    </form>
                </div>
            </div>
            {toastMsg && (
                <Toast
                    message={toastMsg}
                    type={toastType}
                    position="top-center"
                    onClose={() => setToastMsg(null)}
                />
            )}

        </section>
    );
}
