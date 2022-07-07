import { Network } from "app/coreLayer/networking";
import Axios, { AxiosRequestConfig } from "axios";
import { cookie } from "app/businessLogicLayer/config/memory";
import { fullRedirect } from "app/coreLayer/redirect";
import axios from "axios";
import memory from "app/utils/memory";
import { notification } from "antd";

const config: AxiosRequestConfig = {
  timeout: 30000,
  headers: { "Content-Type": "application/json" }
};

const instance = new Network(config);

instance.addRequestInterceptor(config => {
  if (!config.headers["Content-Type"])
    config.headers["Content-Type"] = "application/json";
  return config;
});

instance.addRequestInterceptor(
  function(config) {
    config.headers["Authorization"] = `Bearer ${memory.get("token")}`;
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

let isAlreadyFetchingAccessToken = false;
let subscribers: Array<(token: string) => void> = [];

const onAccessTokenFetched = (accessToken: string) => {
  subscribers = subscribers.filter(callback => callback(accessToken));
};

const addSubscriber = (callback: (token: string) => void) => {
  subscribers.push(callback);
};

const refreshToken = () => {
  let formData = new FormData();
  formData.set("refresh_token", cookie.read("refresh_token"));
  formData.set("grant_type", "refresh_token");
  return axios.post("/agreements/uaa/oauth/token", formData, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa("web_app:changeit")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

instance.addResponseInterceptor(
  function(response) {
    return response;
  },
  async error => {
    const lastUrl = window.location.pathname
    let config = error.config;
    let status = (error.response && error.response.status) || 0;
    const originalRequest = config;
    if (status === 401) {
      if (!isAlreadyFetchingAccessToken) {
        isAlreadyFetchingAccessToken = true;
        try {
          let response = await refreshToken();
          if (response.status < 400) {
            isAlreadyFetchingAccessToken = false;
            onAccessTokenFetched(response.data.accessToken);
          } else {
            fullRedirect("/signin");
          }
        } catch (error) {
          fullRedirect("/signin");
        }
      }
      return new Promise(resolve => {
        addSubscriber(accessToken => {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          resolve(axios(originalRequest));
        });
      });
    } else if (status === 403) {
      notification["error"]({
        message: "У вас недостаточно прав для просмотра этой страницы",
      });
      if(lastUrl.includes('/main/monitoring/companies')){
        sessionStorage.setItem('lastUrl', lastUrl)
        fullRedirect('/main/monitoring/companies/confirmation')
      }
      else
      {
        notification["error"]({
          message: "У вас недостаточно прав для просмотра этой страницы",
        });
        fullRedirect("/signin");}
      // fullRedirect('/errors/403')
    } else if (status === 500) {
      notification['error']({
        message: "Ошибка",
        description: error.response.data.detail || error.response.data.title
      });
    }
    return Promise.reject(error);
  }
);

Axios.prototype.makeQueryParams = (filter: any) => {
  if (!filter) return "";
  let firstTime = true;
  return Object.keys(filter)
    .map(key => {
      if (filter[key] !== undefined && String(filter[key]) !== "") {
        let result = `${firstTime ? "?" : "&"}${key}=${filter[key]}`;
        firstTime = false;
        return result;
      } else {
        return undefined;
      }
    })
    .filter(item => !!item)
    .join("");
};

export default instance;
