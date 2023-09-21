!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).WebSocketFront=e()}(this,(function(){"use strict";var t;!function(t){t[t.CONNECTING=0]="CONNECTING",t[t.OPEN=1]="OPEN",t[t.CLOSING=2]="CLOSING",t[t.CLOSED=3]="CLOSED"}(t||(t={}));class e{url;opts;ws=null;_reconnectTimer=null;_manualClose=!1;_repeat=1/0;_lockReconnect=!1;_heartbeatTimer=null;_pongTimer=null;constructor(t,e){this.url=t,this.opts={protocols:e?.protocols??[],isReconnect:e?.isReconnect??!0,onMessage:e?.onMessage,onError:e?.onError,onClose:e?.onClose,reconnectTimeout:e?.reconnectTimeout??300,reconnectRepeat:e?.reconnectRepeat??3,isHeartbeat:e?.isHeartbeat??!0,pingMsg:e?.pingMsg??"ping",pingTimeout:e?.pingTimeout??3e4,pongTimeout:e?.pongTimeout??300},this._init()}_init=()=>{this._reconnectTimer=null,this._manualClose=!1,this._lockReconnect=!1,this._heartbeatTimer=null,this._pongTimer=null,this._resetReconnect(),this._resetHeartbeat(),this._connect(),this._onopen(),this._onmessage(),this._onerror(),this._onclose()};_connect=()=>{this.ws=new WebSocket(this.url)};_onopen=()=>{this.ws&&(this.ws.onopen=t=>{this._checkHeartbeat(),this._repeat=0,"function"==typeof this.opts?.onOpen&&this.opts.onOpen(t)})};_onmessage=()=>{this.ws&&(this.ws.onmessage=t=>{this._checkHeartbeat(),"function"==typeof this.opts?.onMessage&&this.opts.onMessage(t)})};_onerror=()=>{this.ws&&(this.ws.onerror=t=>{this._reconnect(),"function"==typeof this.opts?.onError&&this.opts.onError(t)})};_onclose=()=>{this.ws&&(this.ws.onclose=t=>{this.opts.isReconnect&&!this._manualClose?this._reconnect():this.ws?.close(),"function"==typeof this.opts?.onClose&&this.opts.onClose(t)})};_reconnect=()=>{this._resetHeartbeat(),!this.ws||!this.opts.isReconnect||this._lockReconnect||Number(this.opts?.reconnectRepeat)<=this._repeat||this._manualClose||(this._lockReconnect=!0,this._repeat++,this._reconnectTimer=setTimeout((()=>{this._init(),this._lockReconnect=!1}),this.opts?.reconnectTimeout))};_resetReconnect=()=>{this._reconnectTimer&&clearTimeout(this._reconnectTimer)};_checkHeartbeat=()=>{this._resetHeartbeat(),this._startHeartbeat()};_resetHeartbeat=()=>{this._heartbeatTimer&&clearTimeout(this._heartbeatTimer),this._pongTimer&&clearTimeout(this._pongTimer)};_startHeartbeat=()=>{this.opts.isHeartbeat&&(this._heartbeatTimer=setTimeout((()=>{this.ws&&this.ws.readyState===t.OPEN?this.ws.send(this.opts.pingMsg):this.ws?.close(),this._pongTimer=setTimeout((()=>{this.ws?.close()}),this.opts.pongTimeout)}),this.opts.pingTimeout))};send=e=>{if(this.ws){if(this.ws.readyState===t.CONNECTING){const s=setInterval((()=>{this.ws&&(this.ws.readyState===t.OPEN&&this.ws?.send(e),this.ws.readyState!==t.CONNECTING&&clearInterval(s))}),100)}this.ws.readyState===t.OPEN&&this.ws?.send(e)}};close=()=>{this._manualClose=!0,this.ws?.close()}}return"undefined"!=typeof window&&(window.Socket=e),e}));
