package main

import (
	"bytes"
	"encoding/json"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"
	"unicode/utf8"
)

const (
	maxFiles     = 500
	maxFileBytes = 200 << 10
)

var skipDirs = map[string]bool{".git": true, "node_modules": true, "build": true, "backups": true, "vendor": true}

func listHandler(current func() string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		root := current()
		files := map[string]string{}
		filepath.WalkDir(root, func(path string, entry fs.DirEntry, err error) error {
			if err != nil {
				return nil
			}
			if entry.IsDir() {
				if skipDirs[entry.Name()] && path != root {
					return filepath.SkipDir
				}
				return nil
			}
			info, err := entry.Info()
			if err != nil || info.Size() > maxFileBytes || len(files) >= maxFiles {
				return nil
			}
			data, err := os.ReadFile(path)
			if err != nil || !utf8.Valid(data) || bytes.IndexByte(data, 0) >= 0 {
				return nil
			}
			relative, _ := filepath.Rel(root, path)
			files[filepath.ToSlash(relative)] = string(data)
			return nil
		})
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(files)
	}
}
