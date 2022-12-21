class Bookshelf {
    constructor() {
        this._books = [];
    }

    add(book) {
        this._books.push(book);
    }

    remove(id) {
        this._books = this._books.filter(book => book.id !== id);
    }

    changeCompleted(id) {
        const book = this._books.find(book => book.id === id);
        book.isComplete = !book.isComplete;
    }

    getAllBooks() {
        return this._books;
    }

    getCompletedBooks(keyword = '') {
        const books = this._books.filter(book => book.isComplete);
        return keyword === '' ? books : this._searchBook(books, keyword);
    }

    getUncompletedBooks(keyword = '') {
        const books = this._books.filter(book => !book.isComplete);
        return keyword === '' ? books : this._searchBook(books, keyword);
    }

    _searchBook(books, keyword) {
        return books.filter(book =>
            book.title.toLowerCase().includes(keyword.toLowerCase())
        );
    }
}
