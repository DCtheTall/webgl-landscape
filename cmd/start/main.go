package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"strconv"
)

type middleware func(next http.HandlerFunc) http.HandlerFunc

type templateData struct {
	Development bool
}

func withLogging(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println(
			fmt.Sprintf("Logged connection from: %s", r.RemoteAddr))
		next.ServeHTTP(w, r)
	}
}

func withTracing(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println(
			fmt.Sprintf("Request: %s %s", r.Method, r.RequestURI))
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

func httpHandlerToHandlerFunc(handler http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		handler.ServeHTTP(w, r)
	}
}

func serveViewWithTemplate(tmpl *template.Template) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		env := os.Getenv("GO_ENV")
		data := templateData{
			Development: env == "development",
		}
		tmpl.Execute(w, data)
	}
}

func main() {
	tmpl := template.Must(template.ParseFiles("./public/index.html"))
	fileServer := http.FileServer(http.Dir("./public"))
	http.HandleFunc(
		"/",
		composeMiddleware(
			withLogging,
			withTracing,
		)(serveViewWithTemplate(tmpl)))
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
