import * as UU5 from "uu5g04";
import { ensureFunction } from "./functions-helper.js";

function setInProgress(item) {
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
  addItem(list, newItem, setNewItemCallback) {
    setNewItemCallback = ensureFunction(setNewItemCallback);

    // set flag
    newItem = setInProgress(newItem);
    setNewItemCallback(newItem);

    // add item
    return [...list, newItem];
  },

  updateItemProgress(list, newItem, setOriginalCallback) {
    setOriginalCallback = ensureFunction(setOriginalCallback);
    return list.map(item => {
      if (item.id === newItem.id) {
        setOriginalCallback(item);
        return setInProgress(newItem);
      } else {
        return item;
      }
    });
  },

  updateItemFinal(list, finalItem) {
    return list.map(item => {
      if (isSameItem(item, finalItem)) {
        return removeInProgress(finalItem);
      } else {
        return item;
      }
    });
  },

  // remove item with same id or same _inProgress id
  removeItem(list, removeItem) {
    return list.filter(item => !isSameItem(item, removeItem));
  }
};

export default ArrayUtils;
