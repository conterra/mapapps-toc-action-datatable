# dn_tocactiondatatable

This bundle provides an additional toc action that opens the map.apps resultcenter and shows all features of a layer in tabular form.

## Usage
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
