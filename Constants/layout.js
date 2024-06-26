//Use this for type_of_input to prevent typos
export const inputTypes = {
    counter: "counter",
    number: "number",
    text: "text",
    select: "radio",
    checkbox: "checkbox"
};
/*  
    The two array lists below are layouts for Pit and Match Scouting Forms.
    Edit these variables according to each year's game.
    Adjust these lists as needed.

    Also, if input type is a select OR checkbox, then add a 4th item to the list like this:
    choices: [item1, item2, item3, ...]

    If checkbox has only one item, leave it as it is.
*/

//Layout for Match Scouting Form
export const match_layout = {
    auto: {
        0: {
            task: "Leave Auto",
            points: 2, 
            type_of_input: inputTypes.select,
            choices: ["Yes", "No"]
        },
        1: {
            task: "AMP Notes",
            points: 2,
            type_of_input: inputTypes.counter
        },
        2: {
            task: "Speaker Notes",
            points: 5,
            type_of_input: inputTypes.counter
        }
    },
    teleop: {
        0: {
            task: "AMP Notes",
            points: 1,
            type_of_input: inputTypes.counter
        },
        1: {
            task: "Speaker Notes (not AMP)",
            points: 2,
            type_of_input: inputTypes.counter
        },
        2: {
            task: "Speaker Notes (AMP)",
            points: 5,
            type_of_input: inputTypes.counter
        }
    },
    endGame: {
        0: {
            task: "Park",
            points: 1,
            type_of_input: inputTypes.select,
            choices: ["Yes", "No"]
        },
        1: {
            task: "Onstage (not SPOTLIT)",
            points: 3,
            type_of_input: inputTypes.select,
            choices: ["Yes", "No"]
        },
        2: {
            task: "Onstage (SPOTLIT)",
            points: 4,
            type_of_input: inputTypes.select,
            choices: ["Yes", "No"]
        },
        3: {
            task: "Harmony",
            points: 2,
            type_of_input: inputTypes.select,
            choices: ["Yes", "No"]
        },
        4: {
            task: "Note in TRAP",
            points: 5,
            type_of_input: inputTypes.select,
            choices: ["Yes", "No"]
        }
    },
    matchEval: {
        0: {
            task: "Died during the match (or never started)?",
            type_of_input: inputTypes.checkbox
        },
        1: {
            task: "Recovered from freeze?",
            type_of_input: inputTypes.checkbox
        },
        2: {
            task:"Damaged from beginning?",
            type_of_input: inputTypes.checkbox
        },
        3: {
            task: "Damaged during match?",
            type_of_input: inputTypes.checkbox
        },
        4: {
            task: "Recovered from freeze?",
            type_of_input: inputTypes.checkbox
        },
        5: {
            task: "Outstanding performance?",
            type_of_input: inputTypes.checkbox
        }
    }
}

//Layout for Pit Scouting Form
export const pit_layout = {

    auto: {
        0: {
            question: "Leave Auto?", 
            type_of_input: inputTypes.select,
            choices: ["Yes", "No"]
        },
        1: {
            question: "How many AMP Notes?",
            type_of_input: inputTypes.number
        },
        2: {
            question: "How many Speaker Notes?",
            type_of_input: inputTypes.number
        },
        3: {
            question: "Is there anything special you would like to share about your Auto?",
            type_of_input: inputTypes.text
        }
    },
    teleop: {
        0: {
            question: "How many AMP Notes?",
            type_of_input: inputTypes.number
        },
        2: {
            question: "What your cycle time?",
            type_of_input: inputTypes.text
        }
    },
    endGame: {
        1: {
            question: "Onstage?",
            type_of_input: inputTypes.select,
            choices: ["Yes", "No"]
        },
        3: {
            question: "Can you harmony?",
            type_of_input: inputTypes.select,
            choices: ["Yes", "No"]
        },
        4: {
            question: "Note in TRAP?",
            type_of_input: inputTypes.select,
            choices: ["Yes", "No"]
        }
    },
    other: {
        0: {
            question: "What is your best strategy for this season?",
            type_of_input: inputTypes.text
        },
        //TODO: add more questions
        1: {
            question: "Interesting facts?",
            type_of_input: inputTypes.text
        }
    }
}


//General function to create form
    //Example in use: createForm(match_layout.auto, 'auto', auto_td);
export function createForm(layout, label, html_td) {
    let i = 0;
    while(layout[i]) {
        if (layout[i].type_of_input === inputTypes.select) {
            
            // Create a div for the choices
            const choicesDiv = document.createElement('div');

            //Create task label
            choicesDiv.innerHTML += 
            `<label>${layout[i].task}</label><br>`;
            //Create choices
            for (let j = 0; j < layout[i].choices.length; j++) {
            choicesDiv.innerHTML += `<input id="${label}Task_${i}_${layout[i].choices[j].replace(/\s/g, "_")}" name="input_${layout[i].task.replace(/\s/g, "_")}_${label}" type="${layout[i].type_of_input}"
                                <label>${layout[i].choices[j]}</label>`;
            }
            html_td.appendChild(choicesDiv);
            html_td.innerHTML += `<br><br>`;

        } else if(layout[i].type_of_input === inputTypes.checkbox) {
            if(layout[i].choices) {
                // Create a div for the choices
                const choicesDiv = document.createElement('div');

                //Create task label
                choicesDiv.innerHTML += 
                `<label>${layout[i].task}</label><br>`;
                //Create choices
                for (let j = 0; j < layout[i].choices.length; j++) {
                choicesDiv.innerHTML += `<input id="${label}Task_${i}_${layout[i].choices[j].replace(/\s/g, "_")}" name="input_${layout[i].task.replace(/\s/g, "_")}_${label}" type="${layout[i].type_of_input}"
                                    <label>${layout[i].choices[j]}</label>`;
                }
                html_td.appendChild(choicesDiv);
                html_td.innerHTML += `<br><br>`;
            } else {
                html_td.innerHTML += 
                `<input type="${layout[i].type_of_input}" id="${label}Task_${i}">${layout[i].task} <br> <br>`
            }
        }
         else if(layout[i].type_of_input === inputTypes.counter) {
            //Create task label and counter element
            html_td.innerHTML += 
            `<label>${layout[i].task}</label><br>
            <div class="counter-container" id="${layout[i].task.replace(/\s/g, "_")}_counter_${label}">
                <button id="remove_${layout[i].task.replace(/\s/g, "_")}_${label}"> - </button>
                <p id="number_${layout[i].task.replace(/\s/g, "_")}_${label}"">0</p>
                <button id="add_${layout[i].task.replace(/\s/g, "_")}_${label}"> + </button>
            </div><br>`;
        } else {
            
            //Create task label and input field
            html_td.innerHTML += 
            `<label>${layout[i].task}</label> <br>
            <input id="${label}Task_${i}" type="${layout[i].type_of_input}">
            <br><br>`;
        } 
        i++;
    }
}