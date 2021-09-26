import { listenAndServe } from "https://deno.land/std@0.108.0/http/server.ts";
import { sample } from "https://deno.land/std@0.107.0/collections/sample.ts";

const omikujis = [
  Deno.env.get("おみくじ1"),
  Deno.env.get("おみくじ2"),
  Deno.env.get("おみくじ3"),
  Deno.env.get("おみくじ4"),
].filter((v) => v).map(escapeHTML);
const sentence = escapeHTML(Deno.env.get("文章"));

listenAndServe(":80", (request) => {
  if (new URL(request.url).pathname === "/") {
    return new Response(getOmikuji(), {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
  return new Response('404 Not Found <a href="/">top</a>', {
    status: 404,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
});

function getOmikuji() {
  const result = sample(omikujis) ?? "おみくじが空でした。"; //length===0
  return `<h1>${
    sentence?.includes("%おみくじ%")
      ? sentence.replaceAll("%おみくじ%", result)
      : result
  }</h1>
  このおみくじは<a href="https://github.com/ayame113/omikuji_deploy">https://github.com/ayame113/omikuji_deploy</a>から作成されました。`;
}

function escapeHTML(str: string): string;
function escapeHTML(str: undefined): undefined;
function escapeHTML(str: string | undefined): string | undefined;
function escapeHTML(str?: string) {
  return str
    ?.replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
