package main

import (
	"fmt"
	"html"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

const maxProxyBytes = 8 << 20

const bridgeScript = `<script>(function(){var send=function(m){m.webide=1;parent.postMessage(m,'*')};
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');
if(!a||e.defaultPrevented||/^(javascript:|mailto:|tel:|#)/.test(a.getAttribute('href')))return;
e.preventDefault();send({type:'nav',url:a.href})},true);
document.addEventListener('submit',function(e){var f=e.target;if((f.method||'get').toLowerCase()!=='get')return;
e.preventDefault();var u=new URL(f.action||document.baseURI,document.baseURI);
new FormData(f).forEach(function(v,k){u.searchParams.set(k,v)});send({type:'nav',url:u.href})},true);
window.addEventListener('load',function(){send({type:'loaded',title:document.title,url:document.baseURI})})})();</script>`

var proxyClient = &http.Client{
	Timeout: 20 * time.Second,
	CheckRedirect: func(request *http.Request, via []*http.Request) error {
		if len(via) > 8 || isPrivateHost(request.URL.Hostname()) {
			return http.ErrUseLastResponse
		}
		return nil
	},
}

func proxyHandler(w http.ResponseWriter, r *http.Request) {
	target, err := url.Parse(r.URL.Query().Get("url"))
	if err != nil || (target.Scheme != "http" && target.Scheme != "https") || isPrivateHost(target.Hostname()) {
		http.Error(w, "URL no permitida", http.StatusForbidden)
		return
	}
	request, err := http.NewRequestWithContext(r.Context(), http.MethodGet, target.String(), nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	request.Header.Set("User-Agent", r.UserAgent())
	request.Header.Set("Accept-Language", r.Header.Get("Accept-Language"))
	response, err := proxyClient.Do(request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}
	defer response.Body.Close()

	contentType := response.Header.Get("Content-Type")
	w.Header().Set("Content-Type", contentType)
	body := io.LimitReader(response.Body, maxProxyBytes)
	if !strings.Contains(contentType, "text/html") {
		w.WriteHeader(response.StatusCode)
		io.Copy(w, body)
		return
	}
	markup, _ := io.ReadAll(body)
	base := fmt.Sprintf(`<base href="%s">`, html.EscapeString(response.Request.URL.String()))
	w.WriteHeader(response.StatusCode)
	io.WriteString(w, injectHead(string(markup), base+bridgeScript))
}
