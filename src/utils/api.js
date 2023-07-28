import axios from "axios";

const booksUrl = axios.create({
    baseURL: "https://www.googleapis.com/books/v1/volumes",
});
export const getBookByIsbn = (isbn) => {
    return booksUrl.get(`?q=isbn:${isbn}`).then((response) => {
        return response.data.items
    });
};

export const getBookByTitle = (title) => {
    console.log(title)
    return booksUrl.get(`?q=intitle:${title}`).then((response) => {
        console.log(response.data.items.slice(0, 3))
    })
}

// GOOGLE API ENDPOINTS
// isbn = ?q=isbn:${isbn}
//book by title = ?q=intitle:${title}
