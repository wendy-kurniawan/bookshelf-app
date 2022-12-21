class Book {
    constructor(title, author, year, isComplete = false) {
        this.id = +new Date();
        this.title = title;
        this.author = author;
        this.year = +year;
        this.isComplete = isComplete;
    }
}
