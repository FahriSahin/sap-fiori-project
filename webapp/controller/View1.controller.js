sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/Sorter",
  "sap/ui/export/Spreadsheet",
  "sap/m/MessageToast"
], function(Controller, Filter, FilterOperator, Sorter, Spreadsheet, MessageToast) {
  "use strict";

  return Controller.extend("project2.controller.View1", {
    onInit: function() {
      const oModel = this.getOwnerComponent().getModel(); 
      this.getView().setModel(oModel); // Products modeli

      const i18n = this.getView().getModel("i18n");

      // Products
      oModel.read("/Products", {
        success: function(oData) {
          console.log(i18n.getProperty("logProducts"), oData.results);
        },
        error: function(oError) {
          console.error(i18n.getProperty("errProductsLoad"), oError);
        }
      });

      // Categories
      oModel.read("/Categories", {
        success: function(oData) {
          console.log(i18n.getProperty("logCategories"), oData.results);
          const oCategoryModel = new sap.ui.model.json.JSONModel(oData);
          this.getView().setModel(oCategoryModel, "categories");
        }.bind(this),
        error: function(oError) {
          console.error(i18n.getProperty("errCategoriesLoad"), oError);
        }
      });
    },

    onSearch: function(oEvent) {
      const sQuery = oEvent.getParameter("newValue");
      const oList = this.getView().byId("productList");
      const oBinding = oList.getBinding("items");

      if (sQuery && sQuery.length > 0) {
        const oFilter = new Filter("ProductName", FilterOperator.Contains, sQuery);
        oBinding.filter([oFilter]);
      } else {
        oBinding.filter([]);
      }
    },

    onSortPrice: function() {
      const oList = this.byId("productList");
      const oBinding = oList.getBinding("items");
      const aSorters = oBinding.aSorters || [];
      let bDescending = false;

      if (aSorters.length > 0 && aSorters[0].sPath === "UnitPrice") {
        bDescending = !aSorters[0].bDescending;
      }

      const oSorter = new Sorter("UnitPrice", bDescending);
      oBinding.sort(oSorter);
    },

    onGroupByCategory: function() {
      const oList = this.byId("productList");
      const oBinding = oList.getBinding("items");
      const oCategoryModel = this.getView().getModel("categories"); 
      const aCategories = oCategoryModel.getData().results;

      const oSorter = new Sorter("CategoryID", false, function(oContext) {
        const iCategoryID = oContext.getProperty("CategoryID");
        const oCategory = aCategories.find(cat => cat.CategoryID === iCategoryID);
        return oCategory ? oCategory.CategoryName : "Unknown";
      });

      oBinding.sort(oSorter);
    },

    onExportToExcel: function() {
      const oModel = this.getOwnerComponent().getModel();
      const i18n = this.getView().getModel("i18n");

      oModel.read("/Products", {
        success: function(oData) {
          const aData = oData.results;
          if (!aData || !aData.length) {
            MessageToast.show(i18n.getProperty("msgNoDataExport"));
            return;
          }

          const aCols = [
            { label: i18n.getProperty("colProductName"), property: "ProductName" },
            { label: i18n.getProperty("colQuantityPerUnit"), property: "QuantityPerUnit" },
            { label: i18n.getProperty("colUnitPrice"), property: "UnitPrice" },
            { label: i18n.getProperty("colUnitsInStock"), property: "UnitsInStock" }
          ];

          const oSettings = {
            workbook: { columns: aCols },
            dataSource: aData,
            fileName: "Products.xlsx"
          };

          const oSpreadsheet = new Spreadsheet(oSettings);
          oSpreadsheet.build()
            .then(function() {
              MessageToast.show(i18n.getProperty("msgExcelCreated"));
            })
            .finally(function() {
              oSpreadsheet.destroy();
            });

        },
        error: function(oError) {
          console.error(i18n.getProperty("errProductsLoad"), oError);
          MessageToast.show(i18n.getProperty("errProductsLoad"));
        }
      });
    },

    onItemPress: function(oEvent) {
      const oItem = oEvent.getSource();
      const oCtx = oItem.getBindingContext();
      const sProductID = oCtx.getProperty("ProductID");

      const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("DetailView", { ProductID: sProductID });
    }
  });
});
