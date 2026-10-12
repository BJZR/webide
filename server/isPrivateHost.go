package main

import "net"

func isPrivateHost(host string) bool {
	addresses, err := net.LookupIP(host)
	if err != nil {
		return true
	}
	for _, ip := range addresses {
		if ip.IsLoopback() || ip.IsPrivate() || ip.IsLinkLocalUnicast() || ip.IsUnspecified() {
			return true
		}
	}
	return false
}
