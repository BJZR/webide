package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

const maxBackupBytes = 10 << 20

func backupHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "método no permitido", http.StatusMethodNotAllowed)
		return
	}
	if err := os.MkdirAll("backups", 0o755); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	file, err := os.Create(fmt.Sprintf("backups/%s.json", time.Now().Format("20060102-150405")))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer file.Close()
	io.Copy(file, http.MaxBytesReader(w, r.Body, maxBackupBytes))
	w.WriteHeader(http.StatusNoContent)
}
