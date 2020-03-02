import { ensureFunction } from "./functions-helper.js";

function isSameItem(itemA, itemB) {
  // same id
  return itemA.id === itemB.id;
}

export const ArrayUtils = {
  /**
   * Adds new item into given collection
   *
   * @param list Original collection
   * @param newItem New item to be added
   * @param setNewItemCallback Callback method to handle new item
   * @returns {*[]} Collection with added item
   */
  addItem(list, newItem, setNewItemCallback) {
    setNewItemCallback = ensureFunction(setNewItemCallback);

    setNewItemCallback(newItem);

    // add item
    return [...list, newItem];
  },

  /**
   * Updates item in collection based on its id
   *
   * @param list Original collection
   * @param updateItem Item to update - must contain key id
   * @param setOriginalCallback Callback to handle original value
   * @returns {*}
   */
  updateItem(list, updateItem, setOriginalCallback) {
    setOriginalCallback = ensureFunction(setOriginalCallback);
    return list.map(item => {
      if (item.id === updateItem.id) {
        setOriginalCallback(item);
        return updateItem;
      } else {
        return item;
      }
    });
  },

  /**
   * Removes item with given id
   *
   * @param list Collection
   * @param removeItem Item to be removed
   * @returns {*}
   */
  removeItem(list, removeItem) {
    return list.filter(item => !isSameItem(item, removeItem));
  }
};

export default ArrayUtils;
