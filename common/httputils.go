package common

import (
	"bytes"
	"crypto/tls"
	"io/ioutil"
	"net/http"
	"serverless/serverless-backend/logger"
	"time"
)

func HttpPost(url string, data []byte, token string) ([]byte, error) {
	return httpRequest("POST", url, data, token)
}

func HttpPut(url string, data []byte, token string) ([]byte, error) {
	return httpRequest("PUT", url, data, token)
}

func HttpGet(url, token string) ([]byte, error) {
	return httpRequest("GET", url, nil, token)
}

func HttpDelete(url, token string) ([]byte, error) {
	return httpRequest("DELETE", url, nil, token)
}

func httpRequest(method, url string, data []byte, token string) ([]byte, error) {
	logger.Log.Info("Url: " + url)
	//var dataPost []byte
	var err error = nil
	var req *http.Request

	if data != nil {
		//dataPost, err = json.Marshal(data)
		req, err = http.NewRequest(method, url, bytes.NewBuffer(data))
	} else {
		req, err = http.NewRequest(method, url, nil)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	if len(token) > 0 {
		req.Header.Set("Authorization", token)
	}

	transport := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}

	client := &http.Client{Transport: transport}

	client.Timeout = 60 * time.Second
	resp, err := client.Do(req)
	if err != nil {
		return []byte{}, err
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	return body, err
}
