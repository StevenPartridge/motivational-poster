
// Store for advancing state
const state = {
  imageIndex: 0,
  quoteIndex: 0,
  images: null,
  quotes: null,
  bannedQuotes: null,
  bannedImages: null,
  useProvidedSayings: true,
  useProvidedImages: true
}

// Function to fetch sayings from server
async function fetchSayings() {
    try {
        const response = await fetch('/api/sayings');
        const data = await response.text();
        const sayings = data.split('\n');
        return JSON.parse(sayings);  // Now you can use sayings array
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Function to fetch image file names from server
async function fetchImageFileNames() {
    try {
        const response = await fetch('/api/images');
        const fileNames = await response.json();
        return fileNames;  // Now you can use fileNames array
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Function to hide the current image
async function hideImage() {
    const imageName = document.body.style.backgroundImage.slice(5, -2).split('/')[1];
    try {
      const response = await fetch(`/api/hideImage?imageName=${encodeURIComponent(imageName)}`, { method: 'POST' });
      if (!response.ok) throw new Error('Network response was not ok');
      // Handle response here if needed
    } catch (error) {
      console.error('Error:', error);
    }

    advanceState();
  }
  
  // Function to hide the current quote
  async function hideQuote() {
    const quote = document.getElementById('quote-text').innerText;
    try {
      const response = await fetch(`/api/hideQuote?quote=${encodeURIComponent(quote)}`, { method: 'POST' });
      if (!response.ok) throw new Error('Network response was not ok');
      // Handle response here if needed
    } catch (error) {
      console.error('Error:', error);
    }

    advanceState();
  }

  // Function to submit a new quote
  async function submitNewQuote(quote) {
    if (!quote || !quote.length) { 
        return;
    }
    try {
        const response = await fetch(`/api/newQuote?quote=${encodeURIComponent(quote)}`, { method: 'POST' });
        if (!response.ok) throw new Error('Network response was not ok');
        await response.text();
        document.getElementById('quote-text').innerText = quote;
    } catch (error) {
        document.getElementById('quote-text').innerText = quote;
        console.error('Error:', error);
    }
}

async function fetchJson(filename) {
    try {
      const response = await fetch(`./assets/${filename}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      return {};
    }
  }

  // Function to fetch hidden images
async function fetchHiddenImages() {
    try {
      const response = await fetch('/api/hiddenImages');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const images = await response.json();
      return images;
    } catch (error) {
      console.error('Failed to fetch hidden images:', error);
      return [];
    }
  }

  // Function to fetch hidden quotes
async function fetchHiddenQuotes() {
    try {
      const response = await fetch('/api/hiddenQuotes');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const quotes = await response.json();
      return quotes;
    } catch (error) {
      console.error('Failed to fetch hidden quotes:', error);
      return [];
    }
  }


  function advanceState() {
        // Change background image
        let emergencyStop = 100;
        let validImage;
        let imageIndex;
        while (!validImage && emergencyStop > 0) {
            imageIndex = Math.floor(Math.random() * state.images.length);
            if (!state.bannedImages.includes(state.images[imageIndex])) {
                validImage = true;
            }
            emergencyStop--;
        }
    
        let imageUrl;
        if (validImage) {
            imageUrl = `${state.useProvidedImages ? '/images/' : './assets/'}${state.images[imageIndex]}`;
            document.body.style.backgroundImage = `url(${imageUrl})`;
        } else {
            console.error('Could not find a valid image after 100 tries');
        }
        
        // Change download link
        let downloadLink = document.getElementById('download-link');
        downloadLink.href = imageUrl;
    
        // Change quote
        emergencyStop = 100;
        let validQuote;
        let quoteIndex;
        while (!validQuote && emergencyStop > 0) {
            quoteIndex = Math.floor(Math.random() * state.quotes.length);
            if (!state.bannedQuotes.includes(state.quotes[quoteIndex]) && state.quotes[quoteIndex].length) {
                validQuote = true;
            }
            emergencyStop--;
        }
    
        if (validQuote) {
            document.getElementById('quote-text').innerText = state.quotes[quoteIndex];
        } else {
            console.error('Could not find a valid quote after 100 tries');
        }
  }


window.onload = async function() {
    const [
        providedSayings,
        defaultSayings,
        providedImages,
        defaultImages,
        bannedQuotes,
        bannedImages
    ] = await Promise.all([
        fetchSayings(),
        fetchJson('default-sayings.json'),
        fetchImageFileNames(),
        fetchJson('default-images.json'),
        fetchHiddenQuotes(),
        fetchHiddenImages()
    ]);

    state.useProvidedImages = providedImages.length > 0;
    state.useProvidedSayings = providedSayings.length > 0;
    state.bannedQuotes = bannedQuotes;
    state.bannedImages = bannedImages;
    state.quotes = state.useProvidedSayings ? providedSayings : defaultSayings;
    state.images = state.useProvidedImages ? providedImages : defaultImages;
    state.quotes = state.quotes.filter(quote => !state.bannedQuotes.includes(quote));
    
    advanceState();

    // Set up the buttons
    document.getElementById('hideImage').addEventListener('click', hideImage);
    document.getElementById('hideQuote').addEventListener('click', hideQuote);
    document.getElementById('advance').addEventListener('click', advanceState);

    document.getElementById('expand-button').addEventListener('click', function() {
        var inputContainer = document.getElementById('input-container');
        console.log(inputContainer.style.display);
        if (inputContainer.style.display === "block") {
            inputContainer.style.display = "none";
        } else {
            inputContainer.style.display = "block";
        }
      });
      
      // TODO: Move these functions out
      document.getElementById('submit-button').addEventListener('click', function() {
        var newQuote = document.getElementById('new-quote-input').value;
        document.getElementById('new-quote-input').value = "";
        var inputContainer = document.getElementById('input-container');
        if (inputContainer.style.display === "none") {
            inputContainer.style.display = "block";
        } else {
            inputContainer.style.display = "none";
        }
        submitNewQuote(newQuote);
      });

      // TODO: Totally duplicated from above
      document.getElementById('new-quote-input').addEventListener('keydown', function(event) {
        // If the key pressed was 'Enter'
        if (event.key === 'Enter') {
            var newQuote = document.getElementById('new-quote-input').value;
            document.getElementById('new-quote-input').value = "";
            var inputContainer = document.getElementById('input-container');
            if (inputContainer.style.display === "none") {
                inputContainer.style.display = "block";
            } else {
                inputContainer.style.display = "none";
            }
            submitNewQuote(newQuote);
        }
      });

}
