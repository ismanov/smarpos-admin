import { BasePresenter } from "app/coreLayer/presenter";
import Repository from "app/businessLogicLayer/repo";
import memory from "app/utils/memory";

export type AuthStates = {
  validForm: boolean;
};

export class AuthPresenter extends BasePresenter<AuthStates> {
  signIn(login, password) {
    Repository.auth
      .signIn(login, password)
      .then(auth => {
        memory.set("token", auth.access_token);
        this.router && this.router.fullRedirect("/main/dashboard");
      })
      .catch(error => {
        this.error(error.toString());
      });
  }

  checkForm(username?: string, password?: string) {
    this.updateModel &&
      this.updateModel({
        validForm: !username || username.length < 4 || !password || password.length < 4
      });
  }
}
