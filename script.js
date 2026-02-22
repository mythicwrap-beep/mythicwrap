document.addEventListener("DOMContentLoaded", function(){

/* =========================
   VARIABLES
========================= */

let cart = [];
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

    cart.push({name, price});
    updateCart();
}

function updateCart(){
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.getElementById("cart-count");

    if(!cartItems) return;

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item=>{
        total += item.price;
        cartItems.innerHTML += `<p>${item.name} - ${item.price}€</p>`;
    });

    cartTotal.innerText = total;
    cartCount.innerText = cart.length;
}

/* OUVRIR PANIER */
const cartBtn = document.getElementById("cart-btn");
if(cartBtn){
    cartBtn.addEventListener("click", ()=>{
        document.getElementById("cart-panel").classList.add("active");
    });
}

/* FERMER PANIER */
const closeCart = document.getElementById("close-cart");
if(closeCart){
    closeCart.addEventListener("click", ()=>{
        document.getElementById("cart-panel").classList.remove("active");
    });
}

/* =========================
   AUTHENTIFICATION
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

    document.querySelector(".switch-auth").innerText =
        isLoginMode
        ? "Pas encore de compte ? S'inscrire"
        : "Déjà un compte ? Se connecter";
}

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

        const userExists = users.find(u => u.username === username);

        if(userExists){
            alert("Nom déjà utilisé");
            return;
        }

        users.push({username, password});
        localStorage.setItem("users", JSON.stringify(users));

        alert("Compte créé !");
        toggleAuthMode();
    }
}

function logout(){
    currentUser = null;
    localStorage.removeItem("currentUser");
    updateUserUI();
}

function updateUserUI(){
    if(currentUser){
        accountBtn.innerText = "👤 " + currentUser + " (Déconnexion)";
    } else {
        accountBtn.innerText = "Mon compte";
    }
}

});
/* =============================
   EXTENSION PANIER
============================= */

// Si cart existe déjà dans ton code, on l'utilise.
// Sinon on le crée.
if(typeof cart === "undefined"){
    var cart = [];
}

// Charger panier sauvegardé
const savedCartData = localStorage.getItem("cartData");
if(savedCartData){
    cart = JSON.parse(savedCartData);
    if(typeof updateCart === "function"){
        updateCart();
    }
}

// Sauvegarde automatique après chaque mise à jour
if(typeof updateCart === "function"){
    const originalUpdateCart = updateCart;

    updateCart = function(){
        originalUpdateCart();
        localStorage.setItem("cartData", JSON.stringify(cart));
    };
}

// Fonction suppression si elle n'existe pas déjà
if(typeof removeItem === "undefined"){
    window.removeItem = function(index){
        cart.splice(index,1);
        if(typeof updateCart === "function"){
            updateCart();
        }
    };
}
/* =============================
   EXTENSION CHECKOUT
============================= */

const checkoutBtn = document.getElementById("checkout-btn");

if(checkoutBtn){
    checkoutBtn.addEventListener("click", function(){

        if(typeof currentUser !== "undefined" && !currentUser){
            alert("Vous devez être connecté pour commander.");
            return;
        }

        if(cart.length === 0){
            alert("Votre panier est vide.");
            return;
        }

        alert("Commande validée !");
    });
}
/* =============================
   EXTENSION PAIEMENT
============================= */

function goToPayment(){
    if(cart.length === 0){
        alert("Panier vide.");
        return;
    }

    if(typeof currentUser !== "undefined" && !currentUser){
        alert("Veuillez vous connecter.");
        return;
    }

    // Remplace par ton vrai lien Stripe
    window.location.href = "https://buy.stripe.com/test_xxxxxxxxx";
/* =============================
   EXTENSION PROFIL
============================= */

function openProfile(){
    if(typeof currentUser !== "undefined" && currentUser){
        document.getElementById("profile-name").innerText =
            "Utilisateur : " + currentUser;

        document.getElementById("profile-panel")
            .classList.add("active");
    }
}

function closeProfile(){
    document.getElementById("profile-panel")
        .classList.remove("active");
}

// Si bouton compte existe
const accountButton = document.getElementById("account-btn");

if(accountButton){
    accountButton.addEventListener("dblclick", function(){
        openProfile();
    });
}
}