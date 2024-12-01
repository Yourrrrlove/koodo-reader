import ConfigService from "../../utils/service/configService";
import SortUtil from "../../utils/reader/sortUtil";
import BookModel from "../../models/Book";
import PluginModel from "../../models/Plugin";
import { Dispatch } from "redux";
import AddTrash from "../../utils/reader/addTrash";
import PluginService from "../../utils/service/pluginService";
import BookService from "../../utils/service/bookService";

export function handleBooks(books: BookModel[]) {
  return { type: "HANDLE_BOOKS", payload: books };
}
export function handlePlugins(plugins: PluginModel[]) {
  return { type: "HANDLE_PLUGINS", payload: plugins };
}
export function handleDeletedBooks(deletedBooks: BookModel[]) {
  return { type: "HANDLE_DELETED_BOOKS", payload: deletedBooks };
}
export function handleSearchResults(searchResults: number[]) {
  return { type: "HANDLE_SEARCH_BOOKS", payload: searchResults };
}
export function handleSearch(isSearch: boolean) {
  return { type: "HANDLE_SEARCH", payload: isSearch };
}
export function handleTipDialog(isTipDialog: boolean) {
  return { type: "HANDLE_TIP_DIALOG", payload: isTipDialog };
}
export function handleDetailDialog(isDetailDialog: boolean) {
  return { type: "HANDLE_DETAIL_DIALOG", payload: isDetailDialog };
}
export function handleTip(tip: string) {
  return { type: "HANDLE_TIP", payload: tip };
}
export function handleSetting(isSettingOpen: boolean) {
  return { type: "HANDLE_SETTING", payload: isSettingOpen };
}
export function handleAbout(isAboutOpen: boolean) {
  return { type: "HANDLE_ABOUT", payload: isAboutOpen };
}
export function handleViewMode(mode: string) {
  return { type: "HANDLE_VIEW_MODE", payload: mode };
}

export function handleSortDisplay(isSortDisplay: boolean) {
  return { type: "HANDLE_SORT_DISPLAY", payload: isSortDisplay };
}
export function handleLoadingDialog(isShowLoading: boolean) {
  return { type: "HANDLE_SHOW_LOADING", payload: isShowLoading };
}
export function handleNewDialog(isShowNew: boolean) {
  return { type: "HANDLE_SHOW_NEW", payload: isShowNew };
}
export function handleSelectBook(isSelectBook: boolean) {
  return { type: "HANDLE_SELECT_BOOK", payload: isSelectBook };
}
export function handleSelectedBooks(selectedBooks: string[]) {
  return { type: "HANDLE_SELECTED_BOOKS", payload: selectedBooks };
}
export function handleNewWarning(isNewWarning: boolean) {
  return { type: "HANDLE_NEW_WARNING", payload: isNewWarning };
}
export function handleBookSort(isBookSort: boolean) {
  return { type: "HANDLE_BOOK_SORT", payload: isBookSort };
}
export function handleNoteSort(isNoteSort: boolean) {
  return { type: "HANDLE_NOTE_SORT", payload: isNoteSort };
}
export function handleFeedbackDialog(mode: boolean) {
  return { type: "HANDLE_FEEDBACK_DIALOG", payload: mode };
}
export function handleBookSortCode(bookSortCode: {
  sort: number;
  order: number;
}) {
  return { type: "HANDLE_SORT_CODE", payload: bookSortCode };
}

export function handleNoteSortCode(noteSortCode: {
  sort: number;
  order: number;
}) {
  return { type: "HANDLE_NOTE_SORT_CODE", payload: noteSortCode };
}

export function handleFetchBooks() {
  return (dispatch: Dispatch) => {
    BookService.getAllBooks().then((value) => {
      let bookArr: any = value;
      let keyArr = AddTrash.getAllTrash();
      dispatch(handleDeletedBooks(handleKeyFilter(bookArr, keyArr)));
      dispatch(handleBooks(handleKeyRemove(bookArr, keyArr)));
    });
  };
}

export function handleFetchPlugins() {
  return async (dispatch: Dispatch) => {
    PluginService.getAllPlugins().then((value) => {
      if (!value) {
        value =
          localStorage.getItem("pluginList") !== "{}" &&
          localStorage.getItem("pluginList")
            ? JSON.parse(localStorage.getItem("pluginList") || "")
            : [];
      }
      dispatch(handlePlugins(value));
    });
  };
}
export function handleFetchBookSortCode() {
  return (dispatch: Dispatch) => {
    let bookSortCode = SortUtil.getBookSortCode();
    dispatch(handleBookSortCode(bookSortCode));
  };
}
export function handleFetchNoteSortCode() {
  return (dispatch: Dispatch) => {
    let noteSortCode = SortUtil.getNoteSortCode();
    dispatch(handleNoteSortCode(noteSortCode));
  };
}
export function handleFetchList() {
  return (dispatch: Dispatch) => {
    let viewMode = ConfigService.getReaderConfig("viewMode") || "card";
    dispatch(handleViewMode(viewMode));
  };
}
const handleKeyRemove = (items: any[], arr: string[]) => {
  if (!items) return [];
  let itemArr: any[] = [];
  if (!arr[0]) {
    return items;
  }
  for (let item of items) {
    if (arr.indexOf(item.key) === -1) {
      itemArr.push(item);
    }
  }

  return itemArr;
};
const handleKeyFilter = (items: any[], arr: string[]) => {
  if (!items) {
    return [];
  }
  let itemArr: any[] = [];
  for (let item of items) {
    if (arr.indexOf(item.key) > -1) {
      itemArr.push(item);
    }
  }
  return itemArr;
};
