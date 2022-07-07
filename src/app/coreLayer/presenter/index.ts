import { RouteComponentProps } from "react-router-dom";
import NotificationSystem from "react-notification-system";

interface Router {
  props?: RouteComponentProps;
  redirect(to: string);
  fullRedirect(to: string);
  goBack();
}

export class RouterImpl implements Router {
  props?: RouteComponentProps;

  constructor(props?: RouteComponentProps) {
    this.props = props;
  }

  redirect(to: string) {
    this.props?.history?.push(to);
  }

  fullRedirect(to: string) {
    window.location.pathname = to;
  }
  goBack() {
    this.props?.history?.goBack();
  }
}

export interface Presenter<T> {
  router?: Router;
  notification?: NotificationSystem;
  updateModel?: (state: T, callback?: () => void) => void;
  mount();
  unmount();
  error(msg: string);
  warn(msg: string);
  info(msg: string);
}

export class BasePresenter<T> implements Presenter<T> {

  router?: Router;
  notification?: NotificationSystem;
  updateModel?: (state: T, callback?: () => void) => void;


  constructor(props?: RouteComponentProps, state?: T) {
    this.router = new RouterImpl(props);
    this.onConstruct();
  }

  onConstruct() {}

  mount() {}

  unmount() {}

  error(msg: string) {
    this.notification.addNotification({ message: msg, level: "error" });
  }
  info(msg: string) {
    this.notification.addNotification({ message: msg, level: "info" });
  }
  warn(msg: string) {
    this.notification.addNotification({ message: msg, level: "warning" });
  }
  success(msg: string) {
    this.notification.addNotification({ message: msg, level: "success" });
  }
}
