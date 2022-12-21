class BookStorage {
    constructor() {
        this.key = BookConfiguration.STORAGE.KEY;
    }

    save(books) {
        if (!this._isStorageExist()) return;
        const data = JSON.stringify(books);
        localStorage.setItem(this.key, data);
    }

    getAll() {
        if (!this._isStorageExist()) return;
        const data = localStorage.getItem(this.key);
        const books = JSON.parse(data);
        return books;
    }

    _isStorageExist() {
        if (typeof Storage === undefined) {
            alert('Local storage not supported');
            return false;
        }
        return true;
    }
}
