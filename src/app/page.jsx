"use client";
import Login from "@/components/Login";
import { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { database } from "@/firebase/config";
import {Html5QrcodeScanner} from "html5-qrcode";
import { getBookByIsbn } from "@/utils/api";


//THIS IS OUR HOME PAGE

export default function Home() {
  const [data, setData] = useState([]);

function bookScanner() {
  function onScanSuccess(decodedText, decodedResult) {
    // handle the scanned code as you like, for example:
    if (decodedText.length === 13 || decodedText.length === 10 ) {
      console.log(`Code matched = ${decodedText}`, decodedResult);
      document.getElementById("result").innerHTML=`<p>${decodedText}</p>`
      html5QrcodeScanner.clear()
      document.getElementById("reader").remove()
      getBookByIsbn(decodedText).then((book) => {
        setData(book)
      }).catch(error => console.log(error))
    }
  }
  
  function onScanFailure(error) {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
  }
  
  let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    { fps: 10, qrbox: {width: 250, height: 250},  },
    /* verbose= */ false);
  return html5QrcodeScanner.render(onScanSuccess, onScanFailure);
}
  
  const handleChange = (event) => {
    const filteredData = data.filter((singleData) => {
      return singleData.name
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    setData(filteredData);
  };
  const sendData = async (event) => {
    // event.preventDefault()
    try {
      const response = await addDoc(collection(database, "userData"), {
        first: "Ola",
        last: "Mobayed",
        born: 199,
      });
      console.log("Document written with ID: ", response.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const getData = async () => {
    try {
        const response = await getDocs(collection(database, "userData"));

        response.forEach((doc) => {
            // console.log(doc.data() );
            setDataFromDb((currentData) => {
                return [
                    ...currentData,
                    {
                       id: doc.id,
                       user: doc.data()
                    }
                ]
            })
    
          });
    } catch (error) {
        console.log(error)
    }
  };
  const [dataFromDb, setDataFromDb] = useState([])
  console.log(dataFromDb, "data from db")

  return (
    <main>
      <h1>Welcome to our Site</h1>
      <button onClick={bookScanner}>Click to scan QR code</button>
      <div id='reader'></div>
      <div id='result'></div>
      <input type="text" onChange={handleChange} />
      {data.map((singleData) => {
        return (
          <div key={singleData.id} className="single__data">
            <p>Title: {singleData.volumeInfo.title}</p>
            <p>Author: {singleData.volumeInfo.authors[0]}</p>
            <img src={singleData.volumeInfo.imageLinks.smallThumbnail}/>
            {/* <img src={singleData.volumeInfo.imageLinks.thumbnail}/> */}
          </div>
        );
      })}
      <Login />
      <button onClick={sendData}>Send data</button>
      <button onClick={getData}>Get data</button>
      <div>
        <h1>Data from db</h1>
        {dataFromDb.map((item) => {
            return <div key={item.id}>
                <p>{item.user.first}</p>
                <p>{item.user.last}</p>
                <p>{item.user.born}</p>
            </div>
        })}
      </div>
    </main>
  );
}
