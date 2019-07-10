import Lsi from "../config/lsi.js";

export default {
  list: {
    cs: "Seznam vtipů",
    en: "List of jokes"
  },
  create: {
    cs: "Vytvořit vtip",
    en: "Create joke"
  },
  createHeader: {
    cs: "Vytvořit vtip",
    en: "Create joke"
  },
  updateHeader: {
    cs: "Upravit vtip",
    en: "Update joke"
  },
  deleteHeader: {
    cs: "Smazat vtip",
    en: "Delete joke"
  },

  deleteConfirm: {
    cs: 'Tato akce je nevratná. Opravdu chcete smazat vtip s názvem "%s"?',
    en: 'This action is permanent. Are you sure you want to delete joke "%s"?'
  },
  ...Lsi.buttons,

  filterByCategory: {
    cs: "Kategorie",
    en: "Category"
  },

  filterByImage: {
    cs: "Obrázku",
    en: "Image"
  },

  filterByUser: {
    cs: "Uživatele",
    en: "User"
  },

  filterByVisibility: {
    cs: "Publikace",
    en: "Published"
  },

  filterByRating: {
    cs: "Hodnocení",
    en: "Rating"
  }
};
