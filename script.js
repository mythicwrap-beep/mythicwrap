document.addEventListener("DOMContentLoaded", function(){

/* =========================
   VARIABLES
========================= */

let cart = JSON.parse(localStorage.getItem("cartData")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = localStorage.getItem("currentUser") || null;
let isLoginMode = true;

/* =========================
   PANIER
========================= */

window.addToCart = function(){
    const productCard = event.target.closest(".product-card");
    const name = productCard.querySelector("h3").innerText;
    const price = parseInt(productCard.querySelector("p").innerText);

    const existing = cart.find(item => item.name === name);

    if(existing){
        existing.quantity++;
    } else {
        cart.push({name, price, quantity:1});
    }

    saveCart();
    updateCart();
};

function updateCart(){
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");

    if(!cartItems) return;

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index)=>{
        total += item.price * item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <strong>${item.name}</strong>
                <div>
                    <button onclick="decreaseQty(${index})">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="increaseQty(${index})">+</button>
                </div>
                <div>${item.price * item.quantity}€</div>
                <button onclick="removeItem(${index})">❌</button>
            </div>
        `;
    });

    cartTotal.innerText = total;
    cartCount.innerText = cart.length;
}

window.increaseQty = function(index){
    cart[index].quantity++;
    saveCart();
    updateCart();
};

window.decreaseQty = function(index){
    if(cart[index].quantity > 1){
        cart[index].quantity--;
    } else {
        cart.splice(index,1);
    }
    saveCart();
    updateCart();
};

window.removeItem = function(index){
    cart.splice(index,1);
    saveCart();
    updateCart();
};

function saveCart(){
    localStorage.setItem("cartData", JSON.stringify(cart));
}

/* =========================
   PANIER UI
========================= */

const cartBtn = document.getElementById("cart-btn");
const closeCart = document.getElementById("close-cart");

if(cartBtn){
    cartBtn.addEventListener("click", ()=>{
        document.getElementById("cart-panel").classList.add("active");
    });
}

if(closeCart){
    closeCart.addEventListener("click", ()=>{
        document.getElementById("cart-panel").classList.remove("active");
    });
}

/* =========================
   AUTH
========================= */

const accountBtn = document.getElementById("account-btn");
const modal = document.getElementById("auth-modal");

updateUserUI();

if(accountBtn){
    accountBtn.addEventListener("click", ()=>{
        if(currentUser){
            logout();
        } else {
            modal.style.display = "flex";
        }
    });
}

window.toggleAuthMode = function(){
    isLoginMode = !isLoginMode;

    document.getElementById("auth-title").innerText =
        isLoginMode ? "Connexion" : "Inscription";

    document.getElementById("auth-button").innerText =
        isLoginMode ? "Se connecter" : "S'inscrire";
};

window.handleAuth = function(){

    const username = document.getElementById("auth-username").value;
    const password = document.getElementById("auth-password").value;

    if(!username || !password){
        alert("Veuillez remplir tous les champs");
        return;
    }

    if(isLoginMode){

        const user = users.find(u =>
            u.username === username && u.password === password
        );

        if(!user){
            alert("Identifiants incorrects");
            return;
        }

        currentUser = username;
        localStorage.setItem("currentUser", username);
        modal.style.display = "none";
        updateUserUI();

    } else {

        if(users.find(u => u.username === username)){
            alert("Nom déjà utilisé");
            return;
        }

        users.push({username, password});
        localStorage.setItem("users", JSON.stringify(users));
        alert("Compte créé !");
        toggleAuthMode();
    }
};

function logout(){
    currentUser = null;
    localStorage.removeItem("currentUser");
    updateUserUI();
}

function updateUserUI(){
    if(accountBtn){
        accountBtn.innerText = currentUser
            ? "👤 " + currentUser + " (Déconnexion)"
            : "Mon compte";
    }
}

/* =========================
   CONFIRMATION COMMANDE
========================= */

const checkoutBtn = document.getElementById("checkout-btn");

if(checkoutBtn){
    checkoutBtn.addEventListener("click", function(){

        if(!currentUser){
            alert("Vous devez être connecté.");
            return;
        }

        if(cart.length === 0){
            alert("Panier vide.");
            return;
        }

        confirmOrder();
    });
}

function confirmOrder(){

    const order = {
        user: currentUser,
        items: cart,
        total: cart.reduce((sum,i)=> sum + (i.price*i.quantity),0),
        date: new Date().toLocaleString()
    };

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    cart = [];
    saveCart();
    updateCart();

    alert("Commande confirmée 🎉");
}

/* =========================
   PROFIL
========================= */

window.openProfile = function(){
    if(currentUser){
        document.getElementById("profile-name").innerText =
            "Utilisateur : " + currentUser;

        document.getElementById("profile-panel")
            .classList.add("active");
    }
};

window.closeProfile = function(){
    document.getElementById("profile-panel")
        .classList.remove("active");
};

if(accountBtn){
    accountBtn.addEventListener("dblclick", ()=>{
        openProfile();
    });
}

/* =========================
   INIT
========================= */

updateCart();

});
