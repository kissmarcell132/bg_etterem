let menuList = [];
let orders = [];
let cart = [];
let cartPrice = 0;

const cardsBody = document.querySelector("#cardsBody");
document.querySelector("#pastas").addEventListener("click", showCards);
document.querySelector("#pizzas").addEventListener("click", showCards);
document.querySelector("#salads").addEventListener("click", showCards);
document.querySelector("#desserts").addEventListener("click", showCards);
document.querySelector("#coffees").addEventListener("click", showCards);
document.querySelector("#drinks").addEventListener("click", showCards);
document.querySelector("#cart").addEventListener("click", showCart);
document.querySelector("#orders").addEventListener("click", showOrders);

let promise = new Promise(function (resolve, reject) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "bellozzo.json");

  xhr.onload = function () {
    if (xhr.status == 200) {
      resolve(xhr.response);
    } else {
      reject("File not found!");
    }
  };
  xhr.send();
});

// siker - resolve
promise.then((value) => {
  getMenu(JSON.parse(value).menu);
  console.log(menuList);
});

// hiba - reject
promise.catch((error) => {
  console.log(error);
});

function getMenu(menuData) {
  menuList = menuData;
}

function showCards(event) {
  cardsBody.innerHTML = "";
  let selectedId = event.target.value;
  let filteredMenuList = [];
  filteredMenuList = menuList.filter((x) => x.type == selectedId);

  let cards = "";
  filteredMenuList.forEach((item) => {
    cards += `
        <div class="card col-3 m-4" style="height: 350px">
            <img src="${item.picture}" class="card-img-top" style="height: 200px;">
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">Ár: ${item.price} Ft</p>
                <button class="btn btn-primary add-to-cart" value="${item.id}">Hozzáadás a kosárhoz</button>
            </div>
        </div>
        `;
  });
  cardsBody.innerHTML = cards;

  // Add event listener to the buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCart);
  });
}

function addToCart(event) {
  let itemToCart = menuList.find((x) => x.id == event.target.value);
  cart.push(itemToCart);
  cartPrice += itemToCart.price;
}

function showCart() {
  cardsBody.innerHTML = "";
  let cards = "";
  cards += `
        <h1 class="display-1 text-center">Fizetendő összeg:${cartPrice} Ft</h1>
    `;
  cart.forEach((item) => {
    cards += `
        <div class="card col-3 m-4" style="height: 350px">
            <img src="${item.picture}" class="card-img-top" style="height: 200px;">
            <div class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <p class="card-text">Ár: ${item.price} Ft</p>
                <button class="btn btn-danger remove-from-cart" value="${item.id}">Kivétel a kosárból</button>
            </div>
        </div>
        `;
  });
  if (cart.length > 0) {
    cards += `
        <div class="row">
        <button class="btn btn-success finishBTN">Rendelés befejezése</button>
        
        </div>
        `;
  }
  cardsBody.innerHTML = cards;
  if (cart.length > 0) {
    document
      .querySelector(".finishBTN")
      .addEventListener("click", orderFinished);
  }
  const addToCartButtons = document.querySelectorAll(".remove-from-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", removeFromCart);
  });
}

function removeFromCart(event) {
  let itemToCart = menuList.find((x) => x.id == event.target.value);
  cartPrice -= itemToCart.price;
  cart.forEach((item) => {
    if (item === itemToCart) {
      cart.splice(cart.indexOf(item), 1);
      itemToCart = "";
    }
  });
  showCart();
}

function orderFinished() {
  orders.push(cart);
  cart = [];
  cartPrice = 0;
  console.log(orders);
  showCart();
}

function showOrders() {
  cardsBody.innerHTML = "";
  let orderCounter = 0;
  orders.forEach((order) => {
    let div = document.createElement("div");
    div.className = "col-4 order";
    let ul = document.createElement("ul");

    order.forEach((item) => {
      let li = document.createElement("li");
      li.innerText = item.name;
      ul.append(li);
    });
    
    div.append(ul);
    let btn = document.createElement('button');
    btn.className = "btn btn-success finished-order";
    btn.innerText = "Elkészült a rendelés";
    btn.value = orderCounter; 
    div.append(btn);
    cardsBody.append(div);
    orderCounter++;
  });
  const finishedOrdersButtons = document.querySelectorAll(".finished-order");
  finishedOrdersButtons.forEach((button) => {
    button.addEventListener("click", finishedOrder);
  });
}

function finishedOrder(event){
    let ordertoRemove = orders[event.target.value];
    orders.forEach(order => {
      if (order == ordertoRemove) {
        orders.splice(orders.indexOf(order), 1);
      }
    });


    showOrders();
}