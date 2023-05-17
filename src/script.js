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
    const imageName = document.body.style.backgroundImage.slice(5, -2);
    try {
      const response = await fetch(`/api/hideImage?imageName=${imageName}`, { method: 'POST' });
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

window.onload = async function() {
    const [
        providedSayings,
        defaultSayings,
        providedImages,
        defaultImages,
    ] = await Promise.all([
        fetchSayings(),
        fetchJson('default-sayings.json'),
        fetchImageFileNames(),
        fetchJson('default-images.json')
    ]);

    const useProvidedSayings = providedSayings.length > 0;
    const useProvidedImages = providedImages.length > 0;

    const resolvedSayings = useProvidedSayings? providedSayings : defaultSayings;
    const resolvedImages = useProvidedImages ? providedImages : defaultImages;
    
    // Change background image
    let imageIndex = Math.floor(Math.random() * resolvedImages.length);
    let imageUrl = `${useProvidedImages ? 'images/' : 'assets/' }${resolvedImages[imageIndex]}`;
    document.body.style.backgroundImage = `url(${imageUrl})`;
    
    // Change download link
    let downloadLink = document.getElementById('download-link');
    downloadLink.href = imageUrl;
    
    // Change quote
    let quoteIndex = Math.floor(Math.random() * resolvedSayings.length);
    document.getElementById('quote-text').innerText = resolvedSayings[quoteIndex];

    // Set up the buttons
    document.getElementById('hideImage').addEventListener('click', hideImage);
    document.getElementById('hideQuote').addEventListener('click', hideQuote);

}
