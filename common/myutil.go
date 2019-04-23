package common

import (
	"bytes"
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"net/url"

	"regexp"
	"strconv"
	"strings"
	"time"

	b64 "encoding/base64"
	"sync"
	"unicode"

	"github.com/google/uuid"
	"github.com/teris-io/shortid"
	"golang.org/x/text/transform"
	"golang.org/x/text/unicode/norm"
)

const invalidChar = "~`!@#$%^&*+='\"\\|?<>"
const invalidData = "~`!@#%^&*+='|?<>"
const invalidTopic = "~`!@%^&'|<>"
const invalidSQLStatement = "~`!@%^'|"

var mutex *sync.Mutex
var syncIdNum uint32 = 0

func isMn(r rune) bool {
	return unicode.Is(unicode.Mn, r) // Mn: nonespacing marks
}

func Utf8Convert(str string) string {

	b := make([]byte, len(str))

	t := transform.Chain(norm.NFD, transform.RemoveFunc(isMn), norm.NFC)
	_, _, e := t.Transform(b, []byte(str), true)
	if e != nil {
		return ""
	}
	b = bytes.Trim(b, "\x00")

	return string(b)
}

//ValidAPICharacter check valid name with accent
func ValidAPICharacter(s string) bool {
	for _, r := range s {
		if strings.Contains(invalidChar, string(r)) {
			return false
		}
	}
	return true
}

//ValidAPIData check valid data header
func ValidAPIData(s string) bool {
	for _, r := range s {
		if strings.Contains(invalidData, string(r)) {
			return false
		}
	}
	return true
}

//ValidAPITopic check valid data topic
func ValidAPITopic(s string) bool {
	for _, r := range s {
		if strings.Contains(invalidTopic, string(r)) {
			return false
		}
	}
	return true
}

func ValidSQLStatement(s string) bool {
	for _, r := range s {
		if strings.Contains(invalidSQLStatement, string(r)) {
			return false
		}
	}
	return true
}

func ValidAPILabel(label string) bool {
	result, err := regexp.MatchString("^[a-zA-Z0-9_]*$", label)
	if err != nil {
		return false
	}
	return result
}

func GenerateUUID() string {
	id := uuid.New().String()
	id = strings.Replace(id, "-", "", -1)
	return id
}

func GenerateUUIDPreFix(prefix string, postfix string) string {
	return prefix + GenerateUUID() + postfix
}

func GenerateShortUID() string {
	uid, _ := shortid.Generate()

	return uid
}

func GenerateID() string {
	if mutex == nil {
		mutex = &sync.Mutex{}
	}
	defer mutex.Unlock()
	mutex.Lock()

	syncIdNum++
	if syncIdNum >= 1000 {
		syncIdNum = 0
	}
	shortid, _ := shortid.Generate()
	return fmt.Sprintf("%03d%s", syncIdNum, shortid)
}

func FormatTimeToKey(date time.Time) string {
	return date.Format("20060102")
}

func ConvertStringToInt64(str string) (int64, error) {
	return strconv.ParseInt(str, 10, 64)
}

func GetMD5Hash(text string) string {
	hasher := md5.New()
	hasher.Write([]byte(text))
	return hex.EncodeToString(hasher.Sum(nil))
}

func IsValidEmail(email string) bool {
	reg := regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
	return reg.MatchString(email)
}

func IsValidPhoneNumber(phone string) bool {
	reg := regexp.MustCompile(`^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$`)
	return reg.MatchString(phone)
}

func IsValidUrl(toTest string) bool {
	_, err := url.ParseRequestURI(toTest)
	if err != nil {
		return false
	} else {
		return true
	}
}

func Base64Encode(input string) string {
	return b64.StdEncoding.EncodeToString([]byte(input))
}
