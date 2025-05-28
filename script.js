async function fetchUrlContent(url) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    try {
        const response = await fetch(proxyUrl + url);
        if (!response.ok) {
            console.error('Network response was not ok:', response.statusText);
            return null;
        }
        return await response.text();
    } catch (error) {
        console.error('Error fetching URL:', error);
        return null;
    }
}

function extractImageSources(htmlText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    const images = doc.querySelectorAll('img');
    const sources = [];
    images.forEach(img => {
        sources.push(img.src);
    });
    return sources;
}

function displayImages(imageUrls, containerElement) {
    containerElement.innerHTML = ''; // Clear previous content

    if (!imageUrls || imageUrls.length === 0) {
        const msgElement = document.createElement('p');
        msgElement.textContent = 'No images found.';
        msgElement.className = 'info-message';
        containerElement.appendChild(msgElement);
        return;
    }

    imageUrls.forEach(url => {
        const imgElement = document.createElement('img');
        imgElement.src = url;
        imgElement.style.maxWidth = '200px';
        imgElement.style.maxHeight = '200px';
        imgElement.style.margin = '5px'; // Add some spacing
        containerElement.appendChild(imgElement);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('urlInput');
    const submitBtn = document.getElementById('submitBtn');
    const imageContainer = document.getElementById('imageContainer');

    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const url = urlInput.value.trim();

            if (!url) {
                imageContainer.innerHTML = '';
                const msgElement = document.createElement('p');
                msgElement.textContent = 'Please enter a URL.';
                msgElement.className = 'error-message';
                imageContainer.appendChild(msgElement);
                return;
            }

            imageContainer.innerHTML = '';
            const loadingMsgElement = document.createElement('p');
            loadingMsgElement.textContent = 'Fetching images...';
            loadingMsgElement.className = 'info-message';
            imageContainer.appendChild(loadingMsgElement);

            try {
                const htmlText = await fetchUrlContent(url);

                if (!htmlText) {
                    imageContainer.innerHTML = '';
                    const errorMsgElement = document.createElement('p');
                    errorMsgElement.textContent = 'Failed to fetch URL. Check if it\'s valid and accessible, or if the CORS proxy is working.';
                    errorMsgElement.className = 'error-message';
                    imageContainer.appendChild(errorMsgElement);
                    return;
                }

                const imageUrls = extractImageSources(htmlText);
                displayImages(imageUrls, imageContainer); // displayImages already clears the container

            } catch (error) {
                console.error('Error in main execution:', error);
                imageContainer.innerHTML = '';
                const errorMsgElement = document.createElement('p');
                errorMsgElement.textContent = 'An unexpected error occurred. Please check the console.';
                errorMsgElement.className = 'error-message';
                imageContainer.appendChild(errorMsgElement);
            }
        });
    } else {
        console.error('Submit button not found. Ensure your HTML is correct.');
        if (imageContainer) {
            imageContainer.innerHTML = '';
            const errorMsgElement = document.createElement('p');
            errorMsgElement.textContent = 'Error: Submit button not found in the page.';
            errorMsgElement.className = 'error-message';
            imageContainer.appendChild(errorMsgElement);
        }
    }
});
