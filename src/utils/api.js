import axios from "axios";

const booksUrl = axios.create({
    baseURL: "https://www.googleapis.com/books/v1/volumes",
});
export const getBookByIsbn = (isbn) => {
    return booksUrl.get(`?q=isbn:${isbn}`).then((response) => {
        return response.data.items
    });
};