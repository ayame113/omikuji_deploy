import { sample } from "https://deno.land/std@0.107.0/collections/sample.ts";

const omikujis = [
  Deno.env.get("おみくじ1"),
  Deno.env.get("おみくじ2"),
  Deno.env.get("おみくじ3"),
  Deno.env.get("おみくじ4"),
].filter((v) => v);
const statement = Deno.env.get("文章");

function getOmikuji() {
  const result = sample(omikujis) ?? "おみくじが空でした。"; //length===0
  return `<h1>${
    statement?.includes("%おみくじ%")
      ? statement.replaceAll("%おみくじ%", result)
      : result
  }</h1>`;
}

async function handleHttp(conn: Deno.Conn) {
  for await (const event of Deno.serveHttp(conn)) {
    if (new URL(event.request.url).pathname === "/") {
      event.respondWith(
        new Response(getOmikuji(), {
          status: 200,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      );
      return;
    }
    event.respondWith(
      new Response('404 Not Found <a href="/">top</a>', {
        status: 404,
        headers: {
          "content-type": "text/plain",
        },
      }),
    );
  }
}

for await (const conn of Deno.listen({ port: 80 })) {
  handleHttp(conn);
}
