package main

import (
	"encoding/json"
	"net/http"
)

func workspaceHandler(workspace *workspaceStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			var request struct {
				Path string `json:"path"`
			}
			if r.Header.Get("X-WebIDE") == "" || json.NewDecoder(r.Body).Decode(&request) != nil {
				http.Error(w, "no permitido", http.StatusForbidden)
				return
			}
			if err := workspace.Set(request.Path); err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"path": workspace.Get()})
	}
}
