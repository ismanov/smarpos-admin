import * as React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import MainApp from "app/presentationLayer/main";
import NotFound from "./presentationLayer/error/notFound";
import Forbidden from "./presentationLayer/error/forbidden";
import InternalError from "./presentationLayer/error/internal";
import SignIn from "app/presentationLayer/signin";
import NotificationSystem from "react-notification-system";
export let notificationSystem: React.RefObject<NotificationSystem>;

export const App = () => {
  notificationSystem = React.useRef(null);
  return (
    <div className="app">
      <NotificationSystem ref={notificationSystem} />
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/main" />} />
        <Route path="/main" component={MainApp} />
        <Route exact path="/signin" component={SignIn} />
        <Route path="/errors">
          <Route path="/errors/403" component={Forbidden} />
          <Route path="/errors/500" component={InternalError} />
        </Route>
        <Route path="" component={NotFound} />
      </Switch>
    </div>
  );
};
