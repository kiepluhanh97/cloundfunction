//dotnet:2.2, go:1.11, nodejs:10, 
// ballerina:0.990, ruby:2.5, nodejs:8, 
// blackbox, java, swift:4.2, sequence, 
// nodejs:6, python:3, python:2, php:7.3

var codeSample = {
    nodejs: "/*\n"
            +"*"
            +"\n* main() will be run when you invoke this action"
            +"\n*"
            +"\n* @param Cloud Functions actions accept a single parameter, which must be a JSON object."
            +"\n*"
            +"\n* @return The output of this action, which must be a JSON object."
            +"\n*"
            +"\n*/"
            +"\nfunction main(params) {"
            +"\n  return { message: 'Hello World' };"
            +"\n}",
    php:    "<?php"
            +"\n/**"
            +"\n*"
            +"\n* main() will be run when you invoke this action"
            +"\n*"
            +"\n* @param Cloud Functions actions accept a single parameter, which must be a JSON object."
            +"\n*"
            +"\n* @return The output of this action, which must be a JSON object."
            +"\n*"
            +"\n*/"
            +"\nfunction main(array $args) : array"
            +"\n{"
            +"\n   $name = $args[\"message\"] ?? \"stranger\";"
            +"\n   $greeting = \"Hello $name!\";"
            +"\n   echo $greeting;"
            +"\n   return [\"greeting\" => $greeting];"
            +"\n}",
    python: "#"
            +"\n#"
            +"\n# main() will be run when you invoke this action"
            +"\n#"
            +"\n# @param Cloud Functions actions accept a single parameter, which must be a JSON object."
            +"\n#"
            +"\n# @return The output of this action, which must be a JSON object."
            +"\n#"
            +"\n#"
            +"\nimport sys"
            +"\ndef main(dict):"
            +"\n    return { 'message': 'Hello world' }",
    golang: "/**"
            +"\n*"
            +"\n* main() will be run when you invoke this action"
            +"\n*"
            +"\n* @param Cloud Functions actions accept a single parameter, which must be a JSON object."
            +"\n*"
            +"\n* @return The output of this action, which must be a JSON object."
            +"\n*"
            +"\n*/"
            +"\npackage main"
  
            +"\n\nimport \"fmt\""
  
            +"\n// Main is the function implementing the action"
            +"\nfunc Main(params map[string]interface{}) map[string]interface{} {"
            +"\n    // parse the input JSON"
            +"\n    name, ok := params[\"name\"].(string)"
            +"\n    if !ok {"
            +"\n        name = \"World\""
            +"\n    }"
            +"\n    msg := make(map[string]interface{})"
            +"\n    msg[\"body\"] = \"Hello \" + name + \"!\""
            +"\n    // can optionally log to stdout (or stderr)"
            +"\n    fmt.Println(\"hello Go action\")"
            +"\n    // return the output JSON"
            +"\n    return msg"
            +"\n}",
    ruby:"\n#"
    +"\n#"
    +"\n# main() will be run when you invoke this action"
    +"\n#"
    +"\n# @param Cloud Functions actions accept a single parameter, which must be a JSON object."
    +"\n#"
    +"\n# @return The output of this action, which must be a JSON object."
    +"\n#"
    +"\n#"
    +"\ndef main(param)"
    +"\n  name = param[\"name\"] || \"stranger\""
    +"\n  greeting = \"Hello #{name}!\""
    +"\n  puts greeting"
    +"\n  { \"greeting\" => greeting }"
    +"\nend",
    swift:"/**"
    +"  \n*"
    +"  \n* main() will be run when you invoke this action"
    +"  \n*"
    +"  \n* @param Cloud Functions actions accept a single parameter, which must be Codable."
    +"  \n*"
    +"  \n* @return The completion function, which takes as output a Codable and Error?."
    +"  \n*"
    +"  \n*/"
    +"\nstruct Input: Codable {"
    +"\n    let name: String?"
    +"\n}"
    +"\nstruct Output: Codable {"
    +"\n    let greeting: String"
    +"\n}"
    +"\nfunc main(param: Input, completion: (Output?, Error?) -> Void) -> Void {"
    +"\n    let result = Output(greeting: \"Hello \\(param.name ?? \"stranger\")!\")"
    +"\n    completion(result, nil)"
    +"\n}"
    +"\n/**"
    +"  \n  * When no input is expected use only completion function"
    +"\nfunc main(completion: (Output?, Error?) -> Void) -> Void {"
    +"\n    let result = Output(greeting: \"Hello IBM Functions!\")"
    +"\n    completion(result, nil)"
    +"\n}"
    +"\n*/"
}

var RUNTIME = [{ "name": "Node.js 10", "f": "nodejs:10", "color": "#e4943e", "ext": ".js" },
{ "name": "Node.js 8", "f": "nodejs:8", "color": "orange", "ext": ".js" },
{ "name": "Node.js 6", "f": "nodejs:6", "color": "orange", "ext": ".js" },
{ "name": "PHP 7", "f": "php:7.3", "color": "purple", "ext": ".php" },
{ "name": "Python 2", "f": "python:2", "color": "#9855d4", "ext": ".py" },
{ "name": "Python 2", "f": "python:3", "color": "#9855d4", "ext": ".py" },
{ "name": "Swift 4.2", "f": "swift:4.2", "color": "#ff3baa", "ext": ".swift" },
{ "name": "Ruby 2.5", "f": "ruby:2.5", "color": "darkgreen", "ext": ".rb" },
{ "name": "Go 1.11", "f": "go:1.11", "color": "#00a296", "ext": ".go" }]

var DEFAULT_PACKAGE = "(Default package)"