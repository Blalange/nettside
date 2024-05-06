import PocketBase from "pocketbase";
import { getSessionId } from "./session";
import { config } from "./config";

let pb = new PocketBase("https://db.080609.xyz");
let enabled

config.subscribe(value => {
    pb = new PocketBase(value.dbEndpoint);
    enabled = value.analyticsEnabled
});

let lastValues = {
  userAgent: typeof window !== "undefined" ? "" : "",
  language: typeof window !== "undefined" ? "" : "",
  url: typeof window !== "undefined" ? "" : "",
};

let ip = "";

export { startAnalyticsMonitoring };

async function collect2() {
  if (typeof window === "undefined") return; // Exit if not in a browser environment

  if (!enabled) return; // Exit if analytics are disabled

  const userAgent = navigator.userAgent;
  const language = navigator.language;
  const unix = new Date().getTime();
  const url = window.location.href;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const networkInfo = 'unknown';
  const referrer = document.referrer;

  let username;

  if (ip == "") {
    ip = await fetch("https://blalange.org/api/ip").then((res) => res.text());
  }

  if (
    userAgent !== lastValues.userAgent ||
    language !== lastValues.language ||
    url !== lastValues.url
  ) {
    lastValues = { userAgent, language, url };

    if (pb.authStore.isValid) {
      username = pb.authStore.model.username;
    }

    return await pb.collection("kf_analytics").create({
      useragent: userAgent,
      language: language,
      unix: unix,
      url: url,
      session: getSessionId(),
      ip: ip,
      width: screenWidth,
      height: screenHeight,
      network: networkInfo,
      referrer: referrer,
      username: username,
    });
  } else {
    console.log("Collect2: Nothing has changed, not running.");
  }
}

function startAnalyticsMonitoring() {
  if (typeof window === "undefined") return; // Exit if not in a browser environment

  // Set up MutationObserver to watch for changes in the document
  const observer = new MutationObserver(async () => {
    await collect2();
  });

  observer.observe(document, { childList: true, subtree: true });

  // Set up interval to check for changes in navigator.userAgent and navigator.language
  setInterval(async () => {
    await collect2();
  }, 1000); // Check every second
}