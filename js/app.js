const formBook = document.getElementById('book-form');
const formSearch = document.getElementById('search-form');
const bookDatalist = document.getElementById('book-titles');
const dialog = document.querySelector('.dialog');
const bookshelf = new Bookshelf();
const bookStorage = new BookStorage();

document.addEventListener('DOMContentLoaded', () => {
    bookStorage.getAll()?.forEach(book => bookshelf.add(book));
    document.dispatchEvent(new Event(BookConfiguration.EVENT.RENDER));
});

document.addEventListener(BookConfiguration.EVENT.RENDER, event => {
    const uncompletedSection = document.getElementById('books-uncompleted');
    const completedSection = document.getElementById('books-completed');
    const uncompletedBadge = document.querySelector(
        '#tab-uncompleted > .badge'
    );
    const completedBadge = document.querySelector('#tab-completed > .badge');
    uncompletedSection.innerHTML = '';
    completedSection.innerHTML = '';
    uncompletedBadge.textContent = '0';
    completedBadge.textContent = '0';

    const bookQuery = event.detail;
    const uncompletedBooks = bookshelf.getUncompletedBooks(bookQuery);
    const completedBooks = bookshelf.getCompletedBooks(bookQuery);

    uncompletedBooks.forEach(book =>
        uncompletedSection.append(createBookItem(book))
    );
    completedBooks.forEach(book =>
        completedSection.append(createBookItem(book))
    );

    if (uncompletedBooks.length === 0)
        uncompletedSection.innerHTML = createEmptyBook();

    if (completedBooks.length === 0)
        completedSection.innerHTML = createEmptyBook();

    uncompletedBadge.textContent = uncompletedBooks.length;
    completedBadge.textContent = completedBooks.length;

    bookDatalist.innerHTML = createDataList(
        bookshelf.getAllBooks().map(b => b.title)
    );

    uncompletedSection.addEventListener('click', handleBookActions);
    completedSection.addEventListener('click', handleBookActions);
});

function handleBookActions(event) {
    const elementClass = event.target.className;
    if (elementClass.includes('btn-read')) {
        const bookId = +event.target.closest('.book').dataset.id;
        bookshelf.changeCompleted(bookId);
        document.dispatchEvent(new Event(BookConfiguration.EVENT.RENDER));
        bookStorage.save(bookshelf.getAllBooks());
    }

    if (elementClass.includes('btn-delete')) {
        const bookId = +event.target.closest('.book').dataset.id;
        document.dispatchEvent(
            new CustomEvent(BookConfiguration.EVENT.DELETE_CONFIRM, {
                detail: bookId,
            })
        );
    }
}

document.addEventListener(BookConfiguration.EVENT.DELETE_CONFIRM, event => {
    dialog.classList.remove('dialog-is-hidden');

    const btnClose = document.querySelector('.btn-close');
    btnClose.addEventListener('click', () =>
        dialog.classList.add('dialog-is-hidden')
    );

    const btnConfirm = document.querySelector('.btn-confirm');
    btnConfirm.addEventListener('click', () => {
        const bookId = event.detail;
        bookshelf.remove(bookId);
        document.dispatchEvent(new Event(BookConfiguration.EVENT.RENDER));
        bookStorage.save(bookshelf.getAllBooks());
        dialog.classList.add('dialog-is-hidden');
    });
});

formBook.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(event.target);
    const { title, author, year, completed } = Object.fromEntries(data);
    const isComplete = completed === 'on';

    const book = new Book(title, author, year, isComplete);
    bookshelf.add(book);

    document.dispatchEvent(new Event(BookConfiguration.EVENT.RENDER));
    bookStorage.save(bookshelf.getAllBooks());
    formBook.reset();
});

formSearch.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(formSearch);
    const query = data.get('keyword');

    document.dispatchEvent(
        new CustomEvent(BookConfiguration.EVENT.RENDER, { detail: query })
    );
    formSearch.reset();
});

document.addEventListener(BookConfiguration.EVENT.DELETE_CONFIRM, event => {
    dialog.classList.remove('dialog-is-hidden');

    const btnClose = document.querySelector('.btn-close');
    btnClose.addEventListener('click', () =>
        dialog.classList.add('dialog-is-hidden')
    );

    const btnConfirm = document.querySelector('.btn-confirm');
    btnConfirm.addEventListener('click', () => {
        const bookId = event.detail;
        bookshelf.remove(bookId);
        document.dispatchEvent(new Event(BookConfiguration.EVENT.RENDER));
        bookStorage.save(bookshelf.getAllBooks());
        dialog.classList.add('dialog-is-hidden');
    });
});

function createBookItem(book) {
    const bookItem = `<article class="book" role="listitem" data-id=${book.id}>
        <div class="book-img">
            <div class="book-case"></div>
            <div class="book-cover">Book</div>
        </div>
        <section class="book-description">
            <h3 class="book-heading">
                ${book.title}
            </h3>
            <p class="book-body">${book.author}</p>
            <p class="book-body">Tahun ${book.year}</p>
            <div class="book-actions">
                <button
                    class="btn btn-icon btn-read btn-read-${
                        book.isComplete ? 'fill' : 'outline'
                    }"
                ></button>
                <button
                    class="btn btn-icon btn-delete"
                ></button>
            </div>
        </section>
    </article>`;
    const bookTemplate = document.createElement('template');
    bookTemplate.innerHTML = bookItem;
    return bookTemplate.content;
}

function createEmptyBook() {
    const emptyContent = `<h3 class="alert">Maaf, tidak ada buku dalam kategori ini!</h3>`;
    return emptyContent;
}

function createDataList(datas) {
    return datas.map(data => `<option>${data}</option>`).join('');
}
