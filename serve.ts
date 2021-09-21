import { sample } from "https://deno.land/std@0.107.0/collections/sample.ts";

const omikujis = ([
  Deno.env.get("おみくじ1"),
  Deno.env.get("おみくじ2"),
  Deno.env.get("おみくじ3"),
  Deno.env.get("おみくじ4"),
].filter((v) => v) as string[]).map(escapeHTML);
const sentence = Deno.env.get("文章");

function escapeHTML(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getOmikuji() {
  const result = sample(omikujis) ?? "おみくじが空でした。"; //length===0
  return `<h1>${
    sentence?.includes("%おみくじ%")
      ? sentence.replaceAll("%おみくじ%", result)
      : result
  }</h1>
  このおみくじは<a href="https://github.com/ayame113/omikuji_deploy">https://github.com/ayame113/omikuji_deploy</a>から作成されました。`;
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
      continue;
    }
    event.respondWith(
      new Response('404 Not Found <a href="/">top</a>', {
        status: 404,
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      }),
    );
  }
}

for await (const conn of Deno.listen({ port: 80 })) {
  handleHttp(conn);
}
