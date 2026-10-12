package main

import (
	"errors"
	"os"
	"path/filepath"
	"sync"
)

type workspaceStore struct {
	mu   sync.RWMutex
	root string
}

func (s *workspaceStore) Get() string {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.root
}

func (s *workspaceStore) Set(path string) error {
	info, err := os.Stat(path)
	if err != nil || !info.IsDir() {
		return errors.New("no es una carpeta válida")
	}
	abs, err := filepath.Abs(path)
	if err != nil {
		return err
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	s.root = abs
	return nil
}
