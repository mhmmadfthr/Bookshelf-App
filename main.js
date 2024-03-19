document.addEventListener("DOMContentLoaded", function() {
    const STORAGE_KEY = "bookshelf";

    let books = [];

    function refreshData(filteredBooks = books) {
        const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
        const completeBookshelfList = document.getElementById("completeBookshelfList");

        incompleteBookshelfList.innerHTML = "";
        completeBookshelfList.innerHTML = "";

        filteredBooks.forEach(function(book) {
            const bookElement = createBookElement(
                book.id,
                book.title,
                book.author,
                book.year,
                book.isComplete
            );

            if (book.isComplete) {
                completeBookshelfList.appendChild(bookElement);
            } else {
                incompleteBookshelfList.appendChild(bookElement);
            }
        });
    }

    function createBookElement(id, title, author, year, isComplete) {
        const bookElement = document.createElement("article");
        bookElement.classList.add("book_item");
        const h3 = document.createElement("h3");
        h3.innerText = title;
        const pAuthor = document.createElement("p");
        pAuthor.innerText = "Penulis: " + author;
        const pYear = document.createElement("p");
        pYear.innerText = "Tahun: " + year;

        const divAction = document.createElement("div");
        divAction.classList.add("action");
        const buttonDelete = document.createElement("button");
        buttonDelete.classList.add("blue");
        buttonDelete.innerText = "Hapus buku";

        buttonDelete.addEventListener("click", function() {
            deleteBook(id);
        });
        const buttonToggle = document.createElement("button");
        buttonToggle.classList.add(isComplete ? "green" : "blue");
        buttonToggle.innerText = isComplete ?
            "Belum selesai di Baca" :
            "Selesai dibaca";
        buttonToggle.addEventListener("click", function() {
            toggleBook(id);
        });

        divAction.appendChild(buttonToggle);
        divAction.appendChild(buttonDelete);

        bookElement.appendChild(h3);
        bookElement.appendChild(pAuthor);
        bookElement.appendChild(pYear);
        bookElement.appendChild(divAction);

        return bookElement;
    }

    function saveData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
        document.dispatchEvent(new Event("ondatasaved"));
    }

    function loadDataFromStorage() {
        const serializedData = localStorage.getItem(STORAGE_KEY);

        let data = JSON.parse(serializedData);

        if (data !== null) books = data;

        document.dispatchEvent(new Event("ondataloaded"));
    }

    function findBook(bookId) {
        for (book of books) {
            if (book.id === bookId) return book;
        }
        return null;
    }

    function findBookIndex(bookId) {
        let index = 0;
        for (book of books) {
            if (book.id === bookId) return index;

            index++;
        }
        return -1;
    }

    function addBook() {
        const inputBookTitle = document.getElementById("inputBookTitle").value;
        const inputBookAuthor = document.getElementById("inputBookAuthor").value;
        const inputBookYear = document.getElementById("inputBookYear").value;
        const inputBookIsComplete = document.getElementById("inputBookIsComplete")
            .checked;

        const newBook = {
            id: +new Date(),
            title: inputBookTitle,
            author: inputBookAuthor,
            year: inputBookYear,
            isComplete: inputBookIsComplete,
        };

        books.push(newBook);
        saveData();
        showNotification("Buku berhasil ditambahkan ke rak!");
    }

    function deleteBook(bookId) {
        const index = findBookIndex(bookId);
        books.splice(index, 1);
        saveData();
        showNotification("Buku telah dihapus dari rak!")
    }

    function toggleBook(bookId) {
        const index = findBookIndex(bookId);
        books[index].isComplete = !books[index].isComplete;
        saveData();
        const message = books[index].isComplete ? "Buku telah selesai dibaca!" : "Buku ditandai belum selesai dibaca!";
        showNotification(message);
    }

    function searchBook() {
        const searchBookTitle = document.getElementById("searchBookTitle").value;
        const filteredBooks = books.filter((book) =>
            book.title.toLowerCase().includes(searchBookTitle.toLowerCase())
        );
        refreshData(filteredBooks);
    }

    loadDataFromStorage();

    document.getElementById("inputBook").addEventListener("submit", function(event) {
        event.preventDefault();
        addBook();
    });

    document.getElementById("searchBook").addEventListener("submit", function(event) {
        event.preventDefault();
        searchBook();
    });

    document.addEventListener("ondatasaved", () => {
        console.log("Data berhasil disimpan.");
        refreshData();
    });

    document.addEventListener("ondataloaded", () => {
        console.log("Data berhasil dimuat.");
        refreshData();
    });
});

function showNotification(message) {
    const notification = document.getElementById("notification");
    notification.innerText = message;
    notification.classList.add("show");
    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}