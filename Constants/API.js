//Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, push, onValue, update, set, remove, child} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://scoutingapp-e16c4-default-rtdb.firebaseio.com/"
}

// Initialize Firebase
const app = initializeApp(appSettings);

//Connects database to app
const database = getDatabase(app); //Realtime-database

//Firebase reference
const apiKey_Firebase = ref(database, "apiKey"); //Stored in Firebase
const matchesData = ref(database, 'qualSchedule/matchesData');
const lastUpdate = ref(database, 'qualSchedule/lastUpdate');
const regionalsList = ref(database, 'generalInfo/regionalsList');
const attendingTeams = ref(database, 'generalInfo/attendingTeams');

//Variables for API
const baseUrl = 'https://www.thebluealliance.com/api/v3'; // Adjust the base URL based on the TBA API version

//TODO: change these variables to the attending regional
const year = `2024`; //yyyy
const event_code = `mndu`; //Found on 'apiDoc - Blue Alliance' OR 'Scoutradioz'
export const team_number = '2531';


//General fetch data function
function fetchData(url, apiKey, handleData) {
    return fetch(url, {
        method: 'GET',
        headers: {
            'X-TBA-Auth-Key': apiKey,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Call the handleData callback with the fetched data
        handleData(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        // Re-throw the error or return a rejected Promise to propagate the error
        throw error;
    });
}

/*
 * fetchData() is a general formated function used to fetch any data from Blue Alliance.
 * To fetch data, use the function in the following format:
        fetchData('your-url-here', 'your-api-key-here', function(data) {
            //Handle fetched data here
        });
 */

//Fetch all attending teams and their info
export function fetchAttendingTeams() {
    const url = `${baseUrl}/event/${year}${event_code}/teams`;

    onValue(apiKey_Firebase, function(snapshot) {
        let apiKey = Object.values(snapshot.val()).join(''); //Get apiKey from firebase
        console.log(apiKey);
        
        // Make the API request for data
        fetchData(url, apiKey, function(data) {
            let sortedTeamsByNumber = data
            .sort((a, b) => a.team_number - b.team_number); // Sort by team_number
            set(attendingTeams, sortedTeamsByNumber); //Upload attendingTeams to Firebase        
        });
        
    });
}

//Fetch all regionals of selected year
export function fetchRegionals(year, event_code) {
    const url = `${baseUrl}/events/${year}/simple`;

    onValue(apiKey_Firebase, function(snapshot) {
        let apiKey = Object.values(snapshot.val()).join(''); //Get apiKey from firebase
        console.log(apiKey);
        
        // Make the API request for data
        fetchData(url, apiKey, function(data) {
            set(regionalsList, data);
            console.log(data);
        });
        
    });
}

//Fetch Qualification Matches Schedule
export function fetchQualSchedule() {
    const url = `${baseUrl}/event/${year}${event_code}/matches`;

    onValue(apiKey_Firebase, function(snapshot) {
        let apiKey = Object.values(snapshot.val()).join(''); //Get apiKey from firebase
        console.log(apiKey);
        
        // Make the API request for data
        fetchData(url, apiKey, function(data) {
            //This variable contains filtered and sorted data.
            let sortedAndFilteredMatches = data
                .filter(match => match.comp_level === 'qm') // Filter by comp_level 'qm'
                .sort((a, b) => a.match_number - b.match_number); // Sort by match_number
                
                set(matchesData, sortedAndFilteredMatches); //Push data to Firebase
                set(lastUpdate, Date.now()); //Update on the updatedTime
        });
        
    });
}
