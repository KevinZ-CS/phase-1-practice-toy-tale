const toyDiv = document.getElementById('toy-collection');
const form = document.querySelector('form');
const url = 'http://localhost:3000/toys';

let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.addEventListener('DOMContentLoaded', getToys)

function getToys() {
  fetch(url)
  .then(resp => resp.json())
  .then(toyObj => {
    buildCard(toyObj)
    globalToyObj = toyObj
  })
}

function buildCard(toyObj) {
  for(const toy of toyObj) {
    let card = document.createElement('div');
    card.className = 'card'
    // uses interpolation below
    card.innerHTML = `                
      <h2>${toy.name}</h2> 
      <img src=${toy.image} class="toy-avatar" />
      <p>${toy.likes} Likes </p>
      <button class="like-btn" id=${toy.id}>Like ❤️</button>
    `
    toyDiv.appendChild(card)

    const likeButton = document.getElementById(`${toy.id}`)
    likeButton.addEventListener('click', function() {
      toy.likes++
      fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH', 
      headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json'},
      body: JSON.stringify({
        'likes': `${toy.likes}`
      })
    } )
    .then(resp => resp.json())
    .then(updateDOM => {
      const p = document.getElementById(`${toy.id}`).previousElementSibling
      p.textContent = `${updateDOM.likes} Likes` 
    })
  }
)
}}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const toyNameInput = e.target.name.value
  const toyImageInput = e.target.image.value
  
  fetch(url, {
    method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',},
          body: JSON.stringify({
            "name": toyNameInput,
            "image": toyImageInput,
            "likes": 0
          })
  })
  .then(resp => resp.json())
  .then(addedToy => {
    let newCard = document.createElement('div');
    newCard.className = 'card'
  // uses interpolation below
    newCard.innerHTML = `                
    <h2>${addedToy.name}</h2> 
    <img src=${addedToy.image} class="toy-avatar" />
    <p>${addedToy.likes} Likes </p>
    <button class="like-btn" id=${addedToy.id}>Like ❤️</button>
  `
  toyDiv.appendChild(newCard)  //an image will not show right away when image is submitted, it will only show when refreshed because the database has been updated but we want the image to show right away so we'll need to add to dom right away 
  
  const newLikeButton = document.getElementById(`${addedToy.id}`)
  newLikeButton.addEventListener('click', function() {
    addedToy.likes++
    fetch(`http://localhost:3000/toys/${addedToy.id}`, {
    method: 'PATCH', 
    headers:{
      'Content-Type': 'application/json',
      'Accept': 'application/json'},
    body: JSON.stringify({
      'likes': `${addedToy.likes}`
    })
  } )
  .then(resp => resp.json())
  .then(updateDOMnew => {
    const p = document.getElementById(`${addedToy.id}`).previousElementSibling
    p.textContent = `${updateDOMnew.likes} Likes` 
  })
}
)  
})
})