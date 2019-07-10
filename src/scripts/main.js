import { API } from "./api.js";

console.log(
  "Your Webpack application is set up and ready to go. Please start writing code."
);

//7-10 commit

const domContainer = document.querySelector("#container");

function createFormBtn() {
  let formBtn = document.createElement("button");
  formBtn.setAttribute("id", "add-new-interest");
  formBtn.textContent = "create new interest";
  formBtn.addEventListener("click", () => {
    console.log("click");
    domContainer.innerHTML = "<h2>please fill out form</h2>";
    createInterestClick(createInterestForm, API.addData, null);
  });
  return formBtn;
}

addinterestToDom();

function addinterestToDom() {
    domContainer.appendChild(createFormBtn())
    let div = document.createElement("div")
    div.setAttribute("id", "interests-here")
    domContainer.appendChild(div)
    let interestPointer = document.querySelector("#interests-here")
  API.getData("interests", "?_expand=place").then(data => {
    interestPointer.innerHTML = "<h2>interests</h2>";
    data.forEach(currentInterest => {
      let interestCard = createInterestCard(currentInterest);
      interestPointer.appendChild(interestCard);
    });
  });
}

function createInterestClick(func1, func2,data) {
  const domContainer = document.querySelector("#container");
  let interestForm = func1(data);
  domContainer.innerHTML = interestForm;
  domContainer.appendChild(createSubmitInterestBtn(func2));
}

function createInterestCard(data) {
  let interestCard = document.createElement("section");
  interestCard.setAttribute("id", `interest-${data.id}`);
  interestCard.innerHTML = interestToHTML(data);
  let editBtn = document.createElement("button");
  editBtn.setAttribute("id", `edit-${data.id}`);
  let deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("id", `delete-${data.id}`);
  editBtn.textContent = "edit";
  deleteBtn.textContent = "delete";

  editBtn.addEventListener("click", event => {
       editBtnClicked(data)
  });

  deleteBtn.addEventListener("click", event => {
      if(confirm(`Are you sure you want to remove "${data.name}" event?`)){
        API.deleteData("interests", data.id).then(data => {
            API.getData("interests", "?_expand=place").then(addinterestToDom);
            alert("interest removed!")
        });
      }
  });
  interestCard.appendChild(editBtn);
  interestCard.appendChild(deleteBtn);

  return interestCard;
}
function interestToHTML(data) {
  return `
    <h3>place: ${data.place.name}</h3>
    <h4>${data.name}</h4>
    <p>${data.description}</p>
    <p>${data.cost}</p>
    <p>${data.review}</p>
`;
}

function createInterestForm(data) {
  return `<form>
      <fieldset>
      <label>please select an option</label>
      <select id="place">
      <option value=1>Italy</option>
      <option value=2>Switzerland</option>
      <option value=3>France</option>
      </select>
      </fieldset>
      <section>
        <fieldset>
          <label>name of interest</label>
          <input type="text" id="interest-name" class="form-control"/>
        </fieldset>
      </section>
      <section>
        <fieldset>
          <label>description</label>
          <textarea type="text" id="interest-description" class="form-control"></textarea>
        </fieldset>
      </section>
      <section>
        <fieldset>
        <label>cost</label>
        <input type="text" id="interest-cost" class="form-control"/>
        </fieldset>
      </section>
      <section>
          <fieldset>
          <label>review</label>
          <textarea type="text" id="interest-review" class="form-control"></textarea>
          </fieldset>
        </section>
    </form>`;
}

function createSubmitInterestBtn(func) {
  let SubmitBtn = document.createElement("button");
  SubmitBtn.setAttribute("id", "interest-submit-btn");
  SubmitBtn.textContent = "Submit";
  SubmitBtn.addEventListener("click", event => {
    let placeId = document.getElementById("place").value;
    let name = document.getElementById("interest-name").value;
    let description = document.getElementById("interest-description").value;
    let cost = document.getElementById("interest-cost").value;
    let review = document.getElementById("interest-review").value;
    let newInterest = {}
    if(document.querySelector("#interest-id")){
      let interestId = document.querySelector("#interest-id").value
      newInterest = createInterest(placeId, name, description, cost, review, interestId);
    }
    else{
      newInterest = createInterest(placeId, name, description, cost, review, "");
    }

    console.log(newInterest);
    func("interests", newInterest).then(data => {
      domContainer.innerHTML = "";
      addinterestToDom();
    });
  });
  return SubmitBtn;
}

function createInterest(placeId, name, description, cost, review,id) {
  return {
    placeId,
    name,
    description,
    cost,
    review,
    id
  };
}

function editBtnClicked(data) {
    createInterestClick(createEditForm, API.editData, data);
  let costPointer = document.querySelector("#interest-cost")
  let reviewPointer = document.querySelector("#interest-review")
  costPointer.setAttribute("value", data.cost)
  reviewPointer.textContent = data.review
}

function createEditForm(data) {
  return `
    <input hidden id="interest-id" value=${data.id} />
    <h3>place: ${data.place.name}</h3>
    <input hidden id="place" value=${data.place.id} />
    <h4>${data.name}</h4>
    <input hidden id="interest-name" value=${data.name} />
    <p>${data.description}</p>
    <input hidden id="interest-description" value=${data.description} />
    <form>
     <section>
      <fieldset>
       <label>cost</label>
       <input type="text" id="interest-cost" class="form-control"/>
      </fieldset>
    </section>
    <section>
      <fieldset>
      <label>review</label>
      <textarea type="text" id="interest-review" class="form-control"></textarea>
      </fieldset>
    </section>
    </form>
    `;
}
