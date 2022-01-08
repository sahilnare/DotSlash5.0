import React, { useState, useContext } from 'react';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from "primereact/inputtext";
// import { AuthService } from '../service/AuthService';


export const SignIn = (props) => {

    const [checked, setChecked] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // useEffect(() => {
    //     const productService = new ProductService();
    //     productService.getProductsSmall().then(data => setProducts(data));
    // }, []);

    const signInUser = (e) => {
        e.preventDefault();
        // const authService = new AuthService();
        // authService.signIn({username: username, password: password}).then(userInfo => {
        //     console.log(userInfo);
        // });

    }
    

    return (
        <div className="flex align-items-center flex-column pt-6 px-3">
            <div className="surface-card p-6 shadow-2 border-round w-full lg:w-6">
                <div className="text-center mb-5">
                    <img src="images/blocks/logos/hyper.svg" alt="hyper" height="50" className="mb-3" />
                    <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
                    <span className="text-600 font-medium line-height-3">Don't have an account?</span>
                    <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer" href="#/signup">Create today!</a>
                </div>

                <div>
                    <label htmlFor="email1" className="block text-900 font-medium mb-2">Email</label>
                    <InputText value={username} onChange={(e) => setUsername(e.target.value)} id="email1" type="text" className="w-full mb-3" />

                    <label htmlFor="password1" className="block text-900 font-medium mb-2">Password</label>
                    <InputText value={password} onChange={(e) => setPassword(e.target.value)} id="password1" type="password" className="w-full mb-3" />

                    <div className="flex align-items-center justify-content-between mb-6">
                        <div className="flex align-items-center">
                            <Checkbox inputId="rememberme1" binary className="mr-2" onChange={e => setChecked(e.checked)} checked={checked} />
                            <label htmlFor="rememberme1">Remember me</label>
                        </div>
                    </div>

                    <Button onClick={signInUser} label="Sign In" icon="pi pi-user" className="w-full" />
                </div>
            </div>
        </div>
        
    );
}
