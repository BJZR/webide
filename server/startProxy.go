package main

import (
	"log"
	"net/http"
)

const proxyAddr = "127.0.0.1:3001"

func startProxy() {
	mux := http.NewServeMux()
	mux.HandleFunc("/proxy", proxyHandler)
	mux.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusNoContent) })
	log.Printf("Proxy del navegador en http://%s", proxyAddr)
	log.Fatal(http.ListenAndServe(proxyAddr, mux))
}
