import instance from "app/businessLogicLayer/config/api";
import { User } from "app/businessLogicLayer/models/User";
import axios from 'axios';

interface AuthRepo {
  signIn(username, password): Promise<Auth>;
  fetchCurrentUser(username, password): Promise<User>;
}

class AuthRepoImpl implements AuthRepo {

  signIn(username, password): Promise<Auth> {
    return new Promise<Auth>((resolve, reject) => {
      let i = axios.create({timeout: 30000});
      i.post("/api/login", {
          username,
          password,
          rememberMe: true
        }).then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    });
  }
  fetchCurrentUser(): Promise<User> {
    return instance.httpGet<User>("/api/account");
  }
}


export default AuthRepoImpl;
