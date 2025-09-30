
document.addEventListener('DOMContentLoaded', function(){

const searchButton = document.getElementById("search-btn");
const usernameInput = document.getElementById("user-input");
const statsContainer = document.querySelector(".stats-container");
const easyProgressCircle = document.querySelector(".easy-progress")
const mediumProgressCircle = document.querySelector(".medium-progress");
const hardProgressCircle = document.querySelector(".hard-progress");

const easyLabel = document.getElementById("easy-label");
const mediumLabel = document.getElementById("medium-label");
const hardLabel = document.getElementById("hard-label");

const cardStatsContainer = document.querySelector(".stats-cards");


// return true or false based on regex
function validateUsername(username){
  if(username.trim() === ""){
    alert("Username should not be empty");
    return false;
  }
  const regex = /^[a-zA-Z0-9_-]{1,15}$/;
  const isMatch = regex.test(username);
  if(!isMatch){
    alert("Invalid Username");
  }
  return isMatch;
}

async function fetchUserDetails(username) {
  const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
  try{
    searchButton.textContent = "Searching...";
    searchButton.disabled = true;

   

    const response = await fetch(url);
    if(!response.ok){
      throw new Error("unable to fetch the user details.")
    }
    const parsedData = await response.json();
    console.log("logging data: ",parsedData);
    
    displayUserData(parsedData);
  }
  catch(error){
      statsContainer.innerHTML = `<p>No data found</p>`;
  }
  finally{
     searchButton.textContent = "Search";
    searchButton.disabled = false;
  }
}

function updateProgress(solved, total, label, circle){
    const progressDegree = (solved/ total)*100;
    circle.style.setProperty("--progress-degree",`${progressDegree}%`);
    label.textContent = `${solved} / ${total}`;
}



function displayUserData(parsedData) {
    // Extract data using keys, not indexes
    const totalQues = parsedData.totalQuestions;
    const totalHardQues = parsedData.totalHard;
    const totalMediumQues = parsedData.totalMedium;
    const totalEasyQues = parsedData.totalEasy;

    const solvedTotalQues = parsedData.totalSolved;
    const solvedTotalHardQues = parsedData.hardSolved;
    const solvedTotalMediumQues = parsedData.mediumSolved;
    const solvedTotalEasyQues = parsedData.easySolved;

    // Update progress
    updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
    updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
    updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

    const cardData = [
      {label:"Overall Submissions", value:parsedData.
totalSolved},
      {label:"Overall Easy Submissions", value:parsedData.

easySolved},
      {label:"Overall Medium Submissions", value:parsedData.
mediumSolved},
      {label:"Overall Hard Submissions", value:parsedData.
hardSolved}
    ];

    console.log("Card ka Data", cardData);
    
    cardStatsContainer.innerHTML = cardData.map(
      data => {
        return`
        <div class = "card">
        <h4>${data.label}</h4>
        <p>${data.value}</p>
        </div>`
      }
    ).join("")

}


searchButton.addEventListener('click', function(){
  const username = usernameInput.value;
  console.log('logging username:', username);
  if(validateUsername(username)){
    fetchUserDetails(username);
  }
})


})
