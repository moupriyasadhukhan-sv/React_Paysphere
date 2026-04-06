import * as signalR from "@microsoft/signalr";
import { api } from "../http";
import { store } from "../../stores/store";

let connection = null;

export function buildNotificationsHub() {
  if (connection) return connection; // 🔥 prevent recreating hub

  const base = api?.defaults?.baseURL?.replace(/\/+$/, "") || "";
  const url = `${base}/hubs/notifications`;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(url, {
      accessTokenFactory: () => store.getState().auth.accessToken // 🔥 always latest token
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  return connection;
}

export function getConnection() {
  return connection;
}