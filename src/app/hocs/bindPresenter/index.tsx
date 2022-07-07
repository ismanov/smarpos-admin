import React from "react";
import { BasePresenter } from "app/coreLayer/presenter";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { notificationSystem } from "app/index";

export function bindPresenter<STATE, T extends BasePresenter<STATE>>(
  type: { new (props?: RouteComponentProps, state?: STATE): T },
  Component: React.ComponentType<{ presenter: T; model: STATE }>
) {
  return withRouter(
    class extends React.Component<RouteComponentProps & any, STATE> {
      presenter: T;
      constructor(props) {
        super(props);
        this.presenter = new type(props, this.state);
        this.presenter.updateModel = this.updateModel.bind(this);
      }

      updateModel(state: STATE, callback?: () => void) {
        this.setState({ ...this.state, ...state }, callback);
      }

      componentDidMount() {
        this.presenter.notification = notificationSystem.current;
        this.presenter && this.presenter.mount();
      }

      componentWillUnmount(): void {
        this.presenter && this.presenter.unmount();
      }

      render() {
        return (
          <Component
            {...this.props}
            presenter={this.presenter}
            model={{ ...this.state }}
            />
        );
      }
    }
  );
}
