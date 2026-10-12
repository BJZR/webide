package main

import (
	"errors"
	"os"
	"path/filepath"
	"strings"
)

func safePath(root, relative string) (string, error) {
	rootAbs, err := filepath.Abs(root)
	if err != nil {
		return "", err
	}
	full := filepath.Join(rootAbs, filepath.FromSlash(relative))
	if !strings.HasPrefix(full, rootAbs+string(os.PathSeparator)) {
		return "", errors.New("ruta fuera del workspace")
	}
	return full, nil
}
