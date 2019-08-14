import * as UU5 from "uu5g04";
import { ensureFunction } from "./functions-helper.js";

/*
  _inProgress flag indicates the item is being work with - it is rendered as disabled to prevent any more actions
  it also serves as tempId for new items until they get the correct id from server request

  As it handles 2 things at once, it is a good idea to separate those principles into 2 flags.
 */
function setInProgress(item) {
  // generate tempId
  item._inProgress = UU5.Common.Tools.generateUUID();
  return item;
}

function removeInProgress(item) {
  delete item._inProgress;
  return item;
}

function isSameItem(itemA, itemB) {
  // same id or _inProgress id if exists
  return itemA.id === itemB.id || (itemA._inProgress && itemA._inProgress === itemB._inProgress);
}

export const ArrayUtils = {
  /**
   * Adds new item into given collection, sets the item as inProgress
   *
   * @param list Original collection
   * @param newItem New item to be added
   * @param setNewItemCallback Callback method to handle new item
   * @returns {*[]} Collection with added item
   */
  addItem(list, newItem, setNewItemCallback) {
    setNewItemCallback = ensureFunction(setNewItemCallback);

    // set flag
    newItem = setInProgress(newItem);
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
  updateItemProgress(list, updateItem, setOriginalCallback) {
    setOriginalCallback = ensureFunction(setOriginalCallback);
    return list.map(item => {
      if (item.id === updateItem.id) {
        setOriginalCallback(item);
        return setInProgress(updateItem);
      } else {
        return item;
      }
    });
  },

  /**
   * Removes _inProgress flag for given item in collection
   *
   * @param list Original collection
   * @param finalItem Item to remove _inProgress flag from
   * @returns {*}
   */
  updateItemFinal(list, finalItem) {
    return list.map(item => {
      if (isSameItem(item, finalItem)) {
        return removeInProgress(finalItem);
      } else {
        return item;
      }
    });
  },

  /**
   * Removes item with given id or tempId (_inProgress) from collection
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
