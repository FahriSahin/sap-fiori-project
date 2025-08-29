sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/model/Sorter",
  "sap/ui/export/Spreadsheet",
  "sap/m/MessageToast"
], function(Controller, Filter, FilterOperator, Sorter, Spreadsheet, MessageToast) {
  "use strict";

  return Controller.extend("project2.controller.Employees", {

    onInit: function() {
      const oODataModel = this.getOwnerComponent().getModel();

      // Tüm Employees verisini JSONModel'e al
      oODataModel.read("/Employees", {
        success: function(oData) {
          const oJSONModel = new sap.ui.model.json.JSONModel({ Employees: oData.results });
          this.getView().setModel(oJSONModel, "EmployeesJSON"); // List binding için JSONModel
          console.log("Employees loaded:", oData.results);
        }.bind(this),
        error: function(oError) {
          console.error("Employees yüklenemedi:", oError);
        }
      });
    },

    onSearchEmployee: function(oEvent) {
      const sQuery = oEvent.getParameter("newValue");
      const oList = this.getView().byId("employeeList");
      const oBinding = oList.getBinding("items");

      if (sQuery && sQuery.length > 0) {
        const aFilters = [
          new Filter("FirstName", FilterOperator.Contains, sQuery),
          new Filter("LastName", FilterOperator.Contains, sQuery)
        ];
        const oMainFilter = new Filter({
          filters: aFilters,
          and: false
        });
        oBinding.filter([oMainFilter]);
      } else {
        oBinding.filter([]);
      }
    },

    onSortByTitle: function() {
      const oList = this.byId("employeeList");
      const oBinding = oList.getBinding("items");

      let bDescending = false;
      if (oBinding.aSorters && oBinding.aSorters.length > 0 && oBinding.aSorters[0].sPath === "Title") {
        bDescending = !oBinding.aSorters[0].bDescending;
      }

      const oSorter = new Sorter("Title", bDescending);
      oBinding.sort(oSorter);

      MessageToast.show(`Sorted by Title (${bDescending ? "Descending" : "Ascending"})`);
    },

    onExportToExcel: function() {
      const oJSONModel = this.getView().getModel("EmployeesJSON");
      const aData = oJSONModel.getProperty("/Employees");

      if (!aData || !aData.length) {
        MessageToast.show("No data available for export!");
        return;
      }

      const aCols = [
        { label: "First Name", property: "FirstName" },
        { label: "Last Name", property: "LastName" },
        { label: "Title", property: "Title" },
        { label: "City", property: "City" },
        { label: "Country", property: "Country" }
      ];

      const oSettings = {
        workbook: { columns: aCols },
        dataSource: aData,
        fileName: "Employees.xlsx"
      };

      const oSpreadsheet = new Spreadsheet(oSettings);
      oSpreadsheet.build()
        .then(() => MessageToast.show("Excel file created successfully!"))
        .finally(() => oSpreadsheet.destroy());
    },

    onEmployeePress: function(oEvent) {
      const oItem = oEvent.getSource();
      const oCtx = oItem.getBindingContext("EmployeesJSON");
      const sEmployeeID = oCtx.getProperty("EmployeeID");

      const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("EmployeeDetail", {
        EmployeeID: sEmployeeID
      });
    },

    onAgeFilterChange: function(oEvent) {
      const sKey = oEvent.getParameter("selectedItem").getKey(); // seçilen yaş
      const oList = this.byId("employeeList");
      const oBinding = oList.getBinding("items");

      const oToday = new Date();
      oToday.setFullYear(2000); // bugünü 2000 yılı gibi varsay

      function calculateAge(birthdate) {
        if (!birthdate) return 0;
        const bDate = new Date(birthdate);
        let age = oToday.getFullYear() - bDate.getFullYear();
        const m = oToday.getMonth() - bDate.getMonth();
        if (m < 0 || (m === 0 && oToday.getDate() < bDate.getDate())) {
          age--;
        }
        return age;
      }

      const minAge = parseInt(sKey, 10);

      const oFilter = new sap.ui.model.Filter({
        path: "BirthDate",
        test: function(oValue) {
          if (!oValue) return false;
          const iAge = calculateAge(oValue);
          return iAge >= minAge;
        }
      });

      oBinding.filter([oFilter]);

      // Console log ile filtrelenmiş kullanıcıları göster
      const aFilteredItems = oBinding.getContexts().map(ctx => ctx.getObject());
      console.log("Filtrelenmiş Employees:", aFilteredItems);
    }

  });
});
