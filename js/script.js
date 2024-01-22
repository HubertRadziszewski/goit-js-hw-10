import Notiflix from "notiflix";
import debounce from "debounce";
import { fetchCountries } from "./fetchCountries";

const inp = document.querySelector("#text-input");
const res = document.querySelector("#response");

function fetchCountries(name) {
  if (name.trim() === "") {
    return Promise.resolve([]);
  }

  return fetch(`https://restcountries.com/v3.1/name/${name}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    });
}

function clearResults() {
  res.innerHTML = "";
}

function formatLanguages(languages) {
  return Object.values(languages).join(", ");
}

function searchForCountry(name) {
  const search = debounce(() => {
    fetchCountries(name)
      .then((countryList) => {
        console.log(countryList);
        if (countryList.length === 0) {
          Notiflix.Notify.failure("Oops, there is no country with that name.");
        } else if (countryList.length > 10) {
          Notiflix.Notify.failure("Too many matches found. Please enter a more specific name.");
        } else {
          const html = countryList.map((countryInfo) => {
            return `<div class="country">`+
              `<p class="name">` +
                `<img width="64" height="32" src="${countryInfo.flags.svg}" alt="${countryInfo.flags.alt}"></img>` +
                `<span>${countryInfo.name.common}</span>` +
                `${countryList.length === 1 ? 
                  `<p class="capital">`+
                    `<b>Capital: </b>`+
                    `<span>${countryInfo.capital}</span>`+
                  `</p>`+
                  `<p class="population">`+
                    `<b>Population: </b>`+
                    `<span>${countryInfo.population}</span>`+
                  `</p>`+
                  `<p class="languages">`+
                    `<b>Languages: </b>`+
                    `<span>${formatLanguages(countryInfo.languages)}</span>`+
                  `</p>` : ''}`+
              `</div>`;
          }).join("");
          res.innerHTML = html;
        }
      })
      .catch((err) => {
        if (err.message.includes('404')) {
          Notiflix.Notify.failure("Oops, there is no country with that name.");
        } else {
          Notiflix.Notify.failure(err.message);
        }
      });
  }, 300);

  search();
}

inp.addEventListener("input", (event) => {
  const country = event.target.value;
  searchForCountry(country);
});

inp.addEventListener("input", () => {
  const country = inp.value;
  if (country.trim() === "") {
    clearResults();
  }
});