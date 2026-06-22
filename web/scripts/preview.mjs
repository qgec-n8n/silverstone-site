#!/usr/bin/env node

import { createServer } from "node:http";
import path from "node:path";
import process from "node:process";
import sirv from "sirv";

function readPort(argumentsList) {
  const portIndex = argumentsList.indexOf("--port");
  const candidate = portIndex >= 0 ? argumentsList[portIndex + 1] : process.env.PORT;
  const port = Number(candidate ?? 4173);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`Invalid preview port: ${candidate ?? "<empty>"}`);
  }

  return port;
}

const port = readPort(process.argv.slice(2));
const host = "0.0.0.0";
const serve = sirv(path.resolve("build/client"), {
  etag: true,
});

const server = createServer((request, response) => {
  response.setHeader(
    "X-Robots-Tag",
    process.env.VITE_X_ROBOTS_TAG ?? "noindex,nofollow,noarchive",
  );
  serve(request, response);
});

server.listen(port, host, () => {
  console.log(`Staging preview: http://${host}:${port}`);
});
