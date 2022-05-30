# TOC Action Datatable
This bundle provides an additional toc action that opens the map.apps resultcenter and shows all features of a layer in tabular form.

![Screenshot App](https://github.com/conterra/mapapps-toc-action-datatable/blob/master/screenshot.JPG)

## Sample App
https://demos.conterra.de/mapapps/resources/apps/downloads_tocactiondatatable/index.html

## Installation Guide
**Requirement: map.apps 4.13.0**

Add the bundle "dn_tocactiondatatable" to your map.apps 4 app.

Configure the available toc actions in the toc bundle and add the *datatable* action:

```
"toc": {
    "Config": {
        "actions": [
            "datatable",
            "zoom-to-extent",
            "activate-children",
            "deactivate-children",
            "change-opacity",
            "show-description",
            "show-copyright"
        ]
    }
}
```

Otherwise you can simply use all available actions:

```
"toc": {
    "Config": {
        "actions":  ["*"]
    }
}
```

## Development Guide
### Define the mapapps remote base
Before you can run the project you have to define the mapapps.remote.base property in the pom.xml-file:
`<mapapps.remote.base>http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%</mapapps.remote.base>`

### Other methods to to define the mapapps.remote.base property.
1. Goal parameters
`mvn install -Dmapapps.remote.base=http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%`

2. Build properties
Change the mapapps.remote.base in the build.properties file and run:
`mvn install -Denv=dev -Dlocal.configfile=%ABSOLUTEPATHTOPROJECTROOT%/build.properties`
