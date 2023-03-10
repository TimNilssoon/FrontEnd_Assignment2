const apiKey = '33324322-8eee52f582e68b2e31576e70f';

let form = document.querySelector('form');
let images = document.querySelector('ul');
let prevButton = document.querySelector('#prevBtn');
let nextButton = document.querySelector('#nextBtn');

let inputText;
let inputColor;
let url;
let currentPage = 1;
const maxPerPage = 10;

prevButton.style.display = "none";
nextButton.style.display = "none";

form.onsubmit = async event => {
  event.preventDefault();

  // clears li elements
  images.textContent = "";

  // resets variables
  inputText = form.searchTxt.value;
  inputColor = form.colors.value;
  currentPage = 1;
  prevButton.disabled = true;
  nextButton.disabled = true;

  setUrl();

  let results = await getResults(url);

  if (results.totalHits > 0) {
    createListElements(results);

    showButtons(results.totalHits);
    enableDisableButtons(results.totalHits);
  }
}

nextButton.onclick = async event => {
  event.preventDefault();
  images.textContent = "";
  currentPage++;

  setUrl();
  
  let results = await getResults(url);

  createListElements(results);
  enableDisableButtons(results.totalHits);
}

prevButton.onclick = async event => {
  event.preventDefault();
  images.textContent = "";
  currentPage--;

  setUrl();
  
  let results = await getResults(url);

  createListElements(results);
  enableDisableButtons(results.totalHits);
}

function showButtons(resultsCount) {
  if (resultsCount > 0) {
    prevButton.style.display = "inline";
    nextButton.style.display = "inline";
  }
}

function enableDisableButtons(resultsCount) {
  if ((resultsCount / maxPerPage - currentPage) > 0) {
    nextButton.disabled = false;
    
    if (currentPage > 1) {
      prevButton.disabled = false;
    }
    else {
      prevButton.disabled = true;
    }
  }
  else {
    nextButton.disabled = true;

    if (currentPage > 1) {
      prevButton.disabled = false;
    }
  }
}

async function getResults(url) {
  let response = await fetch(url);
  let json = await response.json(response);

  return json;
}

function setUrl() {
  if (inputColor === 'any') {
    url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(inputText)}&per_page=${maxPerPage}&page=${currentPage}`;
  }
  else {
    url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(inputText)}&per_page=${maxPerPage}&page=${currentPage}&colors=${inputColor}`;
  }
}

function createListElements(results) {
  results.hits.forEach(item => {
    let listItem = document.createElement('li');

    let image = document.createElement('img');
    image.src = item.webformatURL;
    image.alt = "Image result";

    let tags = document.createElement('p');
    tags.textContent = item.tags;

    let postedBy = document.createElement('p');
    postedBy.textContent = 'Posted by: ' + item.user;


    listItem.append(image);
    listItem.append(tags);
    listItem.append(postedBy);
    images.append(listItem);
  });
}