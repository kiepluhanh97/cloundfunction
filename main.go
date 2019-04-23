package main

import (
	"github.com/astaxie/beego"
	_ "serverless/serverless-backend/routers"
)

func main() {
	beego.Run()
}
