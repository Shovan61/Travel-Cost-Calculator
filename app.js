
// Item Controller

const ItemCtrl = (function(){

class Item {
 constructor(id, itemName, cost) {
     this.id = id,
     this.name = itemName,
     this.cost = cost
 }

};


// Current State
const state = {
    items: [],
    currentItem: null,
    totalCost: 0
}



// Public Methods
return {

addItem: function(name, cost) {
 
const  uniqId = (new Date().getTime()).toString(36);


cost = parseInt(cost);

// create a new item with class
const newItem = new Item(uniqId, name, cost);

state.items.push(newItem);

return newItem;
},     



totalCost: function() {
let total = 0;

state.items.forEach(cur => {
total += cur.cost;
});

state.totalCost = total;

return total;

},



currentItemToUpdate: function(id) {
let currentItem = null;
state.items.forEach(item => {
if(item.id === id){
currentItem = item;
}

});

state.currentItem = currentItem;

return currentItem;
},




updateCurItem: function(id, name, cost) {
cost = parseInt(cost);

state.items.forEach(item => {
if(item.id === id) {
 item.name = name;
 item.cost = cost;
}
});
   

},




deleteItemData: function(id) {
let deleteItemIndex;

state.items.forEach((item, index) => {

if(item.id === id) {
    deleteItemIndex = index;
}
});    

state.items.splice(deleteItemIndex, 1);

},





clearAllCosts: function() {

state.items.splice(0)
state.totalCost = 0;
},




getItems: function(){
return state.items;
},


getcurrentItem: function() {
return state.currentItem;
},



logState: function() {
    return state;
}

};

})();



// *************** //





// UI Controller

const UICtrl = (function(){
// UI elements
const UIelements = {
itemName: '#item-name',
costFld: '#item-cost',
itemList: '#item-list'
};

// Public Method
return {

getItem: function() {
  return {
      item: document.querySelector(UIelements.itemName).value,
      cost: document.querySelector(UIelements.costFld).value
  }

},


displayItems: function(id, name, cost) {
const markUp = `<li class="collection-item" id="item-${id}">
<strong>${name}:  </strong><em>${cost} Taka</em>
<a href="#" class="secondary-content">
    <i class="fa fa-pencil" id="edit-item"></i>
</a>
</li>
`; 

document.querySelector(UIelements.itemList).insertAdjacentHTML('beforeend', markUp);

},



displayTotalCost: function(cost) {
document.querySelector('.total-cost').innerHTML = cost;

},



clearFields: function() {
    document.querySelector(UIelements.itemName).value = '';
    document.querySelector(UIelements.costFld).value = ''
},



displayInputFields: function(name, cost){
     document.querySelector(UIelements.itemName).value = name;
     document.querySelector(UIelements.costFld).value = cost;
},





displayUpdatedCost: function(id, name, cost) {

const allList = Array.from(document.querySelectorAll('#item-list li'));


allList.forEach(curList => {
if(curList.getAttribute('id').split('-')[1] === id) {
  curList.innerHTML = `
              <strong>${name}: </strong><em>${cost} Taka</em>
              <a href="#" class="secondary-content">
                  <i class="fa fa-pencil"></i>
              </a>
          </li>
  `;


}

});

}, 





deleteItemUI: function(id) {

const allList = Array.from(document.querySelectorAll('#item-list li'));

allList.forEach(list => {
if(list.getAttribute('id').split('-')[1] === id){
    list.parentNode.removeChild(list);
}

});

},



clearAllUI: function() {
const allList = Array.from(document.querySelectorAll('#item-list li'));
allList.forEach(list => {

list.parentNode.removeChild(list);

document.querySelector('.total-cost').innerHTML = 0;
});

},




hideButtons: function() {
document.querySelector('.update-btn').style.display = 'none';
document.querySelector('.delete-btn').style.display = 'none';
document.querySelector('.back-btn').style.display = 'none';
document.querySelector('.add-btn').style.display = 'inline-block'
},


showButtons: function() {
    document.querySelector('.update-btn').style.display = 'inline-block';
    document.querySelector('.delete-btn').style.display = 'inline-block';
    document.querySelector('.back-btn').style.display = 'inline-block';
    document.querySelector('.add-btn').style.display = 'none'

},


getUIelements: function(){
    return UIelements;
}

};

})();


// *************** //






// App Controller

const AppCtrl = (function(ItemCtrl, UICtrl){


// Add item

const addItem = function (event) {
event.preventDefault();
// Get Input from UI ctrl
const inputs = UICtrl.getItem();
if(inputs.item !== '' && inputs.cost !== '') {
// Add them to Item Ctrl
const newItem = ItemCtrl.addItem(inputs.item, inputs.cost);

// get the items in UI
UICtrl.displayItems(newItem.id, newItem.name, newItem.cost);

// clearfields
UICtrl.clearFields();

// total Cost in data structure
const totCost = ItemCtrl.totalCost();

// display total cost
UICtrl.displayTotalCost(totCost);


} else {
    alert('Please fill up all the input fields to add an item');
}


};



// editPencil Icon function for selecting updating Item
const editItem = function(event) {
if(event.target.matches('#edit-item')){
event.preventDefault();
// UI buttons
UICtrl.showButtons();
// editing Item's id
const currentId = event.target.parentElement.parentElement.getAttribute('id').split('-')[1];
//  Get current Item
const currentItem = ItemCtrl.currentItemToUpdate(currentId);

// get inputs in field UI
UICtrl.displayInputFields(currentItem.name, currentItem.cost);

}    
};



//Update Item
const updateItem = function(event) {
event.preventDefault();

// get input from field
const inputs = UICtrl.getItem();

if(inputs.item !== '' && inputs.cost !== '') {
const currentItem = ItemCtrl.getcurrentItem();
// update current
ItemCtrl.updateCurItem(currentItem.id,inputs.item, inputs.cost);
// update Total Cost
const totCost = ItemCtrl.totalCost();
// display updated cost in UI
UICtrl.displayUpdatedCost(currentItem.id, inputs.item, inputs.cost);
// hide all buttons
UICtrl.hideButtons();
// clear Inputs
UICtrl.clearFields();

} else {
    alert('Please fill up all the input fields for updating this item');
}

};




const deleteItem = function(event) {
event.preventDefault();

// remove item from data
const currentItem = ItemCtrl.getcurrentItem();
ItemCtrl.deleteItemData(currentItem.id);

// remove item from UI
UICtrl.deleteItemUI(currentItem.id);
// hide all buttons
UICtrl.hideButtons();
// clear Inputs
UICtrl.clearFields();

};





const backBtn = function(event){
event.preventDefault();

UICtrl.hideButtons();
UICtrl.clearFields();

};





const clearAll = function(event) {
event.preventDefault();
if(confirm('Are You Sure! you want to clear all?')){
// clear every Item from data structure
ItemCtrl.clearAllCosts();
// clear from UI
UICtrl.clearAllUI();

}

};





// Load EventListners
const loadEventListners = function () {
// disable Enter Button
document.addEventListener('keypress', function (e) {
    if (e.key === "Enter") {
    e.preventDefault();
    return false;
    }
    
});


// Event Listners for Add Item
document.querySelector('.add-btn').addEventListener('click', addItem);

// event listner for edit button for item
document.querySelector('#item-list').addEventListener('click', editItem);

// event listener for update button
document.querySelector('.update-btn').addEventListener('click', updateItem);

// delete Button
document.querySelector('.delete-btn').addEventListener('click', deleteItem);

//back button
document.querySelector('.back-btn').addEventListener('click', backBtn);

// clear All Buttons
document.querySelector('.clear-btn').addEventListener('click', clearAll);

};





// Public method

return {
 init: function() {
 // Fetch Items
const items = ItemCtrl.getItems();

// Load all the event Listners    
loadEventListners();

// hide buttons
UICtrl.hideButtons();

 }

};


})(ItemCtrl, UICtrl);



AppCtrl.init();