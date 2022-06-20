function createEventListeners() {
  let toDoCheckMarks = document.querySelectorAll(".to-do-item .btn-mark-as-done");
  let toDoDelete = document.querySelectorAll(".to-do-item .btn-delete");
  let btnEdit = document.querySelectorAll(".to-do-item .btn-edit");

  toDoCheckMarks.forEach((checkMark) => {
    checkMark.addEventListener("click", () => {
      markCompleted(checkMark.dataset.markid);
    });
  });

  toDoDelete.forEach((removeItem) => {
    removeItem.addEventListener("click", () => {
      deleteItem(removeItem.dataset.deleteid);
    });
  });

  btnEdit.forEach((edit) => {
    edit.addEventListener("click", () => {
      openEdit(edit.dataset.editid);
    });
  });
}

function openEdit(id) {
  let editModal = document.querySelector(`[data-editmodalid='${id}']`);
  let editModalForm = document.querySelector(`[data-editmodalformid='${id}']`);
  let exitBtn = document.querySelector(`[data-editmodalbtnexitid='${id}']`);
  let text = document.querySelector(`[data-editmodalinputid='${id}']`);
  editModal.classList.add("modal-show");

  let item = db.collection("to-do-items").doc(id);
  item.get().then((doc) => {
    editModalForm.text.value = doc.data().text;
  });
  editModalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (text.value.trim() == "") {
      item.get().then((doc) => {
        editModalForm.text.value = "";
      });
      text.classList.add("invalid");
      text.placeholder = "Invalid input! Please try again.";
    } else {
      text.classList.remove("invalid");
      item.update({
        text: text.value.trim(),
      });
      editModal.classList.remove("modal-show");
    }
  });
  exitBtn.addEventListener("click", () => {
    text.classList.remove("invalid");
    editModal.classList.remove("modal-show");
  });
}

function markCompleted(id) {
  let item = db.collection("to-do-items").doc(id);
  item.get().then((doc) => {
    let status = doc.data().status;
    if (status == "active") {
      item.update({
        status: "completed",
      });
    } else if (status == "completed") {
      item.update({
        status: "active",
      });
    }
  });
}

function deleteItem(id) {
  let item = db.collection("to-do-items").doc(id);
  item.delete();
}