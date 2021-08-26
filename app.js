// Book Class: Represents a Book
class Book {
  constructor(title, author, genre) {
    this.title = title
    this.author = author
    this.genre = genre
    this.id = new Date().getTime()
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks()

    books.forEach((book) => UI.addBookToList(book))
  }

  static addBookToList(book) {
    console.log(book)
    const list = document.querySelector('#book-list')

    const row = document.createElement('tr')

    row.innerHTML = `
      <td><h4>${book.title}</h4></td>
      <td>${book.author}</td>
      <td>${book.genre}</td>
      <td><a href="#" class="btn  btn-outline-danger btn-sm delete"data-id=${book.id}>X</a></td>
    `

    list.appendChild(row)
  }

  static deleteBook(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove()
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div')
    div.className = `alert alert-${className}`
    div.appendChild(document.createTextNode(message))
    const container = document.querySelector('.container')
    const form = document.querySelector('#book-form')
    container.insertBefore(div, form)

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 1000)
  }

  static clearFields() {
    document.querySelector('#title').value = ''
    document.querySelector('#author').value = ''
    document.querySelector('#genre').value = ''
  }
}

// Store Class: Handles Storage
class Store {
  static getBooks() {
    let books
    if (localStorage.getItem('books') === null) {
      books = []
    } else {
      books = JSON.parse(localStorage.getItem('books'))
    }

    return books
  }

  static addBook(book) {
    const books = Store.getBooks()
    books.push(book)
    localStorage.setItem('books', JSON.stringify(books))
  }

  static removeBook(id) {
    const books = Store.getBooks()
    console.log(books)
    books.forEach((book, index) => {
      if ((book.id = id)) {
        books.splice(index, 1)
      }
    })

    localStorage.setItem('books', JSON.stringify(books))
  }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks)

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault()

  // Get form values
  const title = document.querySelector('#title').value
  const author = document.querySelector('#author').value
  const genre = document.querySelector('#genre').value

  // Validate
  if (title === '' || author === '' || genre === '') {
    UI.showAlert('Please fill in all fields', 'danger')
  } else {
    // Instatiate book
    const book = new Book(title, author, genre)

    // Add Book to UI
    UI.addBookToList(book)

    // Add book to store
    Store.addBook(book)

    // Show success message
    UI.showAlert('Book Added', 'success')

    // Clear fields
    UI.clearFields()
  }
})

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
  // Remove book from UI
  UI.deleteBook(e.target)

  // Remove book from store
  Store.removeBook(e.target.dataset.id)

  // Show success message
  UI.showAlert('Book Removed', 'success')
})
