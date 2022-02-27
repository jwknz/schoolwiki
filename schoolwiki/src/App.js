import React, { useEffect } from 'react'
import { useGoogleLogin } from 'react-use-googlelogin'

import './App.css'

const App = () => {

  const { signIn, signOut, googleUser, isSignedIn } = useGoogleLogin({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    scope: process.env.REACT_APP_GOOGLE_SCOPES
  })

  useEffect(() => {

    // function createDoc() {

    //   fetch('https://docs.googleapis.com/v1/documents', {
    //     method: "POST",
    //     headers: new Headers({ 'Authorization': 'Bearer '+ googleUser.accessToken}),
    //   })
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log(data.documentId)
    //   })
    // }
  
    // function createSheet() {
  
    //   fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    //     method: "POST",
    //     headers: new Headers({ 'Authorization': 'Bearer '+ googleUser.accessToken}),
    //   })
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log(data.documentId)
    //   })
    // }
  
    function processText(text, pstyle, el) {
  
      let div = document.createElement('div')
      div.style.padding = "10px"
  
      if ( pstyle === "TITLE" ) {
  
        let h1 = document.createElement('h1')
        let h1Text = document.createTextNode(text)
        h1.appendChild(h1Text)
        div.appendChild(h1)
        el.appendChild(div)
  
      } else {
  
        div.innerHTML = text
        el.appendChild(div)
        
      }
    }
  
    function processImage(imageURL, el) {
      let img = document.createElement('img')
      img.setAttribute('src', imageURL)
      img.setAttribute('alt', 'doc-image')
      img.style.width = "60%"
      img.style.maxWidth = "400px"
      img.style.borderWidth = "1px"
      img.style.borderStyle = "solid"
  
      el.appendChild(img)
    }
  
    function showJSONFile(file_id, googleUser) {
  
      //File must match Post schema - for now
      //There must be a google doc with the same filename as the json file
  
      let url = `https://www.googleapis.com/drive/v3/files/${file_id}`
  
      const params = {
        alt: "media"
      };
  
      const options = {
        method: "GET",
        headers: new Headers({ 'Authorization': 'Bearer '+ googleUser.accessToken}),
      };
  
      let final_url = options.method === "GET" ? url += '?' + ( new URLSearchParams( params ) ).toString() : options.body(params)
  
      return fetch(final_url, options)
      .then(res => res.json())
      .then(data => {
  
        let json_url_check = data.info.schema.includes("https://schema.getpostman.com/json/collection/")
  
        if (json_url_check) {
  
          return fetch(`${data.item[0].request.url.raw}`, {
            method: `${data.item[0].request.method}`,
            //headers: new Headers({ data.item[0].request.auth.apikey[1].key : data.item[0].request.auth.apikey[0].key })
            headers: new Headers({ "X-AUTH-TOKEN" : "47a07614-dc50-4bad-bdc4-cb18ae0c0cf7" })
          })
          .then(res => res.json())
          .then(data => console.log(data))
  
        } else {
          console.log("not a valid file")
        }
  
      })
  
        //let getFileName = 
  
  
    }
  
    function showDocument(file_id, googleUser) {
  
      console.log(file_id)
      //console.log(googleUser.accessToken)
  
      fetch('https://docs.googleapis.com/v1/documents/' + file_id, {
        method: "GET",
        headers: new Headers({ 'Authorization': 'Bearer '+ googleUser.accessToken}),
      })
      .then(res => res.json())
      .then(data => {
  
        let allcontent = data.body.content.filter(d => d.hasOwnProperty("startIndex"))
  
        //console.log(allcontent)
  
        let getImage = (imageId) => data.inlineObjects[imageId].inlineObjectProperties.embeddedObject.imageProperties.contentUri
  
        let contentDiv = document.querySelector('#content')
        contentDiv.innerHTML = ""
  
        //Create Div for document
        let mainDiv = document.createElement('div')
  
        for(let content of allcontent) {
  
          let item = content.paragraph.elements
  
          item[0].hasOwnProperty('textRun') ? 
            processText(item[0].textRun.content, content.paragraph.paragraphStyle.namedStyleType , mainDiv) : 
            processImage(getImage(item[0].inlineObjectElement.inlineObjectId), mainDiv)
  
        }
  
        contentDiv.appendChild(mainDiv)
  
      })
    }

    function listFiles(googleUser) {

      //console.log(googleUser)
  
      let url = "https://www.googleapis.com/drive/v3/files"
  
      const params = {
        q: "trashed=false"
      };
  
      const options = {
        method: "GET",
        headers: new Headers({ 'Authorization': 'Bearer '+ googleUser.accessToken}),
      };
  
      let final_url = options.method === "GET" ? url += '?' + ( new URLSearchParams( params ) ).toString() : options.body(params)
  
      fetch(final_url, options)
      .then(res => res.json())
      .then(data => {
  
        let file_list = document.querySelector('#file_list')
        file_list.innerHTML = ""
  
        let ul = document.createElement('ul')
        file_list.appendChild(ul)
  
        for(let file of data.files) {
  
          // /console.log(file)
  
          let dash1 = document.createTextNode(" - ")
          let dash2 = document.createTextNode(" - ")
  
          let li = document.createElement('li')
          let liText = document.createTextNode(file.name)
  
          li.appendChild(liText)
          li.appendChild(dash1)
  
          if ( file.mimeType === "application/vnd.google-apps.document" ) {
            
            // If it is a doc
            let span = document.createElement('a')
            let spanText = document.createTextNode('View Below')
            span.setAttribute('href', "#");
            span.onclick = () => showDocument(file.id, googleUser)
            span.style.cursor = "pointer"
            span.appendChild(spanText)
            li.appendChild(span)
  
          } else if ( file.mimeType === "application/json" ) {
  
            // If it is a json file
            let span = document.createElement('a')
            let spanText = document.createTextNode('View Below')
            span.setAttribute('href', "#");
            span.onclick = () => showJSONFile(file.id, googleUser)
            span.style.cursor = "pointer"
            span.appendChild(spanText)
            li.appendChild(span)
  
          } else {
  
            let span = document.createElement('span')
            let spanText = document.createTextNode('NOT COMPLETED')
            span.appendChild(spanText)
            li.appendChild(span)
  
          }
  
          li.appendChild(dash2)
  
          let liText2 = document.createTextNode('Open in Drive')
          let anchor = document.createElement('a')
          anchor.setAttribute('href', `https://docs.google.com/document/d/${file.id}/edit`)
          anchor.setAttribute('target', '_blank')
  
          li.appendChild(anchor)
          anchor.appendChild(liText2)
  
          ul.appendChild(li)
  
        }
  
      })
  
    }

    if (googleUser !== undefined) {
      //showJSONFile("1HvzfsAGy8l62VsF24F0XBz96nJDG5Hjw", googleUser)
      listFiles(googleUser)
    }

  }, [googleUser])

  

  return (
    <div style={{ padding: '1rem' }}>

      {isSignedIn ? 
        <button onClick={signOut}>Sign Out</button> :
        <button onClick={signIn} style={{ marginRight: '1rem' }}>Sign in</button>
      }

      {isSignedIn && (
        <div>
          <h1>{googleUser.profileObj.name}</h1>
          <img src={googleUser.profileObj.imageUrl} alt="Avatar." />
          {/* <hr />
          <button onClick={() => this.createDoc()} >{"Create Doc"}</button>
          <button onClick={() => this.createSheet()} >{"Create Sheet"}</button> */}
          <hr/>
          <div id="file_list"></div>
          {/* <button onClick={() => listFiles()} >{"Show Files"}</button> */}
          <hr/>
          <div id="content" ></div>
          <hr/>
          <h1>Testing API Display</h1>
          <div id="json_content"></div>
        </div>
      )}
    </div>
  )
}

export default App