import { clients } from "./main.js";

const paramsUrl = new URLSearchParams(window.location.search);
console.log(paramsUrl);
const url = paramsUrl.get("id");
console.log(url);
