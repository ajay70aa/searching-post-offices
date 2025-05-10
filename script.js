const ctaHeading = document.getElementById('cta-heading')
const ctaButton = document.getElementById('cta-button')
const heroSection = document.getElementById('hero-section')
const contentPage = document.getElementById('content-page')
const mapSection = document.querySelector(".map-section")

const detailsSection = document.getElementById("details-section")
const moreInfoSection = document.querySelector(".more-info-section")
const postOfficeContainer = document.getElementById("post-offices-container")

const searchInput = document.getElementById("search")

let ip = null
let postOffices = []
let filteredOffices = []

document.addEventListener("DOMContentLoaded", function() {
  ctaHeading.innerHTML = ""
  // Fetch the IP address from the API
  fetch("https://api.ipify.org?format=json")
      .then(response => response.json())
      .then(data => {
          // Display the IP address on the screen
          ip = data.ip
          ctaHeading.innerHTML += `Your current IP address: ${ip}`
      })
      .catch(error => {
          console.error("Error fetching IP address:", error);
      });
});
ctaButton.addEventListener("click", () => {
  heroSection.style.display = "none"
  contentPage.style.display = "block"
  detailsSection.innerHTML = ""
  mapSection.innerHTML = ""
  moreInfoSection.innerHTML = ""
  postOfficeContainer.innerHTML = ""

  fetch(`https://ipapi.co/${ip}/json/`)
  .then(response => response.json())
  .then((data) => {
    console.log(data)
    const headerSection = document.createElement("div")
    headerSection.classList.add("header-section")
    headerSection.innerHTML += `
      <h1>IP Address: ${data.ip}</h1>
      <div class="client-details">
        <div>
          <p>Lat: ${data.latitude}</p>
          <p>Long: ${data.longitude}</p>
        </div>
        <div>
          <p>City: ${data.city}</p>
          <p>Region: ${data.region}</p>
        </div>
        <div>
          <p>Organization: ${data.org}</p>
          <p>Hostname: ${data.version}</p>
        </div>
      </div>
    `
    detailsSection.appendChild(headerSection)

    const mapDetails = document.createElement("div");
    const heading = document.createElement("h1");
    heading.textContent = "Your Current Location";
    const iframe = document.createElement("iframe");
    iframe.src = `https://maps.google.com/maps?q=${data.latitude},${data.longitude}&z=15&output=embed`;
    iframe.style.width = "100%";
    iframe.style.height = "680px";
    iframe.style.border = "0";
    iframe.setAttribute("allowfullscreen", "");

    mapDetails.appendChild(heading);
    mapDetails.appendChild(iframe);
    mapSection.appendChild(mapDetails);

    const moreInfo = document.createElement("div")
    moreInfo.classList.add("more-info")
    let dateTimeStr = new Date().toLocaleString("en-US", { timeZone: data.timezone });
    moreInfo.innerHTML += `
      <p>Time Zone: ${data.timezone}</p>
      <p>Date And Time: ${dateTimeStr}</p>
      <p>Pincode: ${data.postal}</p>
      <p>Message: Number of pincode(s) found: 01</p>
    `
    moreInfoSection.appendChild(moreInfo)

    return fetch(`https://api.postalpincode.in/pincode/${data.postal}`)
  })
  .then((res) => res.json())
  .then((result) => {
    postOffices = result[0].PostOffice;
    filteredOffices = [...postOffices]
    renderPostOffices()
  })
  .catch(error => {
    console.error("Error fetching data:", error)
  })
})

function handleInputChange(e){
  const search = e.target.value.toLowerCase();
  filteredOffices = postOffices.filter(office =>
    office.Name.toLowerCase().includes(search)
  );
  renderPostOffices()
}
  // Clear current list
function renderPostOffices(){
  postOfficeContainer.innerHTML = "";

  if (filteredOffices.length === 0) {
    const noResult = document.createElement("p");
    noResult.textContent = "No results found.";
    noResult.style.fontWeight = "bold";
    postOfficeContainer.appendChild(noResult);
    return;
  }

  filteredOffices.forEach((office) => {
    const postCard = document.createElement("div");
    postCard.classList.add("post-card");
    postCard.innerHTML += `
      <p>Name: ${office.Name}</p>
      <p>Branch Type: ${office.BranchType}</p>
      <p>Delivery Status: ${office.DeliveryStatus}</p>
      <p>District: ${office.District}</p>
      <p>Division: ${office.Division}</p>
    `;
    postOfficeContainer.appendChild(postCard);
  });
}

searchInput.addEventListener("input", handleInputChange)