package main

import "regexp"

var headTag = regexp.MustCompile(`(?i)<head[^>]*>`)

func injectHead(markup, snippet string) string {
	if location := headTag.FindStringIndex(markup); location != nil {
		return markup[:location[1]] + snippet + markup[location[1]:]
	}
	return snippet + markup
}
