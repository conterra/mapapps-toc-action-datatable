/*
 * Copyright (C) 2023 con terra GmbH (info@conterra.de)
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
const ID = "datatable";

export default class DatatableActionDefinitionFactory {
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
        const resultViewerService = this._resultViewerService;

        return {
            id: ID,
            type: "button",
            label: i18n.actionLabel,
            icon: "icon-editor-table",

            isVisibleForItem(tocItem) {
                const ref = tocItem.ref;
                const parent = ref && ref.parent;
                const capabilities = parent && parent.capabilities;
                if (ref && ref.sourceJSON?.type !== "Group Layer" && ref.type !== "group") {
                    if (ref.sourceJSON?.type === "Feature Layer" || ref.type === "feature") {
                        return true;
                    } else if (capabilities?.operations?.supportsQuery) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },

            trigger(tocItem) {
                const ref = tocItem.ref;
                let id = ref.id;
                if (ref?.layer?.type === "map-image") {
                    id = ref.layer.id + "/" + ref.id;
                }
                const storeProps = {
                    id: "action_store_" + new Date().getTime(),
                    layerId: id
                };

                agsStoreFactory.createStore(storeProps).then((store) => {
                    store.load().then(async () => {
                        // result-ui is used
                        if (resultViewerService) {
                            const idsProvider = async ({ limit }) => {
                                const result = await store.query({}, {
                                    count: limit
                                });
                                return {
                                    ids: result.map((item) => item.id)
                                };
                            };

                            const dataTableFactory = resultViewerService.dataTableFactory;
                            const dataTable = await dataTableFactory.createDataTableFromStoreAndQuery({
                                dataTableTitle: store.title || store.id || i18n.searchResultTitle,
                                dataSource: store,
                                idsProvider
                            });

                            const dataTableCollection = dataTableFactory.createDataTableCollection([dataTable]);
                            resultViewerService.open(dataTableCollection);
                        }
                        // resulcenter is used
                        else if (dataModel) {
                            dataModel.setDatasource(store);
                        }
                        // neither resultcenter nor result-ui is available
                        else {
                            return;
                        }
                    });
                });
            }
        };
    }
}
