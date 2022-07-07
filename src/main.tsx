import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { ConfigProvider } from 'antd';
import locale from 'antd/es/locale/ru_RU';

import { App } from "./app";
import "antd/dist/antd.less";
import "./styles/styles.css";
import "./styles/ant-redefine-styles.scss";
import "./styles/main.scss";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

ReactDOM.render(
  <MuiThemeProvider theme={createMuiTheme()}>
    <Router history={createBrowserHistory()}>
      <ConfigProvider locale={locale}>
        <App />
      </ConfigProvider>
    </Router>
  </MuiThemeProvider>,
  document.getElementById("root")
);
