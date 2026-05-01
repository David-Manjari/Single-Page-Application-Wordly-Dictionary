

const wordInput = document.getElementById("word-input");
const submitButton = document.getElementById("search-button");
const displayResults = document.getElementById("search-results");
const errorMessage = document.getElementById("error-msg");


// add an event listener to start the fetching and display process
submitButton.addEventListener('click',(event) =>{
    event.preventDefault();

    // fetch data from the api by calling the fetchDictionaryAPI
    if(wordInput.value.trim() !== ''){
        fetchDictionaryAPI(wordInput.value.trim());
         errorMessage.textContent = '';
    }
    // provides an error mesage for empty output
    else{
        errorMessage.textContent = ''
        errorMessage.textContent = "Empty Input!!: Enter a Word";
        // const message = document.createElement('p')
        // message.textContent = "Empty input: Enter a word";
        // console.log('empty')
        // errorMessage.appendChild(message);
    }
    // clears the input
    if (wordInput.value !== '') { 
        wordInput.value = ''
    }
    // clears the previous input data
    if(displayResults !== ''){
        displayResults.textContent = ''
    }
})

function fetchDictionaryAPI(word) {
//
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)

    // create a memory for the fetched word object
    .then(function(response){
        return response.json();

    })

    // access the fetched data
    .then(data => {
        parseData(data);
    })

    // catch the error if input is wrong
    .catch(error => {
        errorMessage.textContent = "Word Not Available in Dictionary! Enter a Different WORD";
        console.log(error);
        // const message = document.createElement('p')
        // message.textContent = "Word Not Available in Dictionary"
        // errorMessage.appendChild(message)
    })
}

//function to parse the details required and display : definitions, synonyms, pronunciation
function parseData (data) {
    // add the word searched to the dipslay div
    const wordSearched = document.createElement('p');
    wordSearched.id = 'heading'
    wordSearched.textContent = data[0].word.toUpperCase();
    displayResults.appendChild(wordSearched);

    //display the data contained in the phonetics
    data[0].phonetics.forEach(element => {
        // display the text in the phonetics object
        if(element.text && element.text.trim !== ''){
            const phoneticsText = document.createElement('p');
            phoneticsText.className = 'phoneticsClass'
            phoneticsText.innerHTML = `<span class= "label"> Pronounciation: </span>${element.text};`
            displayResults.appendChild(phoneticsText);
        }
        
    if(element.audio){
        const audioPlay = new Audio(element.audio);
         audioPlay.play();
         return audioPlay;
    }
       
       
  });
  
  // created a button for audio playback
  const audioURL = data[0].phonetics?.find((aux) =>aux.audio )?.audio;
  if (audioURL){
     const playButton = document.createElement('button')
      playButton.textContent = 'PlayBack 🔊'
      playButton.id = 'playBackBtn'
    displayResults.appendChild(playButton);

    playButton.addEventListener('click',(event) =>{
        event.preventDefault();
        const audioPlayback = new Audio (audioURL)
        audioPlayback.play()
    })
  }

   
     // give the words origin
    if(data[0].origin && data[0].origin.trim() !== ''){
         const wordOrigin = document.createElement('p');
        wordOrigin.innerHTML = `<span class= "label">Word Origin: </span>${data[0].origin}`
     displayResults.appendChild(wordOrigin);
    }
   
  // acquire the meanings and all child elements

    data[0].meanings.forEach(element => {
        // provides ty tpe of speech of the word provided
        if(element.partOfSpeech && element.partOfSpeech.trim() !== ''){
            const speechType = document.createElement('p');
            speechType.className = 'type'
            speechType.innerHTML = `<span class= "label">Type: </span>${element.partOfSpeech}`
            displayResults.appendChild(speechType)
        }
        if(element.definitions){
            
             element.definitions.forEach(define => {

                //prints the definition of the word provided
                 if (define.definition && define.definition.trim() !== '') {
                 const definition = document.createElement('p');
                 definition.className = "define"
                 definition.innerHTML = `<span class= "label">Definition: </span>${define.definition}` 
                displayResults.appendChild(definition);
                 }
                if(define.example && define.example.trim() !== ''){
                    const exampleSentence = document.createElement('p');
                    exampleSentence.className = 'examples'
                    exampleSentence.innerHTML = `<span class= "label">Example: </span>${define.example}`
                    displayResults.appendChild(exampleSentence)
             }

                 // checks if synonyms are present and are populated
                if(define.synonyms && define.synonyms.length > 0){
                    const syn = document.createElement('p');
                    syn.className = 'synonym'
                    syn.innerHTML = `<span class= "label">Synonyms: </span>${define.synonyms.join(',')}`
                    displayResults.appendChild(syn)
                }
                // checks if antonyms are present and are populated
                if(define.antonyms && define.antonyms.length > 0){
                    const anton = document.createElement('p');
                    anton.className = 'antonyms'
                    anton.innerHTML = `<span class= "label">Antonyms: </span>${define.antonyms.join(',')}`
                    displayResults.appendChild(anton)

                }
             });
            

        }
    })


}

// function to deal with error handling
