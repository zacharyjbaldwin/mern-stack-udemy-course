import React, { useState } from "react";
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";

import './Auth.css';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";

const Auth = (props) => {

    const [isLogin, setIsLogin] = useState(true);

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        },
    }, false);

    const submitHandler = (event) => {
        event.preventDefault();
        console.log(formState);
    };

    const switchModeHandler = (event) => {
        if (!isLogin) {
            setFormData({ ...formState.inputs, name: undefined }, formState.inputs.email.isValid && formState.inputs.password.isValid);
        } else {
            setFormData({...formState.inputs, name: { value: '', isValid: false }}, false)
        }
        setIsLogin((prevMode) => !prevMode);
    };

    return (
        <Card className="authentication">
            <h2>Login Required</h2>
            <hr />
            <form onSubmit={submitHandler}>
                {!isLogin && <Input element="input" id="name" type="text" label="Your Name" validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a name." onInput={inputHandler} />}
                <Input
                    id="email"
                    element="input"
                    type="email"
                    label="Email"
                    validators={[VALIDATOR_EMAIL()]}
                    errorText="Please enter a valid email address."
                    onInput={inputHandler}
                />
                <Input
                    id="password"
                    element="input"
                    type="password"
                    label="Password"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a password of length > 4."
                    onInput={inputHandler}
                />
                <Button
                    type="submit"
                    disabled={!formState.isValid}
                >{isLogin ? 'LOGIN' : 'SIGNUP'}</Button>
            </form>

            <Button inverse onClick={switchModeHandler}>SWITCH TO {isLogin ? 'SIGNUP' : 'LOGIN'}</Button>
        </Card>
    );
};

export default Auth;