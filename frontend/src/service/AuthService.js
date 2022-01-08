import axios from 'axios';

export class AuthService {

    signIn(signInData) {
        return axios.get('assets/demo/data/loginData.json').then(res => res.data.data.find(user => signInData.username === user.username));
    }

}