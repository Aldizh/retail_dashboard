import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      home: 'Home',
      title: 'Grocery Market',
      sales: 'Sales',
      category: 'Select a category from the list',
      small: 'Small Volume Sales',
      big: 'Large Volume Sales',
      inventory: "Current Inventory",
      inventoryEntry: 'Enter Item',
      dataEntry: 'Sales Entry',
      edit: 'Edit',
      barCode: 'Item ID',
      item: 'Item',
      buyPrice: 'Buy Price',
      sellPrice: 'Sell Price',
      buyPriceNew: 'New Buying Price',
      sellPriceNew: 'New Selling Price',
      nameNew: 'New Name',
      profit: 'Profit',
      totals: 'Totals',
      totalBuys: 'Total Buys',
      totalSales: 'Total Sales',
      totalProfit: 'Total Profit',
      dataCorrection: 'Item Inventory',
      delete: 'Delete',
      correct: 'Correct',
      newSale: 'New Entry',
      updateSale: 'Update Entry',
      quantity: 'Quantity',
      quantityNew: 'New Quantity',
      anonymous: 'Enter as anonymous',
      authenticated: 'Enter with key',
      loadAll: 'Load Test Data',
      deleteAll: 'Delete Test Data',
    },
  },
  al: {
    translation: {
      home: 'Kreu',
      title: 'Ushqimore',
      sales: 'Shitjet',
      category: 'Zgjidh nje nga kategorite',
      small: 'Shitjet me Pakice',
      big: 'Shitjet me Shumice',
      inventory: "Iventari Aktual",
      inventoryEntry: 'Artikull i ri',
      dataEntry: 'Shitje e Re',
      edit: 'Korrigjo',
      barCode: 'Kodi i Artikullit',
      item: 'Artikulli',
      buyPrice: 'Cmimi i Blerjes',
      sellPrice: 'Cmimi i Shitjes',
      buyPriceNew: 'Cmimi i Ri i Blerjes',
      sellPriceNew: 'Cmimi i Ri i Shitjes',
      nameNew: 'Emri i ri',
      profit: 'Fitimi (Leke te reja)',
      totals: 'Totalet',
      totalBuys: 'Blerjet Totale',
      totalSales: 'Shitjet Totale',
      totalProfit: 'Fitimi Total',
      dataCorrection: 'Artikulli',
      delete: 'Fshi',
      correct: 'Korrigjo',
      newSale: 'Regjistro te dhenat ',
      updateSale: 'Korrigjo te dhenat',
      quantity: 'Sasia',
      quantityNew: 'Sasia e Re',
      anonymous: 'Hyr si Anonim',
      authenticated: 'Hyr me celes',
      loadAll: 'Ngarko te dhena prove',
      deleteAll: 'Fshi te dhenat prove',
    },
  },
  es: {
    translation: {
      home: 'Inicio',
      title: 'Mercado de Comestibles',
      sales: 'Ventas',
      category: 'Selecciona una categoría de la lista',
      small: 'Ventas en Pequeñas Cantidades',
      big: 'Ventas en Grandes Cantidades',
      inventory: "Artículos",
      inventoryEntry: 'Ingresar Artículo',
      dataEntry: 'Registro de Ventas',
      edit: 'Editar',
      barCode: 'ID del Artículo',
      item: 'Artículo',
      buyPrice: 'Precio de Compra',
      sellPrice: 'Precio de Venta',
      buyPriceNew: 'Nuevo Precio de Compra',
      sellPriceNew: 'Nuevo Precio de Venta',
      nameNew: 'Nuevo Nombre',
      profit: 'Ganancia',
      totals: 'Totales',
      totalBuys: 'Compras Totales',
      totalSales: 'Ventas Totales',
      totalProfit: 'Ganancia Total',
      dataCorrection: 'Inventario de Artículos',
      delete: 'Eliminar',
      correct: 'Corregir',
      newSale: 'Nuevo Registro',
      updateSale: 'Actualizar Registro',
      quantity: 'Cantidad',
      quantityNew: 'Nueva Cantidad',
      anonymous: 'Ingresar como anónimo',
      authenticated: 'Ingresar con clave',
      loadAll: 'Cargar Datos de Prueba',
      deleteAll: 'Eliminar Datos de Prueba',
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    lngs: ['en', 'al', 'es'],
    defaultLanguage: 'en',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
