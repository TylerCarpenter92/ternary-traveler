import { API } from "./api.js";

console.log(
  "Your Webpack application is set up and ready to go. Please start writing code."
);

API.getData("interests", "?_expand=place").then(data => {
  let interestPointer = document.querySelector("#interests-here");
  data.forEach(currentInterest => {
    let interestCard = createInterestCard(currentInterest);
    interestPointer.appendChild(interestCard);
  });
});

function InterestForm(func){
    const domContainer = document.querySelector("#container")
    let articleForm = createArticleForm()
    domContainer.innerHTML = articleForm
    domContainer.appendChild(createSubmitArticleBtn(func))
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
    //   editBtnClicked(data)
  });

  deleteBtn.addEventListener("click", event => {
    API.deleteData("interests", data.id).then(data => {
      API.getData("interests", "?_expand=place").then(addinterestToDom);
    });
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

function createArticleForm() {
    return `<form>
      <section>
        <fieldset>
          <label>Title</label>
          <input type="text" name="article-title" id="article-title" class="form-control"/>
        </fieldset>
      </section>
      <section>
        <fieldset>
          <label>URL</label>
          <input type="text" name="article-url" id="article-url" class="form-control"/>
        </fieldset>
      </section>
      <section>
        <fieldset>
          <label>Synopsis</label>
          <textarea name="article-synopsis" id="article-synopsis" cols="30" rows="5" class="form-control"></textarea>
        </fieldset>
      </section>
      <section>
          <fieldset>
            <label>Date</label>
            <input type="text" name="article-date" id="article-date" class="form-control"/>
          </fieldset>
        </section>
    </form>`;
  }
