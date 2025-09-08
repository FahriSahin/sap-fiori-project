sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
  "use strict";

  return Controller.extend("project2.controller.TablePage", {
    onInit: function() {
  const oODataModel = this.getOwnerComponent().getModel();
  const oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

  const monthNames = [
    oBundle.getText("monthJan"),
    oBundle.getText("monthFeb"),
    oBundle.getText("monthMar"),
    oBundle.getText("monthApr"),
    oBundle.getText("monthMay"),
    oBundle.getText("monthJun"),
    oBundle.getText("monthJul"),
    oBundle.getText("monthAug"),
    oBundle.getText("monthSep"),
    oBundle.getText("monthOct"),
    oBundle.getText("monthNov"),
    oBundle.getText("monthDec")
  ];

  oODataModel.read("/Summary_of_Sales_by_Years", {
    success: function(oData) {
      const aSales = oData.results.map(item => {
        const date = new Date(item.ShippedDate);
        return {
          month: monthNames[date.getMonth()] + " " + date.getFullYear(),
          Sales: parseFloat(item.Subtotal)
        };
      });

      const oJSONModel = new sap.ui.model.json.JSONModel({ SalesByMonth: aSales });
      this.getView().setModel(oJSONModel, "salesModel");
      console.log("Sales by Month:", aSales);
    }.bind(this),
    error: function(oError) {
      sap.m.MessageToast.show(oBundle.getText("salesLoadError"));
      console.error("Failed to load sales:", oError);
    }
  });

  this.getView().byId("_IDGenPage2").setTitle(oBundle.getText("monthlySalesTitle"));
}

  });
});
