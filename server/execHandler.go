package main

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"os/exec"
	"time"
)

var allowedCommands = map[string]bool{"git": true, "make": true, "cmake": true, "go": true, "npm": true}

func execHandler(current func() string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		root := current()
		var request struct {
			Args []string `json:"args"`
		}
		if r.Method != http.MethodPost || r.Header.Get("X-WebIDE") == "" ||
			json.NewDecoder(r.Body).Decode(&request) != nil ||
			len(request.Args) == 0 || !allowedCommands[request.Args[0]] {
			http.Error(w, "comando no permitido", http.StatusForbidden)
			return
		}
		ctx, cancel := context.WithTimeout(r.Context(), 60*time.Second)
		defer cancel()
		command := exec.CommandContext(ctx, request.Args[0], request.Args[1:]...)
		command.Dir = root
		output, err := command.CombinedOutput()
		code := 0
		var exitError *exec.ExitError
		if errors.As(err, &exitError) {
			code = exitError.ExitCode()
		} else if err != nil {
			code, output = 1, []byte(err.Error())
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]any{"output": string(output), "code": code})
	}
}
