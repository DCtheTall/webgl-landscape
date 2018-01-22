package main

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
)

func main() {
	fileServer := http.FileServer(http.Dir("./public"))
	http.Handle("/", fileServer)

	port, err := strconv.Atoi(os.Getenv("PORT"))
	if err != nil {
		port = 4000
	}
	fmt.Println(fmt.Sprintf("Listening on port... %d", port))
	http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
}
