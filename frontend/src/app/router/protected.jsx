// Import Dependencies
import { Navigate } from "react-router";

// Local Imports
import { AppLayout } from "app/layouts/AppLayout";
import { DynamicLayout } from "app/layouts/DynamicLayout";
import AuthGuard from "middleware/AuthGuard";

// ----------------------------------------------------------------------

const protectedRoutes = {
  id: "protected",
  Component: AuthGuard,
  children: [
    // The dynamic layout supports both the main layout and the sideblock.
    {
      Component: DynamicLayout,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboards/home" />,
        },
        {
          path: "dashboards",
          children: [
            {
              index: true,
              element: <Navigate to="/dashboards/home" />,
            },
            {
              path: "home",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/home")).default,
              }),
            },
            {
              path: "crm",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/crm")).default,
              }),
            },
            {
              path: "crm/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/crm/form"))
                  .default,
              }),
            },
            {
              path: "crm/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/crm/form"))
                  .default,
              }),
            },
            {
              path: "crm/details/:id",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/crm/details"))
                  .default,
              }),
            },
          ],
        },
        {
          path: "stores",
          children: [
            {
              index: true,
              element: <Navigate to="/stores/item" />,
            },
            {
              path: "item",
              lazy: async () => ({
                Component: (await import("app/pages/stores/item"))
                  .default,
              }),
            },
            {
              path: "item/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/stores/item/form"))
                  .default,
              }),
            },
            {
              path: "item/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/stores/item/form"))
                  .default,
              }),
            },
            {
              path: "stock-entry",
              lazy: async () => ({
                Component: (await import("app/pages/stores/stock-entry"))
                  .default,
              }),
            },
            {
              path: "stock-entry/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/stores/stock-entry/form"))
                  .default,
              }),
            },
            {
              path: "stock-entry/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/stores/stock-entry/form"))
                  .default,
              }),
            },

          ]
        },
        {
          path: "purchases",
          children: [
            {
              index: true,
              element: <Navigate to="/purchases/supplier" />,
            },
            {
              path: "supplier",
              lazy: async () => ({
                Component: (await import("app/pages/purchases/supplier"))
                  .default,
              }),
            },
            {
              path: "supplier/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/purchases/supplier/form"))
                  .default,
              }),
            },
            {
              path: "supplier/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/purchases/supplier/form"))
                  .default,
              }),
            },
            {
              path: "purchase-order",
              lazy: async () => ({
                Component: (await import("app/pages/purchases/purchase-order"))
                  .default,
              }),
            },
            {
              path: "purchase-order/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/purchases/purchase-order/form"))
                  .default,
              }),
            },
            {
              path: "purchase-order/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/purchases/purchase-order/form"))
                  .default,
              }),
            },
            {
              path: "purchase-receipt",
              lazy: async () => ({
                Component: (await import("app/pages/purchases/purchase-receipt"))
                  .default,
              }),
            },
            {
              path: "purchase-receipt/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/purchases/purchase-receipt/form"))
                  .default,
              }),
            },
            {
              path: "purchase-receipt/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/purchases/purchase-receipt/form"))
                  .default,
              }),
            },
            {
              path: "purchase-invoice",
              lazy: async () => ({
                Component: (await import("app/pages/purchases/purchase-invoice"))
                  .default,
              }),
            },
            {
              path: "purchase-invoice/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/purchases/purchase-invoice/form"))
                  .default,
              }),
            },
            {
              path: "purchase-invoice/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/purchases/purchase-invoice/form"))
                  .default,
              }),
            },

          ]
        },
        {
          path: "sales",
          children: [
            {
              index: true,
              element: <Navigate to="/sales/customer" />,
            },
            {
              path: "customer",
              lazy: async () => ({
                Component: (await import("app/pages/sales/customer"))
                  .default,
              }),
            },
            {
              path: "customer/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/sales/customer/form"))
                  .default,
              }),
            },
            {
              path: "customer/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/sales/customer/form"))
                  .default,
              }),
            },
            {
              path: "site",
              lazy: async () => ({
                Component: (await import("app/pages/sales/site"))
                  .default,
              }),
            },
            {
              path: "site/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/sales/site/form"))
                  .default,
              }),
            },
            {
              path: "site/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/sales/site/form"))
                  .default,
              }),
            },
            {
              path: "quotation",
              lazy: async () => ({
                Component: (await import("app/pages/sales/quotation"))
                  .default,
              }),
            },
            {
              path: "quotation/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/sales/quotation/form"))
                  .default,
              }),
            },
            {
              path: "quotation/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/sales/quotation/form"))
                  .default,
              }),
            },
            {
              path: "sales-order",
              lazy: async () => ({
                Component: (await import("app/pages/sales/sales-order"))
                  .default,
              }),
            },
            {
              path: "sales-order/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/sales/sales-order/form"))
                  .default,
              }),
            },
            {
              path: "sales-order/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/sales/sales-order/form"))
                  .default,
              }),
            },
            {
              path: "schedule",
              lazy: async () => ({
                Component: (await import("app/pages/sales/schedule"))
                  .default,
              }),
            },
            {
              path: "schedule/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/sales/schedule/form"))
                  .default,
              }),
            },
            {
              path: "schedule/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/sales/schedule/form"))
                  .default,
              }),
            },
            {
              path: "delivery-challan",
              lazy: async () => ({
                Component: (await import("app/pages/sales/delivery-challan"))
                  .default,
              }),
            },
            {
              path: "delivery-challan/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/sales/delivery-challan/form"))
                  .default,
              }),
            },
            {
              path: "delivery-challan/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/sales/delivery-challan/form"))
                  .default,
              }),
            },
            {
              path: "sales-invoice",
              lazy: async () => ({
                Component: (await import("app/pages/sales/sales-invoice"))
                  .default,
              }),
            },
            {
              path: "sales-invoice/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/sales/sales-invoice/form"))
                  .default,
              }),
            },
            {
              path: "sales-invoice/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/sales/sales-invoice/form"))
                  .default,
              }),
            },

          ]
        },
        {
          path: "labs",
          children: [
            {
              index: true,
              element: <Navigate to="/labs/recipe" />,
            },
            {
              path: "recipe",
              lazy: async () => ({
                Component: (await import("app/pages/labs/recipe"))
                  .default,
              }),
            },
            {
              path: "recipe/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/labs/recipe/form"))
                  .default,
              }),
            },
            {
              path: "recipe/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/labs/recipe/form"))
                  .default,
              }),
            },
            {
              path: "grade",
              lazy: async () => ({
                Component: (await import("app/pages/labs/grade"))
                  .default,
              }),
            },
            {
              path: "grade/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/labs/grade/form"))
                  .default,
              }),
            },
            {
              path: "grade/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/labs/grade/form"))
                  .default,
              }),
            },
            {
              path: "cube-testing-register",
              lazy: async () => ({
                Component: (await import("app/pages/labs/cube-testing-register"))
                  .default,
              }),
            },
            {
              path: "cube-testing-register/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/labs/cube-testing-register/form"))
                  .default,
              }),
            },
            {
              path: "cube-testing-register/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/labs/cube-testing-register/form"))
                  .default,
              }),
            },
          ]
        },
        {
          path: "fleets",
          children: [
            {
              index: true,
              element: <Navigate to="/fleets/vehicle" />,
            },
            {
              path: "vehicle",
              lazy: async () => ({
                Component: (await import("app/pages/fleets/vehicle"))
                  .default,
              }),
            },
            {
              path: "vehicle/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/fleets/vehicle/form"))
                  .default,
              }),
            },
            {
              path: "vehicle/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/fleets/vehicle/form"))
                  .default,
              }),
            },
            {
              path: "driver",
              lazy: async () => ({
                Component: (await import("app/pages/fleets/driver"))
                  .default,
              }),
            },
            {
              path: "driver/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/fleets/driver/form"))
                  .default,
              }),
            },
            {
              path: "driver/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/fleets/driver/form"))
                  .default,
              }),
            },
          ]
        },
        {
          path: "employee",
          children: [
            {
              index: true,
              element: <Navigate to="/employee/expense-claim" />,
            },
            {
              path: "expense-claim",
              lazy: async () => ({
                Component: (await import("app/pages/employee/expense-claim"))
                  .default,
              }),
            },
            {
              path: "expense-claim/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/employee/expense-claim/form"))
                  .default,
              }),
            },
            {
              path: "expense-claim/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/employee/expense-claim/form"))
                  .default,
              }),
            },
            {
              path: "leave-application",
              lazy: async () => ({
                Component: (await import("app/pages/employee/leave-application"))
                  .default,
              }),
            },
            {
              path: "leave-application/add-new",
              lazy: async () => ({
                Component: (await import("app/pages/employee/leave-application/form"))
                  .default,
              }),
            },
            {
              path: "leave-application/edit/:id",
              lazy: async () => ({
                Component: (await import("app/pages/employee/leave-application/form"))
                  .default,
              }),
            },
          ]
        },
      ]
    },
    {
      Component: AppLayout,
      children: [
        {
          path: "dashboards",
          children: [
            {
              path: "opportunity",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/opportunity")).default,
              }),
            },
            {
              path: "task",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/task")).default,
              }),
            },
          ],
        },
        {
          path: "settings",
          lazy: async () => ({
            Component: (await import("app/pages/settings/Layout")).default,
          }),
          children: [
            {
              index: true,
              element: <Navigate to="/settings/general" />,
            },
            {
              path: "general",
              lazy: async () => ({
                Component: (await import("app/pages/settings/sections/General"))
                  .default,
              }),
            },
            {
              path: "appearance",
              lazy: async () => ({
                Component: (
                  await import("app/pages/settings/sections/Appearance")
                ).default,
              }),
            },
            {
              path: "sessions",
              lazy: async () => ({
                Component: (
                  await import("app/pages/settings/sections/Sessions")
                ).default,
              }),
            }
          ],
        },
      ],
    },
  ]
};

export { protectedRoutes };
