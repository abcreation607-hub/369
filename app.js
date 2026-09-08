const STORE={name:"Charan Mobiles",currency:"₹",phone:"+91 00000 00000",email:"contact@charanmobiles.example",address:"Add your shop address here"};
const products=[
{name:"iPhone 16",price:74999,category:"Smartphone",icon:"📱"},
{name:"Samsung Galaxy S24",price:69999,category:"Smartphone",icon:"📱"},
{name:"OnePlus 13",price:69999,category:"Smartphone",icon:"📱"},
{name:"Redmi Note",price:18999,category:"Smartphone",icon:"📱"},
{name:"Wireless Earbuds",price:1999,category:"Accessory",icon:"🎧"},
{name:"Fast Charger 65W",price:2499,category:"Accessory",icon:"⚡"}
];
const offers=[
{title:"Exchange Bonus",value:"Up to ₹5,000",text:"Extra exchange value on selected smartphones."},
{title:"Accessory Combo",value:"20% OFF",text:"Discount on eligible accessories with a phone purchase."},
{title:"Festival Offer",value:"Special Price",text:"Ask in store for current festival promotions."}
];

const grid=document.getElementById("productGrid"),search=document.getElementById("search"),productSelect=document.getElementById("billProduct"),price=document.getElementById("billPrice");
function money(n){return STORE.currency+Number(n).toLocaleString("en-IN")}
function renderProducts(list=products){grid.innerHTML=list.map(p=>`<article class="card"><div class="product-icon">${p.icon}</div><h3>${p.name}</h3><p class="muted">${p.category}</p><p class="price">${money(p.price)}</p></article>`).join("")}
function renderOffers(){document.getElementById("offerGrid").innerHTML=offers.map(o=>`<article class="offer"><p class="eyebrow">${o.title}</p><strong>${o.value}</strong><p class="muted">${o.text}</p></article>`).join("")}
products.forEach((p,i)=>productSelect.insertAdjacentHTML("beforeend",`<option value="${i}">${p.name}</option>`));
function syncPrice(){price.value=products[productSelect.value].price} productSelect.addEventListener("change",syncPrice);syncPrice();
search.addEventListener("input",e=>{const q=e.target.value.toLowerCase();renderProducts(products.filter(p=>p.name.toLowerCase().includes(q)||p.category.toLowerCase().includes(q)))});
renderProducts();renderOffers();
document.getElementById("year").textContent=new Date().getFullYear();
document.getElementById("storePhone").textContent=STORE.phone;
document.getElementById("storeEmail").textContent=STORE.email;
document.getElementById("storeAddress").textContent=STORE.address;
const menuBtn=document.getElementById("menuBtn"),navLinks=document.getElementById("navLinks");
menuBtn.onclick=()=>{const open=navLinks.classList.toggle("open");menuBtn.setAttribute("aria-expanded",open)};
const baseUrl=location.href.split("#")[0]; new QRCode(document.getElementById("qrcode"),{text:baseUrl,width:180,height:180});
document.getElementById("billForm").addEventListener("submit",e=>{
 e.preventDefault();
 const {jsPDF}=window.jspdf;
 const doc=new jsPDF();
 const name=document.getElementById("customerName").value.trim();
 const phone=document.getElementById("customerPhone").value.trim();
 const p=products[productSelect.value],qty=Math.max(1,Number(document.getElementById("quantity").value)||1);
 const unit=Math.max(0,Number(price.value)||0),discount=Math.max(0,Number(document.getElementById("discount").value)||0);
 const subtotal=unit*qty,total=Math.max(0,subtotal-discount),billNo="CM-"+Date.now().toString().slice(-8);
 doc.setFontSize(24);doc.text(STORE.name,20,25);doc.setFontSize(11);
 doc.text(`E-BILL: ${billNo}`,20,38);doc.text(`Date: ${new Date().toLocaleString("en-IN")}`,20,46);
 doc.text(`Customer: ${name}`,20,60);doc.text(`Phone: ${phone}`,20,68);
 doc.line(20,76,190,76);doc.text(`Product: ${p.name}`,20,88);doc.text(`Quantity: ${qty}`,20,96);
 doc.text(`Unit Price: ${money(unit)}`,20,104);doc.text(`Subtotal: ${money(subtotal)}`,20,112);
 doc.text(`Discount: ${money(discount)}`,20,120);doc.setFontSize(16);doc.text(`TOTAL: ${money(total)}`,20,136);
 doc.setFontSize(9);doc.text("Thank you for choosing Charan Mobiles.",20,155);
 doc.save(`${billNo}.pdf`);
});
