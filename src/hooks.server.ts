import { i18n } from '$lib/i18n'
import { sequence } from '@sveltejs/kit/hooks'

const localeExcludedRoutes: RegExp[] = [new RegExp("/api/.*"), new RegExp("/webring/.*|/webring")];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, HEAD",
}

const handle1: import('@sveltejs/kit').Handle = async ({ event, resolve }) => {
  const { url, request } = event;
  const { pathname } = url;

  // If domain is kukfest.eu then redirect to blalange.org
  if (url.hostname === "kukfest.eu") {
    return Response.redirect("https://blalange.org" + event.url.pathname, 301);
  }

  // If domain is www.blalange.org then redirect to blalange.org
  if (url.hostname === "www.blalange.org") {
    return Response.redirect("https://blalange.org" + event.url.pathname, 301);
  }

  const response = await resolve(event,
    {
      filterSerializedResponseHeaders: (key, value) => {
        return key.toLowerCase() === "content-type";
      },
    }
  );

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");

  // Add html `lang` attribute
  return response
};

/** @type {import('@sveltejs/kit').HandleServerError} */
export const handleError: import('@sveltejs/kit').HandleServerError = async ({ event, error }) => {
  console.error(error);
  return
};

export const handle = sequence(i18n.handle({ disableAsyncLocalStorage: true }), handle1)