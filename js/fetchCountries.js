export async function fetchCountries(name) {
    const response = await fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,flags,capital,population,languages`);
    if (!response.ok) {
        throw new Error(response.status);
    }
    return response.json();
}
