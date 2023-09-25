import { Client, Message, MessageMedia } from "whatsapp-web.js";
import db from "./db";
import fs from "fs";
import callStrapi from "./gql/callStrapi";

export class Session {
  message: Message;
  client: Client;
  waiting: string;
  m: string;

  constructor(message: Message, client: Client) {
    this.message = message;
    this.client = client;
    this.waiting = db.exists(`.${message.from}.waiting`)
      ? db.getData(`.${message.from}.waiting`)
      : "start";
    this.m = message.body.toLowerCase();
  }

  send = (m: string | MessageMedia, timeout?: number) => {
    const f = () => this.client.sendMessage(this.message.from, m);
    timeout ? setTimeout(f, timeout) : f();
  };

  waitingFor = (waiting: string) =>
    db.push(`.${this.message.from}.waiting`, waiting);

  checkImage = async (): Promise<boolean> => {
    if (this.message.hasMedia) {
      const { mimetype, filesize, data } = await this.message.downloadMedia();
      if (mimetype === "image/jpeg" && filesize && filesize < 5_000_000) {
        return true;
      }
      this.send("Wrong image format or too big!");
      return false;
    }
    return false;
  };

  sendMenu = () => {
    this.send("Type one of commands: *on* / *off* / *mute* / *new* / *human*");
  };

  sendImage = (name: string) => {
    const exampleImage = fs.readFileSync(`./src/public/${name}.jpg`, "base64");
    const media = new MessageMedia("image/jpg", exampleImage);
    this.send(media);
  };

  uploadImage = (file: any) => {};
}
