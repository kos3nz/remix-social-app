import { renderToString } from 'react-dom/server';
import { RemixServer } from 'remix';
import type { EntryContext } from 'remix';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set('Content-Type', 'text/html');

  // Since headers function does not work in root.tsx for some reason, set headers for all routes here.
  // Tell the client the server accepts the `Sec-CH-Prefers-Color-Scheme` client hint…
  responseHeaders.set('Accept-CH', 'Sec-CH-Prefers-Color-Scheme');
  // …and that the server's response will vary based on its value…
  responseHeaders.set('Vary', 'Sec-CH-Prefers-Color-Scheme');
  // …and that the server considers this client hint a _critical_ client hint.
  responseHeaders.set('Critical-CH', 'Sec-CH-Prefers-Color-Scheme');

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
