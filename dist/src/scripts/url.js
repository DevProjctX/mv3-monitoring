"use strict";export class Url{constructor(t){if(t instanceof URL)h=t;else{if("string"!=typeof t)return this.href=t.href,this.host=t.host,void(this.path=t.path);-1===t.indexOf("//")&&(t=t)}var h=new URL(t);this.href=h.href,this.host=h.hostname,this.path="/"===h.pathname?"":h.pathname}isMatch(t){if(!t)return!1;try{t=t instanceof Url?t:new Url(t)}catch{return!1}return this.isHostMatch(t.host)&&this.isPathMatch(t.path)}isHostMatch(t){if(t===this.host)return!0;var h=this.host.split(".").reverse(),s=t.split(".").reverse();return h.every(((t,h)=>s[h]===t))}isPathMatch(t){return""===this.path||t===this.path||0===t.indexOf(this.path)}getId(){return this.host+this.path.replace(/\//g,"-")}toString(){return this.host+this.path}}