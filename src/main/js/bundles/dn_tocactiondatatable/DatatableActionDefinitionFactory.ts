///
/// Copyright (C) 2025 con terra GmbH (info@conterra.de)
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///         http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import { InjectedReference } from "apprt-core/InjectedReference";
import type { ActionDefinition } from "toc/api";
import type { AGSStoreFactory } from "agssearch/api";
import { Messages } from "./nls/bundle";
import { ResultViewerService } from "result-api/api";
import { TocItem } from "toc/model/TocItem";

const ID = "datatable";

export default class DatatableActionDefinitionFactory {
    private _i18n: Messages;
    private _agsStoreFactory: InjectedReference<AGSStoreFactory>;
    private _dataModel: InjectedReference<any>;
    private _resultViewerService: InjectedReference<ResultViewerService>;

    private supportedIds: Array<string>;

    constructor() {
        this.supportedIds = [ID];
    }

    public createDefinitionById(id: string): ActionDefinition | undefined {
        if (ID !== id) {
            return;
        }
        const i18n = this._i18n.get();
        const agsStoreFactory = this._agsStoreFactory!;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;

        return {
            id: ID,
            type: "button",
            label: i18n.actionLabel,
            icon: "icon-editor-table",

            isVisibleForItem(tocItem: TocItem): boolean {
                const ref = tocItem.ref;
                const parent = ref && ref.parent;
                const capabilities = parent && parent.capabilities;
                if (ref && ref.sourceJSON?.type !== "Group Layer" && ref.type !== "group") {
                    if (ref.sourceJSON?.type === "Feature Layer" || ref.type === "feature") {
                        return true;
                    } else if (capabilities?.operations?.supportsQuery) {
                        return true;
                    } else if (ref.sublayers.length === 1 && tocItem.listMode === "hide-children") {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },

            trigger(tocItem: TocItem): void {
                const ref = tocItem.ref;
                let id = ref.id;
                let title = ref?.title;
                if (ref?.type === "map-image") {
                    id = `${id}/${ref.sublayers.items[0].id}`;
                    title = ref.sublayers.items[0].title;
                } else if (ref?.layer?.type === "map-image") {
                    id = `${ref.layer.id}/${id}`;
                    title = ref.layer.title;
                }
                const storeProps = {
                    id: `action_store_${new Date().getTime()}`,
                    layerId: id
                };

                agsStoreFactory.createStore(storeProps).then((store) => {
                    store.load().then(async () => {
                        // result-ui is used
                        if (that._resultViewerService) {
                            const dataTableFactory = that._resultViewerService.dataTableFactory;
                            const dataTable = await dataTableFactory.createDataTableFromStoreAndQuery({
                                dataTableTitle: title || store.title || store.id || i18n.searchResultTitle,
                                dataSource: store,
                                queryExpression: {},
                                queryOptions: {}
                            });

                            const dataTableCollection = dataTableFactory.createDataTableCollection([dataTable]);
                            that._resultViewerService.open(dataTableCollection);
                        }
                        // resulcenter is used
                        else if (that._dataModel) {
                            that._dataModel.setDatasource(store);
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

    setDataModel(dataModel: any): void {
        this._dataModel = dataModel;
    }

    setResultViewerService(resultViewerService: any): void {
        this._resultViewerService = resultViewerService;
    }
}
