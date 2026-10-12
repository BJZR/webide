package main

import (
	"io"
	"net/http"
	"os"
	"path/filepath"
)

func writeHandler(current func() string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		root := current()
		if (r.Method != http.MethodPut && r.Method != http.MethodDelete) || r.Header.Get("X-WebIDE") == "" {
			http.Error(w, "no permitido", http.StatusForbidden)
			return
		}
		path, err := safePath(root, r.URL.Query().Get("path"))
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		if r.Method == http.MethodDelete {
			if err := os.Remove(path); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			w.WriteHeader(http.StatusNoContent)
			return
		}
		body, err := io.ReadAll(http.MaxBytesReader(w, r.Body, maxFileBytes*5))
		if err == nil {
			err = os.MkdirAll(filepath.Dir(path), 0o755)
		}
		if err == nil {
			err = os.WriteFile(path, body, 0o644)
		}
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}
