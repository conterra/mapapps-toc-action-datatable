# TOC Action Datatable

This bundle provides an additional toc action that opens the map.apps resultcenter and shows all features of a layer in tabular form.

![Screenshot App](https://github.com/conterra/mapapps-toc-action-datatable/blob/master/screenshot.JPG)

## Build Status
[![devnet-bundle-snapshot](https://github.com/conterra/mapapps-toc-action-datatable/actions/workflows/devnet-bundle-snapshot.yml/badge.svg)](https://github.com/conterra/mapapps-toc-action-datatable/actions/workflows/devnet-bundle-snapshot.yml)

## Sample App
https://demos.conterra.de/mapapps/resources/apps/downloads_tocactiondatatable/index.html

## Installation Guide
**Requirement: map.apps 4.13.0**

[dn_tocactiondatatable Documentation](https://github.com/conterra/mapapps-toc-action-datatable/tree/master/src/main/js/bundles/dn_tocactiondatatable)

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
