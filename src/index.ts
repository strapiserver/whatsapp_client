import qrcode from "qrcode-terminal";
import {
  Buttons,
  Client,
  List,
  LocalAuth,
  Location,
  MessageMedia,
} from "whatsapp-web.js";
import { Session } from "./session";
import startReminder from "./startReminder";
import { coordinatesRegex } from "./helper";

const client = new Client({
  authStrategy: new LocalAuth(),
  // proxyAuthentication: { username: 'username', password: 'password' },
  puppeteer: {
    // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
    //headless: false,
  },
});
//https://wa.me/79626876107?text=start
// check image metadata or compare to previous
// add users via QR code or link
// create multiple visitkas!

client.initialize();
startReminder();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

client.on("ready", () => {
  console.log("Client is ready!");
});

/////////////

client.on("message", async (message) => {
  const session = new Session(message, client);
});
