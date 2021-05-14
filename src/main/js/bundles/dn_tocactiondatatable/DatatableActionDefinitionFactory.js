/*
 * Copyright (C) 2021 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import apprt_request from "apprt-request";

const ID = "datatable";

export default class ExtendedDescriptionActionDefinitionFactory {
    constructor(props) {
        this.supportedIds = [ID];
    }

    createDefinitionById(id) {
        if (ID !== id) {
            return;
        }
        const i18n = this._i18n.get();
        const agsStoreFactory = this._agsStoreFactory;
        const dataModel = this._dataModel;
        return {
            id: ID,
            type: "button",
            label: i18n.actionLabel,
            icon: "icon-editor-table",
            isVisibleForItem(tocItem) {
                let ref = tocItem.ref;
                let parent = ref && ref.parent;
                let capabilities = parent && parent.capabilities;
                if (ref && ref.type !== "group") {
                    if (ref.type === "feature") {
                        return true;
                    } else if (capabilities && capabilities.operations && capabilities.operations.supportsQuery) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },
            trigger(tocItem) {
                let ref = tocItem.ref;
                let url = ref && ref.url;
                if (ref.type === "feature") {
                    url = url + "/" + ref.layerId;
                }
                if (!url) {
                    return;
                }

                this.getMetadata(url).then((metadata) => {
                    let idProperty = this.getIdProperty(metadata.fields);
                    const storeProps ={
                        id: "action_store_" + new Date().getTime(),
                        url: url,
                        idProperty: idProperty
                    };
                    if(ref.definitionExpression) {
                        storeProps.definitionExpression = ref.definitionExpression;
                    }

                    let store = agsStoreFactory.createStore(storeProps);
                    dataModel.setDatasource(store);
                });
            },
            getIdProperty(fields) {
                return fields.find((field) => {
                    return field.type === "esriFieldTypeOID";
                }).name;
            },
            getMetadata(url) {
                return apprt_request(url, {
                    handleAs: "json",
                    query: {
                        f: "json"
                    }
                });
            }
        };
    }
}
