let addItem = document.getElementById("form");
addItem.addEventListener('submit', event => {
    event.preventDefault();
    let i = Date.now();
    let text = document.getElementById("to-do-input");
    let item = db.collection('to-do-items').doc(`${i}`);
    if (text.value.trim() == "") {
        console.log("." + text.value.trim()+ ".");
        text.classList.add("invalid")
        text.placeholder = "Invalid input! Please try again."
    } else {
        text.classList.remove("invalid")
        item.set({
            text: text.value.trim(),
            status: "active"
        });
        text.placeholder = "Create a new to do..."
    }
    text.value = "";
});

db.collection("select-status-show").onSnapshot((snapshot) => {
    let statusValue = [];
    snapshot.docs.forEach((doc) => {
        statusValue.push({
            status: doc.data().status
        })
    })
    let item = db.collection("select-status-show").doc("status-id")
    let activeItem1 = document.getElementById("all")
    let activeItem2 = document.getElementById("active")
    let activeItem3 = document.getElementById("completed")
    activeItem1.addEventListener("click", () => {
        item.update({
            status: "all"
        });
    })
    activeItem2.addEventListener("click", () => {
        item.update({
            status: "active"
        });

    })
    activeItem3.addEventListener("click", () => {
        item.update({
            status: "completed"
        });

    })
    item.get().then((item) => {
        if (item.data().status == "all") {
            let activeItem1 = document.getElementById("all")
            let activeItem2 = document.getElementById("active")
            let activeItem3 = document.getElementById("completed")
            activeItem1.classList.add("active")
            activeItem2.classList.remove("active")
            activeItem3.classList.remove("active")
            db.collection("to-do-items").onSnapshot((snapshot) => {
                let items = [];
                snapshot.docs.forEach((doc) => {
                    items.push({
                        id: doc.id,
                        text: doc.data().text,
                        status: doc.data().status
                    })
                })
                generateItems(items, item);
                clearItems(items);
            })
        }
        if (item.data().status == "active") {
            let activeItem1 = document.getElementById("all")
            let activeItem2 = document.getElementById("active")
            let activeItem3 = document.getElementById("completed")
            activeItem2.classList.add("active")
            activeItem3.classList.remove("active")
            activeItem1.classList.remove("active")
            db.collection("to-do-items").onSnapshot((snapshot) => {
                let items = [];
                snapshot.docs.forEach((doc) => {
                    if (doc.data().status == "active") {
                        items.push({
                            id: doc.id,
                            text: doc.data().text,
                            status: doc.data().status
                        })
                    }
                })
                generateItems(items, item);
                clearItems(items);
            })
        }
        if (item.data().status == "completed") {
            let activeItem1 = document.getElementById("all")
            let activeItem2 = document.getElementById("active")
            let activeItem3 = document.getElementById("completed")
            activeItem3.classList.add("active")
            activeItem1.classList.remove("active")
            activeItem2.classList.remove("active")
            db.collection("to-do-items").onSnapshot((snapshot) => {
                let items = [];
                let i = 0;
                let j = 0;
                snapshot.docs.forEach((doc) => {
                    if (doc.data().status == "active") {
                        i++;
                    }
                    if (doc.data().status == "completed") {
                        j++;
                        items.push({
                            id: doc.id,
                            text: doc.data().text,
                            status: doc.data().status
                        })
                    }
                })
                generateItems(items, item);
                if (i == 1) {
                    document.getElementById("items-left").innerHTML = i + " item left";
                } else {
                    document.getElementById("items-left").innerHTML = i + " items left";
                }
                if (j == 0) {
                    let emptyToDo = document.querySelector(".to-do-items");
                    emptyToDo.innerHTML = `
                    <div class="to-do-item-empty">
                        <div class="to-do-text-empty">
                            You have no ${item.data().status} items in your to do list, start working!
                        </div>
                    </div>
                    `;
                }
                clearItems(items);
            })
        }
    })
})

function generateItems(items, item) {
    let itemsHTML = "";
    let i = 0;
    let j = 0;

    items.forEach((item) => {
        itemsHTML = `
            <div class="to-do-item">
                <div class="to-do-text ${item.status == "completed" ? "checked":""}">
                    ${item.text}
                </div>
                <div class="buttons">
                    <button class="btn btn-mark-as-done ${item.status == "completed" ? "checked":""}" data-markid="${item.id}">Mark as done</button>
                    <button class="btn btn-edit" data-editid="${item.id}">Edit</button>
                    <button class="btn btn-delete" data-deleteid="${item.id}">Delete</button>
                </div>
            </div>
            <div class="edit-modal modal-wrapper" data-editmodalid="${item.id}">
                <div class="modal">
                    <div class="modal-header">
                        <h3>Edit Item</h3>
                    </div>
                    <div class="modal-body">
                        <form class="edit-form" id="edit-form" data-editmodalformid="${item.id}" autocomplete="off">
                            <input class="edit-input" type="text" id="edit-input" data-editmodalinputid="${item.id}" name="text" placeholder="Edit">
                        </form>
                        <button class="btn btn-exit" data-editmodalbtnexitid="${item.id}" >Exit</button>
                    </div>
                </div>
            </div>
        ` + itemsHTML;
        if (item.status == "active") {
            i++;
        }
        if (item.status == "completed") {
            j++;
        }
    })
    document.querySelector(".to-do-items").innerHTML = itemsHTML;
    if (i == 1) {
        document.getElementById("items-left").innerHTML = i + " item left";
    } else if (i == 0) {
        let emptyToDo = document.querySelector(".to-do-items");
        if (item.data().status == "all" && j == 0) {
            emptyToDo.innerHTML = `
            <div class="to-do-item-empty">
                <div class="to-do-text-empty">
                    You have no items in your to do list, try adding some.
                </div>
            </div>
            `;
        } else if (item.data().status == "active") {
            emptyToDo.innerHTML = `
            <div class="to-do-item-empty">
                <div class="to-do-text-empty">
                    You have no ${item.data().status} items in your to do list, woohoo.
                </div>
            </div>
            `;
        }
        document.getElementById("items-left").innerHTML = i + " items left";
    } else {
        document.getElementById("items-left").innerHTML = i + " items left";
    }
    createEventListeners();
}

let itemsClear = document.getElementById("items-clear");

function clearItems(docItems) {
    itemsClear.addEventListener("click", () => {
        docItems.forEach((doc) => {
            if (doc.status == "completed") {
            db.collection("to-do-items").doc(doc.id).delete();
            }
        });
    });
}
