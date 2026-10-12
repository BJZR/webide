package main

import (
	"flag"
	"log"
	"net/http"
)

func main() {
	initial := flag.String("workspace", ".", "carpeta inicial del proyecto")
	flag.Parse()
	workspace := &workspaceStore{}
	if err := workspace.Set(*initial); err != nil {
		log.Fatal(err)
	}
	http.Handle("/", http.FileServer(http.Dir("../web")))
	http.HandleFunc("/api/backup", backupHandler)
	http.HandleFunc("/api/workspace", workspaceHandler(workspace))
	http.HandleFunc("/api/dirs", dirsHandler)
	http.HandleFunc("/api/files", listHandler(workspace.Get))
	http.HandleFunc("/api/file", writeHandler(workspace.Get))
	http.HandleFunc("/api/exec", execHandler(workspace.Get))
	go startProxy()
	log.Printf("WebIDE en http://localhost:3000 (workspace: %s)", workspace.Get())
	log.Fatal(http.ListenAndServe("127.0.0.1:3000", nil))
}
