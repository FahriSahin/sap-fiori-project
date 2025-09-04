sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
  "use strict";

  return Controller.extend("project2.controller.TablePage", {
    onInit: function() {
      const oODataModel = this.getOwnerComponent().getModel();

      // Summary_of_Sales_by_Years verisini çek
      oODataModel.read("/Summary_of_Sales_by_Years", {
        success: function(oData) {
          // month ve Sales değerlerini uygun formatta JSON modeline aktar
          // i18n'den ay isimlerini al
const monthNames = [
    this.getView().getModel("i18n").getProperty("monthJan"),
    this.getView().getModel("i18n").getProperty("monthFeb"),
    this.getView().getModel("i18n").getProperty("monthMar"),
    this.getView().getModel("i18n").getProperty("monthApr"),
    this.getView().getModel("i18n").getProperty("monthMay"),
    this.getView().getModel("i18n").getProperty("monthJun"),
    this.getView().getModel("i18n").getProperty("monthJul"),
    this.getView().getModel("i18n").getProperty("monthAug"),
    this.getView().getModel("i18n").getProperty("monthSep"),
    this.getView().getModel("i18n").getProperty("monthOct"),
    this.getView().getModel("i18n").getProperty("monthNov"),
    this.getView().getModel("i18n").getProperty("monthDec")
];

          
          const aSales = oData.results.map(item => {
            const date = new Date(item.ShippedDate); // ShippedDate alanı
            return {
              month: monthNames[date.getMonth()] + " " + date.getFullYear(), // Örn: "Tem 1996"
              Sales: parseFloat(item.Subtotal) // sayısal değer
            };
          });

          const oJSONModel = new JSONModel({ SalesByMonth: aSales });
          this.getView().setModel(oJSONModel, "salesModel"); // model adı salesModel

          console.log("Sales by Month:", aSales);
        }.bind(this),
        error: function(oError) {
          MessageToast.show(this.getView().getModel("i18n").getProperty("salesLoadError"));
          console.error("Failed to load sales:", oError);
        }.bind(this)
      });

      // Page title için i18n
      this.getView().byId("_IDGenPage2").setTitle(
        this.getView().getModel("i18n").getProperty("monthlySalesTitle")
      );
    }
  });
});
