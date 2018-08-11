package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"strconv"
)

// Abstract converting http.Handler type into http.HandlerFunc for middleware
func httpHandlerToHandlerFunc(handler http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		handler.ServeHTTP(w, r)
	}
}

// Middleware

type middleware func(next http.HandlerFunc) http.HandlerFunc

func withLogging(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println(
			fmt.Sprintf("Logged connection from %s", r.RemoteAddr))
		next.ServeHTTP(w, r)
	}
}

func withTracing(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println(
			fmt.Sprintf("Logged connection from %s", r.RequestURI))
		next.ServeHTTP(w, r)
	}
}

func composeMiddleware(mws ...middleware) middleware {
	return func(final http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			last := final
			for i := len(mws) - 1; i >= 0; i-- {
				last = mws[i](last)
			}
			last(w, r)
		}
	}
}

// TemplateData interface for HTML template
type TemplateData struct {
	Development bool
}

func main() {
	fileServer := http.FileServer(http.Dir("./public"))
	tmpl := template.Must(template.ParseFiles("./public/index.html"))
	handler := func(w http.ResponseWriter, r *http.Request) {
		env := os.Getenv("GO_ENV")
		data := TemplateData{
			Development: env == "development"}
		tmpl.Execute(w, data)
	}
	http.HandleFunc(
		"/",
		composeMiddleware(withLogging, withTracing)(handler))
	http.HandleFunc(
		"/assets/",
		composeMiddleware(
			withLogging,
			withTracing,
		)(httpHandlerToHandlerFunc(fileServer)))

	port, err := strconv.Atoi(os.Getenv("PORT"))
	if err != nil {
		port = 4000
	}
	fmt.Println(
		fmt.Sprintf(
			"Listening on port... %d", port))
	http.ListenAndServe(
		fmt.Sprintf(":%d", port), nil)
}
