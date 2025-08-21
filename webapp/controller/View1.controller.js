sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
   "sap/ui/model/Sorter",
   "sap/ui/export/Spreadsheet",
], function(Controller, Filter, FilterOperator, Sorter ,Spreadsheet) {
  "use strict";

  return Controller.extend("project2.controller.View1", {
  onInit: function() {
    const oModel = this.getOwnerComponent().getModel(); 
    this.getView().setModel(oModel); // Products modeli

    // Products
    oModel.read("/Products", {
        success: function(oData) {
            console.log("Products:", oData.results);
        },
        error: function(oError) {
            console.error("Ürünler yüklenemedi:", oError);
        }
    });

    // Categories
    oModel.read("/Categories", {
        success: function(oData) {
            console.log("Categories:", oData.results);

            // JSON model oluşturup view'a set et
            const oCategoryModel = new sap.ui.model.json.JSONModel(oData);
            this.getView().setModel(oCategoryModel, "categories");
        }.bind(this),
        error: function(oError) {
            console.error("Kategoriler yüklenemedi:", oError);
        }
    });
},

    // SearchField için filtreleme fonksiyonu
    onSearch: function(oEvent) {
      const sQuery = oEvent.getParameter("newValue"); // LiveChange event kullanıyorsan newValue
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

        // Mevcut sorters
        const aSorters = oBinding.aSorters || [];

        // Daha önce ascending mi descending mi kontrol et
        let bDescending = false;
        if (aSorters.length > 0 && aSorters[0].sPath === "UnitPrice") {
            bDescending = !aSorters[0].bDescending;
        }

        // Yeni sorter ekle
        const oSorter = new sap.ui.model.Sorter("UnitPrice", bDescending);
        oBinding.sort(oSorter);
        },

    onGroupByCategory: function() {
    const oList = this.byId("productList");
    const oBinding = oList.getBinding("items");

    // Categories modelini al 
    const oCategoryModel = this.getView().getModel("categories"); 
    const aCategories = oCategoryModel.getData().results;

    // Sorter oluştur
    const oSorter = new sap.ui.model.Sorter("CategoryID", false, function(oContext) {
        const iCategoryID = oContext.getProperty("CategoryID");

        // ID'ye göre CategoryName bul
        const oCategory = aCategories.find(cat => cat.CategoryID === iCategoryID);
        const sCategoryName = oCategory ? oCategory.CategoryName : "Unknown";

        return sCategoryName; 
    });

    oBinding.sort(oSorter);
},     onExportToExcel: function() {
    var oModel = this.getOwnerComponent().getModel();
    oModel.read("/Products", {
        success: function(oData) {
            var aData = oData.results;

            if (!aData || !aData.length) {
                sap.m.MessageToast.show("Export için veri yok!");
                return;
            }

            // Kolonları tanımla
            var aCols = [
                { label: "Product Name", property: "ProductName" },
                { label: "Quantity per Unit", property: "QuantityPerUnit" },
                { label: "Unit Price", property: "UnitPrice" },
                { label: "Units In Stock", property: "UnitsInStock" }
            ];


            var oSettings = {
                workbook: {
                    columns: aCols
                },
                dataSource: aData,
                fileName: "Products.xlsx"
            };


            var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
            oSpreadsheet.build()
                .then(function() {
                    sap.m.MessageToast.show("Excel dosyası oluşturuldu!");
                })
                .finally(function() {
                    oSpreadsheet.destroy();
                });

        },
        error: function(oError) {
            console.error("Ürünler yüklenemedi:", oError);
            sap.m.MessageToast.show("Ürünler yüklenemedi!");
        }
    });
}
,

   onItemPress: function(oEvent) {
    // Tıklanan item'ı al
    const oItem = oEvent.getSource();
    const oCtx = oItem.getBindingContext(); // item'ın context'i
    const sProductID = oCtx.getProperty("ProductID"); // ProductID al

    // Router ile detay view'e git
    const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
    oRouter.navTo("DetailView", {
        ProductID: sProductID
    });
}




  });
});
