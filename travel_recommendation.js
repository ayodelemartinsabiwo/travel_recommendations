const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');

function showRecommendation() {
    const searchInput = document.getElementById('destinationInput').value.toLowerCase().trim();
    const result = document.getElementById('result');
    result.innerHTML = '';
    document.getElementById('destinationInput').value = '';

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            const matchingResults = [];

            data.countries.forEach(country => {

                if (country.name.toLowerCase().includes(searchInput)) {
                    matchingResults.push({ type: 'country', data: country });
                }

                country.cities.forEach(city => {
                    if (city.description.toLowerCase().includes(searchInput)) {
                        matchingResults.push({ type: 'city', data: city, country: country.name });
                    }
                });
            });

            data.temples.forEach(temple => {
                if (temple.name.toLowerCase().includes(searchInput) || temple.description.toLowerCase().includes(searchInput)) {
                    matchingResults.push({ type: 'temple', data: temple });
                }

            });

            data.beaches.forEach(beach => {
                if (beach.name.toLowerCase().includes(searchInput) || beach.description.toLowerCase().includes(searchInput)) {
                    matchingResults.push({ type: 'beach', data: beach });
                }

            });

            if (matchingResults.length > 0) {
                result.innerHTML = '<h3>Search Results:</h3>';
                const ul = document.createElement('ul');

                matchingResults.forEach(item => {
                    const li = document.createElement('li');

                    // Define a mapping for time zones by country or city
                    const timeZoneMap = {
                        "Australia": "Australia/Sydney",
                        "Japan": "Asia/Tokyo",
                        "Brazil": "America/Sao_Paulo"
                    };


                    if (item.type === 'country') {

                            // Get the correct time zone from the map or default to 'UTC'
                            let timeZone = timeZoneMap[item.data.name] || 'UTC';

                            // Attempt to get the current time in the specified time zone
                            let countryTime;
                            try {
                                const options = { timeZone: timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
                                countryTime = new Date().toLocaleTimeString('en-US', options);
                            } catch (error) {
                                console.error(`Invalid time zone for ${item.data.name}: ${timeZone}. Defaulting to UTC.`);
                                countryTime = new Date().toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' });
                            }

                            // // Use the first city's time zone if available
                            // const timeZone = item.data.cities.length > 0 ? item.data.cities[0].name : 'UTC';
                            // const options = { timeZone: timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
                            // const countryTime = new Date().toLocaleTimeString('en-US', options);

                            li.innerHTML = `<strong>Country:</strong> ${item.data.name}<br>`;
                            li.innerHTML += `<h4>Curent Time: ${countryTime}</h4><br>`;
                            li.innerHTML += '<strong>Cities:</strong>';

                            const citiesUl = document.createElement('ul');
                            item.data.cities.forEach(city => {
                            const cityLi = document.createElement('li');
                            cityLi.innerHTML = `${city.name}<br><img class="cityImg" src="./images/${city.imageUrl}"><br><strong>Description:</strong><br>${city.description} <button id="bookNow" style="margin-top: 0px;">Visit</button><br><br>`;
                            citiesUl.appendChild(cityLi);


                    })
                    li.appendChild(citiesUl);

                } else if(item.type === 'temple' || item.type === 'beach') {
                        li.innerHTML = `<strong>${item.type}:</strong> ${item.data.name}<br>`;
                        li.innerHTML += `${item.data.name}<br><img class="cityImg" src="./images/${item.data.imageUrl}"><br><b>Description:</b><br>${item.data.description} <button class="btn btn-warning btn-sm">Visit</button><br><br>`;

                    } else {
                        if(item.type === 'country') {
                            li.innerHTML = `<strong>City:</strong> ${item.data.name} (${item.country})<br>`;
                            li.innerHTML += `<img class="cityImg" src="./images/${item.data.imageUrl}"><br>`;
                            li.innerHTML += `<b>Description:</b><br>${item.data.description} <button class="btn btn-warning btn-sm">Visit</button><br><br>`;
                        } else {
                            li.innerHTML = `<strong>${item.type}:</strong> ${item.data.name}<br>`;
                            li.innerHTML += `<img class="cityImg" src="./images/${item.data.imageUrl}"><br>`;
                            li.innerHTML += `<b>Description:</b><br>${item.data.description} <button class="btn btn-warning btn-sm">Visit</button><br><br>`;
                        }

                    }
                    ul.appendChild(li);
                });

                result.appendChild(ul);
            } else {
                result.innerHTML = '<p>No matching results found!</p>';
            }

            result.style.visibility = 'visible';
        })
        .catch(error => {
            console.error('Error:', error);
            result.innerHTML = 'Error occurred while fetching data.';
            result.style.visibility = 'visible';
        });
}

document.getElementById('result').style.visibility = 'hidden'
// Don't forget to add event listeners for your buttons
btnSearch.addEventListener('click', showRecommendation);
btnClear.addEventListener('click', () => {
    document.getElementById('destinationInput').value = '';
    document.getElementById('result').innerHTML = '';
    document.getElementById('result').style.visibility = 'hidden';
});
