// Function to fetch sayings from server
async function fetchSayings() {
    try {
        const response = await fetch('/sayings');
        const data = await response.text();
        const sayings = data.split('\n');
        return sayings;  // Now you can use sayings array
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

    const useProvidedSayings = providedSayings.length > 0;
    const useProvidedImages = providedImages.length > 0;

    const resolvedSayings = useProvidedSayings? providedSayings : defaultSayings;
    const resolvedImages = useProvidedImages ? providedImages : defaultImages;
    
    // Change background image
    let emergencyStop = 100;
    let validImage;
    let imageIndex;
    while (!validImage && emergencyStop > 0) {
        imageIndex = Math.floor(Math.random() * resolvedImages.length);
        if (!bannedImages.includes(resolvedImages[imageIndex])) {
            validImage = true;
        }
        emergencyStop--;
    }

    let imageUrl;
    if (validImage) {
        imageUrl = `${useProvidedImages ? 'images/' : 'assets/'}${resolvedImages[imageIndex]}`;
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
        quoteIndex = Math.floor(Math.random() * resolvedSayings.length);
        if (!bannedQuotes.includes(resolvedSayings[quoteIndex])) {
            validQuote = true;
        }
        emergencyStop--;
    }

    if (validQuote) {
        document.getElementById('quote-text').innerText = resolvedSayings[quoteIndex];
    } else {
        console.error('Could not find a valid quote after 100 tries');
    }

    // Set up the buttons
    document.getElementById('hideImage').addEventListener('click', hideImage);
    document.getElementById('hideQuote').addEventListener('click', hideQuote);

}
