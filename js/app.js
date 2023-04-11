// Storage Controller
const StorageCtrl = (function() {
    // Public Methods
    return {
        storeItem: function(item) {
            let items;

            // Validate for existing items
            if(localStorage.getItem('items') === null){
                // Items Dont't Exist
                items = [];

                // Push new Item
                items.push(item);

                // Set LS
                localStorage.setItem('items', JSON.stringify(items));

            } else{
                // Items Exist
                items = JSON.parse(localStorage.getItem('items'))

                // Push New item
                items.push(item);

                // Reset ls
                localStorage.setItem('items', JSON.stringify(items))
            }

        },

        // Get items to persist to UI
        getItemsFromStorage: function() {
            let items;

            if(localStorage.getItem('items') === null) {

                items = [];
            } else{

                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },

        // Update Items to Storage
        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem)
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },

        // Delete items from Storage
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if(id === item.id){
                    items.splice(index, 1);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },

        // Clear All From Storage
        clearItemsFromStorage: function() {
            localStorage.removeItem('items');
        }
    }
})();

// Item Controller
const ItemCtrl = (function() {
    // Item Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State (privavte)
    const data = {
        // user items.
        // items: [
            // {id: 0, name: 'Steak Dinner', calories: 1200},
            // {id: 1, name: 'Jollof Rice', calories: 500},
            // {id: 2, name: 'Eggs', calories: 200},
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // Public Methods
    return{
        getItems: function() {
            return data.items;
        },

        addItem: function(name, calories) {
            let ID;
            // Create ID
            console.log(data.items);
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            } else{
                ID = 0;
            }

            // Calories to number
            calories = parseInt(calories)

            // Create new Item
            newItem = new Item(ID, name, calories);

            // Add to Items Array
            data.items.push(newItem);

            return newItem;
        },

        getItemById: function(id){
            let found = null;

            // Loop through items
            data.items.forEach(function(item) {
                if(item.id === id){
                    found = item;
                }
            });

            return found;
        },

        updateItem: function(name, calories) {
            // Calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item) {
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },

        deleteItem: function(id){
            // get ids
            ids = data.items.map(function(item) {
                return item.id;
            });

            // get index
            const index = ids.indexOf(id);

            // remove item
            data.items.splice(index, 1);
        },

        clearAllItems: function() {
            data.items = [];
        },

        setCurrentItem: function(item) {
            data.currentItem = item;
        },

        getCurrentItem:function() {
            return data.currentItem;
        },

        getTotalCalories: function() {
            let total  = 0;
            data.items.forEach(item => {
                total += item.calories;
            });

            // Set total cal in data structure
            data.totalCalories = total;

            // Return total
            return data.totalCalories;
        },

        logData: function() {
            return data;
        }
    }
})();




// UI Controller
const UICtrl = (function() {

    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }
    
    return{
        populateItemList: function(items) {
            let html = ''; 

            items.forEach(function(item) {
                html += `
                    <li class="collection-item" id="item-${item.id}">
                        <strong>${item.name}:</strong>
                        <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    </li>
                `;
            });

            // Insert List Items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        
        addListItem: function(item) {
            // Show List
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create Li Element
            const li  = document.createElement('li');

            // Add Class
            li.className = 'collection-item'

            // Add id
            li.id = `item-${item.id}`;

            // Add Html
            li.innerHTML = `
                <strong>${item.name}:</strong>
                <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `;

            // Insert Item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },

        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            
            // Covert Node List to Array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem) {
                const itemID = listItem.getAttribute('id')

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `
                        <strong>${item.name}:</strong>
                        <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    `;

                }
            })
        },

        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();

            this.clearEditState()
        },

        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },

        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

            UICtrl.showEditState()
        },

        removeItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node List into Array
            listItems = Array.from(listItems);

            listItems.forEach(function(item) {
                item.remove();
            });
        },

        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },

        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },

        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';

        },
        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';

        },

        getSelectors: function() {
            return UISelectors;
        }

    }
})();



// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
    // Load Event Listeners
    const loadEventListeners = function() {
        // Get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        
        // Add Item Event
        document.querySelector(UISelectors.addBtn).addEventListener
        ('click', itemAddSubmit)

        // Disable submit on enter
        document.addEventListener('keypress', (e) => {
            if(e.keyCode === 13 || e.key === 'Enter'){
                e.preventDefault();

                return false;
            }
        });

        // Edit Icon Event
        document.querySelector(UISelectors.itemList)
        .addEventListener('click', itemEditClick);
        
        // Update Meal 
        document.querySelector(UISelectors.updateBtn)
        .addEventListener('click', itemUpdateSubmit);

        // Delete Meal 
        document.querySelector(UISelectors.deleteBtn)
        .addEventListener('click', itemDeleteSubmit);
        
        // Back Button Event 
        document.querySelector(UISelectors.backBtn)
        .addEventListener('click', (e) => {
            e.preventDefault();
            
            // Clear Edit state
            UICtrl.clearEditState()
        });

        // Clear All Event 
        document.querySelector(UISelectors.clearBtn)
        .addEventListener('click', clearAllItemsClick);
    }

    // Add Item Submit
    const itemAddSubmit = function(e) {
        e.preventDefault();

        // Get Form Input from uictrl
        const input = UICtrl.getItemInput();
        
        // Check for name and calorie input
        if(input.name !== '' && input.calories !== ''){
            // Add Item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Add Item to Ui List
            UICtrl.addListItem(newItem);

            // Get Total Calories
            const totalCalories = ItemCtrl.getTotalCalories()

            // Persist Total Cakories To UI
            UICtrl.showTotalCalories(totalCalories)

            // Store to LS
            StorageCtrl.storeItem(newItem);
            // Clear input fields
            UICtrl.clearInput()
        }
    }

    // Edit State
    const itemEditClick =  function(e) {
        e.preventDefault();

        if(e.target.classList.contains('edit-item')){
            // Get List Item ID
            const listId = e.target.parentNode.parentNode.id;

            // Split into an array
            const listIdArr = listId.split('-');

            // Get Actual ID
            const id = parseInt(listIdArr[1]);

            // Get Item
            const itemToEdit = ItemCtrl.getItemById(id)
            
            // Set current Item
            ItemCtrl.setCurrentItem(itemToEdit)

            // Add item to form / init edit state
            UICtrl.addItemToForm()
        }
    }

    // Update State
    const itemUpdateSubmit = function(e) {
        e.preventDefault();

        // Get Input Item
        const input = UICtrl.getItemInput();

        // Update Item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get Total Calories
        const totalCalories = ItemCtrl.getTotalCalories()

        // Persist and add Total Calories To UI
        UICtrl.showTotalCalories(totalCalories)

        // Update LS
        StorageCtrl.updateItemStorage(updatedItem);

        // Clear Edit state
        UICtrl.clearEditState()
    }
    
    // Delete Meal Event 
    const itemDeleteSubmit = function(e) {
        e.preventDefault();

        // Get Current Item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete From UI
        UICtrl.deleteListItem(currentItem.id);

        // Get Total Calories
        const totalCalories = ItemCtrl.getTotalCalories()

        // Persist Total Calories To UI
        UICtrl.showTotalCalories(totalCalories)

        // Delete from local Storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        // Clear Edit state
        UICtrl.clearEditState();
    }

    // Clear All Items Event
    const clearAllItemsClick = function(e) {
        e.preventDefault();

        // Clear All Items From Data Structure
        ItemCtrl.clearAllItems();

        // Remove from UI
        UICtrl.removeItems();

        // Get Total Calories
        const totalCalories = ItemCtrl.getTotalCalories()

        // Persist Total Calories To UI
        UICtrl.showTotalCalories(totalCalories)

        // Clear From Local Storage
        StorageCtrl.clearItemsFromStorage();

        // Hide UL
        UICtrl.hideList();

    }
    // Public Methods
    return{

        init: function() {
            console.log('initializing app');

            // Set Button Initial State
            UICtrl.clearEditState();

            // Fetch items from data structure
            const items = ItemCtrl.getItems();

            // Check for existing items
            if(items.length === 0){
                UICtrl.hideList();
            } else{
                // populate list with items
                UICtrl.populateItemList(items);
            }

            // Get Total Calories
            const totalCalories = ItemCtrl.getTotalCalories()

            // Persist Total Cakories To UI
            UICtrl.showTotalCalories(totalCalories);


            // Load Event Listners
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();