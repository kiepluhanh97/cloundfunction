package logger

import (
	"fmt"
)

var (
	Log *Logger
)

type Logger struct {
	*log.Logger
}

func NewLogger(fileName string, maxSize int, maxBackups int, maxAge int, compress bool) (*Logger, error) {
	logDir := filepath.Dir(fileName)
	log.Println("logDir", fileName, logDir)
	if _, err := os.Stat(logDir); os.IsNotExist(err) {
		err = os.MkdirAll(logDir, 0777)
	}
	var out io.Writer = &lumberjack.Logger{
		Filename:   fileName,
		MaxSize:    maxSize,
		MaxBackups: maxBackups,
		MaxAge:     maxAge,
		Compress:   compress,
		LocalTime:  true,
	}

	flag := log.LstdFlags | log.Lshortfile | log.Lmicroseconds
	logger := log.New(io.MultiWriter(out, os.Stdout), "", flag)

	return &Logger{logger}, nil
}

func (log *Logger) write(msg string) {
	log.Print(msg)
}

func (log *Logger) Info(v ...interface{}) {
	log.write("[INFO] " + ": " + fmt.Sprintln(v...))
}

func (log *Logger) Error(v ...interface{}) {
	log.write("[ERROR] " + ": " + fmt.Sprintln(v...))
}
