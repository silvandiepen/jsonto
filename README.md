# JSON To...

Convert JSON files to anything you want!

JSON to makes it possible to create any type of file using JSON data. We provide the tool, you provide the input and the template.

### Why?

It is initially made to use create Sass/SCSS files from JSON. Defining settings in a json file which can be used by a frontend and automatically generate SCSS settings files.

### Usage (NPM)

1. Install the script

```bash
npm install @sil/jsonto --save-dev
```

2. Create a [template](#template)

3. Add the script to your package.json

```json
{
    ...
    "scripts": {
        ...
        "build:config": "jsonto src/config.json src/scss/config.scss src/templates/my-config.template"
        ...
    }
    ...
}
```

4. Run it!

```bash
npm run build:config
```

### Command (NPX)

You can run json also using NPX. Example command;

```bash
npx @sil/jsonto source.json output.scss example.template
```

### Arguments

JsonTo needs 3 arguments as in the example above

1. Source (json file)
2. Output (.scss)
3. Template file


### Template

The template engine uses [EJS](https://ejs.co), so you can add anything in the file you want. A simple example to build a Sass config file;

**my-config.template**

```
$my-config: (
    <% Object.keys(data).forEach((key, index)=>{ -%>
        "<%- key %>": "<%- data[key]%>"<% if(index == data.length){ %>,<%}%>
    <% }) -%>
)!default;
```

### SCSS

For now, JSON To has been mainly used for SCSS templates. Thats why it provides a few extra functions to use with Sass. Because a json object isn't 1:1 usable in SCSS.

|                | type     | Description                                         |
| -------------- | -------- | --------------------------------------------------- |
| `toSassValue`  | function | Converts a value to a valid Sass value              |
| `toSassObject` | function | Converts a whole object to a Sass object            |
| `sassData`     | string   | The full data object converted to a valid Sass list |
