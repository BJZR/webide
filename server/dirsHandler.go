package main

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func dirsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Header.Get("X-WebIDE") == "" {
		http.Error(w, "no permitido", http.StatusForbidden)
		return
	}
	path := r.URL.Query().Get("path")
	if path == "" {
		path, _ = os.UserHomeDir()
	}
	path = filepath.Clean(path)
	entries, err := os.ReadDir(path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	dirs := []string{}
	for _, entry := range entries {
		if entry.IsDir() && !strings.HasPrefix(entry.Name(), ".") {
			dirs = append(dirs, entry.Name())
		}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{"path": path, "parent": filepath.Dir(path), "dirs": dirs})
}
